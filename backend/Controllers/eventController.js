const { ObjectId, Timestamp } = require("mongodb");
const {
    getEvents,
    createEvent,
    addCandidate,
    removeCandidate,
    getCandidatesById,
    addRequest,
    addRoomLink,
} = require("../DB/models/Events");

async function getEventsController(req, res, next) {
    try {
        const result = await getEvents();
        res.send({ code: 200, data: result });
    } catch (err) {
        next(err);
    }
}

async function addRequestController(req, res, next) {
    // s sending request to b
    const { eventID, username_a, username_b, score_a, score_b } = req.body;
    try {
        const result = await addRequest(
            eventID,
            username_b,
            score_b,
            username_a,
            score_a
        );
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
        const data = await addRoomLink(
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
    const { name, date, section, questions, candidatesInfo = [] } = req.body;
    try {
        const result = await createEvent(
            name,
            date,
            section,
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

async function getCandidatesByIdController(req, res, next) {
    const eventID = req.query.eventID;
    try {
        const result = await getCandidatesById(eventID);
        res.send({ code: 200, message: result });
    } catch (err) {
        next(err);
    }
}
module.exports = {
    getEventsController,
    createEventController,
    registerCandidate,
    deregisterCandidate,
    getCandidatesByIdController,
    addRequestController,
    addRoomLinkController,
};
