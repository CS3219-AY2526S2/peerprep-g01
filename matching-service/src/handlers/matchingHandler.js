const axios = require('axios')
const {
    addToQueue,
    findMatch,
    removeFromQueue,
    setMatchStatus,
    getMatchStatus,
    MATCH_TIMEOUT,
} = require('../services/matchingQueue')

const { isValidDifficulty, isValidTopic } = require('../utils/index')
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-app:3001';
const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL || 'http://questionbank-app:3002';

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
            let question = null
            try{
                question = await questionMetaData( userId, result.matchedUserId, topic, difficulty)
            } catch (err) {
                console.error('questionMetaData failed:', err.message)
            }

            const userAMatchedData = {
                status: 'matched',
                sessionId: result.sessionId,
                matchedUserId: result.matchedUserId,
                question,
            }

            const userBMatchedData = {
                status: 'matched',
                sessionId: result.sessionId,
                matchedUserId: userId,
                question,
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

async function questionMetaData(userAId, userBId, topic, difficulty) {
    /* get question history from user A
    get question history from user B */
    const [ historyA, historyB ] = await Promise.all([
        axios.get(`${USER_SERVICE_URL}/api/users/question_history/${userAId}`),
        axios.get(`${USER_SERVICE_URL}/api/users/question_history/${userBId}`),
    ])
    // union both users question history
    const parseHistory = (data) =>(data? data.split(',').filter(Boolean): [])

    const excludeSet = new Set([
        ...parseHistory(historyA.data.data),
        ...parseHistory(historyB.data.data)
    ])
    // send the question list to question history api
    const questionMetaData = await axios.post(`${QUESTION_SERVICE_URL}/api/questions/select`, {
        topicId: topic,
        difficulty,
        exclude:[...excludeSet],
    })
    return questionMetaData.data.data
    // get back the question metadata
    // route with session ID
    // send it to collab service
}

module.exports = { requestMatch, cancelMatch, checkMatchStatus, questionMetaData }