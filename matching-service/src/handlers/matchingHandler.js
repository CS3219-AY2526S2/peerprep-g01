const {
    addToQueue,
    findMatch,
    removeFromQueue,
    setMatchStatus,
    getMatchStatus,
    MATCH_TIMEOUT,
} = require('../services/matchingQueue')

const { isValidDifficulty, isValidTopic } = require('../utils/index')

async function requestMatch(req, res) {
    const {userId, topic, difficulty} = req.body;

    if (!userId || !isValidTopic(topic) || !isValidDifficulty(difficulty) ) {
        return res.status(400).json({error: 'userId, topic and difficulty are required'})
    }

    await addToQueue(userId, topic, difficulty);
    await setMatchStatus(userId, { status: 'waiting', topic, difficulty })

    const deadline = Date.now() + MATCH_TIMEOUT * 1000;
    
    let cancelled = false
    req.on('close', () => { cancelled = true })

    const poll = async() => {
        if (cancelled) return;
        if ( Date.now() > deadline ) {
            await removeFromQueue(userId, topic, difficulty);
            await setMatchStatus(userId, { status: 'timeout', message: 'No match found'})
            return res.status(408).json({ status: 'timeout', message: 'No match found'})
        }

        const current = await getMatchStatus(userId);
        if (current && current.status === 'matched') {
            return res.status(200).json(current)
        }

        const result = await findMatch(userId, topic, difficulty)
        
        if (result.matched) {
            const userAMatchedData = {
                status: 'matched',
                sessionId: result.sessionId,
                matchedUserId: result.matchedUserId
            }

            const userBMatchedData = {
                status: 'matched',
                sessionId: result.sessionId,
                matchedUserId: userId
            }
            await setMatchStatus(userId, userAMatchedData)
            await setMatchStatus(result.matchedUserId, userBMatchedData)
            return res.status(200).json(userAMatchedData) 
        }
        setTimeout(poll, 2000)
    }
    poll()
}

async function cancelMatch(req, res) {
    const { userId, topic, difficulty } = req.body 

    if ( !userId || !isValidTopic(topic) || !isValidDifficulty(difficulty) ) { 
        return res.status(400).json({error: 'UserId, topicId and difficulty is required'})
    }

    await removeFromQueue(userId, topic, difficulty);
    await setMatchStatus(userId, {status: 'cancelled'})

    return res.status(200).json({message: 'Match Request Cancelled'})
}

async function checkMatchStatus(req, res) {
    const { userId } = req.params;

    const status = await getMatchStatus(userId)

    if(!status) { 
        return res.status(404).json({error: 'No match request found for this user'})
    }
    res.status(200).json(status)
}

async function matchMetaData(userA, userB, sessionId) {
    /* get question history from user A
    get question history from user B */
    
    // union both users question history
    // send the question list to question history api
    // get back the question metadata
    // route with session ID
    // send it to collab service
}

module.exports = { requestMatch, cancelMatch, checkMatchStatus }