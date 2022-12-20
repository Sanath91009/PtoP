const { ObjectId, Timestamp } = require("mongodb");
const {
    getEvents,
    getQuestionsById,
    createEvent,
    calculateScoreInExam,
    addCandidate,
    removeCandidate,
    updateScoreCandidate,
    getCandidatesById,
    getScore,
    addRequest,
    addRoomLink,
} = require("../DB/models/Events");

async function getEventsBySectionController(req, res, next) {
    const { section } = req.body;
    try {
        const result = await getEvents(section);
        res.send({ code: 200, data: result });
    } catch (err) {
        next(err);
    }
}
async function getQuestionsByIdController(req, res, next) {
    const examId = req.query.examId;
    console.log("examID : ", examId);
    try {
        const result = await getQuestionsById(examId);
        res.send({ code: 200, data: result });
    } catch (err) {
        next(err);
    }
}

async function calculateScoreController(req, res, next) {
    const { answers, examId, username, section, contestID = 1000 } = req.body;
    if (section == "codeforces") {
        let endpoint = "https://codeforces.com/api/contest.standings?";
        endpoint += `contestId=${contestID}&handle=${username}`;
        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                res.send({ code: 200, data: data.result.row.points });
            });
    } else if (section == "codechef") {
    } else {
        try {
            const score = await calculateScoreInExam(answers, examId, username);
            res.send({ code: 200, score: score });
        } catch (err) {
            next(err);
        }
    }
}
async function getScoreController(req, res, next) {
    const { username, examId } = req.body;
    try {
        const result = await getScore(examId, username);
        res.send({ code: 200, message: result });
    } catch (err) {
        next(err);
    }
}
async function addRequestController(req, res, next) {
    const { username_a, username_b, score_a } = req.body;
    try {
        const result = await addRequest(username_b, username_a, score_a);
        res.send({ code: 200, data: result, message: "request added" });
    } catch (err) {
        next(err);
    }
}
async function addRoomLinkController(req, res, next) {
    const {
        eventID,
        username_a,
        username_b,
        score_a,
        score_b,
        uuid,
        timestamp = Date.now(),
    } = req.body;
    try {
        const res = await addRoomLink(
            eventID,
            username_a,
            score_a,
            username_b,
            score_b,
            uuid,
            timestamp
        );
        res.send({ code: 200, message: "added" });
    } catch (err) {
        next(err);
    }
}
async function createEventController(req, res, next) {
    const {
        name,
        date,
        section,
        type,
        questions,
        candidatesInfo = [],
    } = req.body;
    try {
        const result = await createEvent(
            name,
            date,
            section,
            type,
            candidatesInfo,
            questions
        );
        res.send({ code: 200, data: "Event created" });
    } catch (err) {
        next(err);
    }
}

async function registerCandidate(req, res, next) {
    const { username, eventID } = req.body;
    try {
        const result = await addCandidate(eventID, username);
        res.send({ code: 200, message: "Registered to event successfully" });
    } catch (err) {
        next(err);
    }
}
async function deregisterCandidate(req, res, next) {
    const { username, eventID } = req.body;
    try {
        const result = await removeCandidate(eventID, username);
        res.send({ code: 200, message: "DeRegistered to event successfully" });
    } catch (err) {
        next(err);
    }
}
async function updateScore(req, res, next) {
    const { username, score, eventID } = req.body;
    try {
        const result = await updateScoreCandidate(eventID, username, score);
        res.send({ code: 200, message: "score updated" });
    } catch (err) {
        next(err);
    }
}
async function getCandidatesByIdController(req, res, next) {
    const { eventID } = req.body;
    try {
        const result = await getCandidatesById(eventID);
        res.send({ code: 200, message: result });
    } catch (err) {
        next(err);
    }
}
module.exports = {
    getEventsBySectionController,
    createEventController,
    registerCandidate,
    deregisterCandidate,
    updateScore,
    calculateScoreController,
    getQuestionsByIdController,
    getCandidatesByIdController,
    getScoreController,
    addRequestController,
    addRoomLinkController,
};
