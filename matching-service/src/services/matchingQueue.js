const redis = require('../config/redis');
const { v4: uuidv4 } = require('uuid')

const MATCH_TIMEOUT = 30; //In seconds
const QUEUE_TTL = MATCH_TIMEOUT + 5;

async function addToQueue(userId, topics, difficulty) {
    for(const topic of topics) {
        const key = `queue:${topic}:${difficulty}`;
        const entries = await redis.lrange(key, 0, -1);

        for(const raw of entries) {
            const entry = JSON.parse(raw);
            if(entry.userId === userId) {
                await redis.lrem(key, 0, raw);
                break;
            }
        }

        const entry = JSON.stringify({userId, joinedAt: Date.now() });
        await redis.lpush(key, entry);
        await redis.expire(key, QUEUE_TTL);
    }
}

async function setBothMatchStatuses(userAId, userAStatus, userBId, userBStatus) {
    await redis.multi()
        .set(`match:status:${userAId}`, JSON.stringify(userAStatus), "EX", 60)
        .set(`match:status:${userBId}`, JSON.stringify(userBStatus), "EX", 60)
        .exec();
}

async function findMatch(userId, topics, difficulty){
    for(const topic of topics) {
        const key = `queue:${topic}:${difficulty}`;
        const entries = await redis.lrange(key, 0, -1);

        for (const raw of entries) {
            const entry = JSON.parse(raw);

            if(entry.userId === userId) continue;

            const claimKey = `match:claim:${entry.userId}`;
            const claimed = await redis.set(claimKey, userId, 'NX', 'EX', 10);

            if (claimed) {
                await redis.lrem(key, 0, raw);
                await removeFromQueue(userId, topics, difficulty);
                const sessionId = uuidv4();
                return {matched: true, sessionId, matchedUserId: entry.userId, matchedTopic: topic};
            }
        }
    }
    return { matched: false };
}

async function removeFromQueue(userId, topics, difficulty) {
    for(const topic of topics){
        const key = `queue:${topic}:${difficulty}`;
        const entries = await redis.lrange(key, 0, -1);

        for (const raw of entries) {
            const entry = JSON.parse(raw);
            if(userId === entry.userId) {
                await redis.lrem(key, 0, raw)
                break;
            }
        }
    }
}

async function setMatchStatus(userId, status) {
    await redis.set(`match:status:${userId}`, JSON.stringify(status), `EX`, 60)
}

async function getMatchStatus(userId) {
    const raw = await redis.get(`match:status:${userId}`);
    return  raw ? JSON.parse(raw) : null
}

module.exports = {
    addToQueue,
    findMatch,
    removeFromQueue,
    setMatchStatus,
    getMatchStatus,
    setBothMatchStatuses,
    MATCH_TIMEOUT,
};