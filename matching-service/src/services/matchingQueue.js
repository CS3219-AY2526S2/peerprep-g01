const redis = require('../config/redis');
const { v4: uuidv4 } = require('uuid')

const MATCH_TIMEOUT = 30; //In seconds

async function addToQueue(userId, topic, difficulty) {
    const key = `queue:${topic}:${difficulty}`;
    const entry = JSON.stringify({userId, joinedAt: Date.now() });
    await redis.lpush(key, entry);
    await redis.expire(key, 300);
}

async function findMatch(userId, topic, difficulty){
    const key = `queue:${topic}:${difficulty}`;
    const entries = await redis.lrange(key, 0, -1);

    for (const raw of entries) {
        const entry = JSON.parse(raw);
        if (entry.userId !== userId) {
            await redis.lrem(key, 1, raw);
            await removeFromQueue(userId, topic, difficulty);
            const sessionId = uuidv4();
            return {matched: true, sessionId, matchedUserId: entry.userId};
        }
    }

    return { matched: false };
}

async function removeFromQueue(userId, topic, difficulty) {
    const key = `queue:${topic}:${difficulty}`;
    const entries = await redis.lrange(key, 0, -1);

    for (const raw of entries) {
        const entry = JSON.parse(raw);
        if(userId === entry.userId) {
            await redis.lrem(key, 1, raw)
            break;
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
    MATCH_TIMEOUT,
};