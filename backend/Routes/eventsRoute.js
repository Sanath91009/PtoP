const { Router } = require("express");
const {
    getEventsBySectionController,
    createEventController,
    getQuestionsByIdController,
    calculateScoreController,
    registerCandidate,
    deregisterCandidate,
    updateScore,
    getScoreController,
    getCandidatesByIdController,
    addRequestController,
    addRoomLinkController,
} = require("../Controllers/eventController");

const eventsRouter = Router();

eventsRouter.post("/getEvents", getEventsBySectionController);
eventsRouter.get("/getQuestions", getQuestionsByIdController);
eventsRouter.post("/getCandidates", getCandidatesByIdController);
eventsRouter.post("/calculateScore", calculateScoreController);
eventsRouter.post("/getScore", getScoreController);
eventsRouter.post("/addRequest", addRequestController);
eventsRouter.post("/createEvent", createEventController);
eventsRouter.post("/register", registerCandidate);
eventsRouter.post("/deregister", deregisterCandidate);
eventsRouter.post("/updateScore", updateScore);
eventsRouter.post("/addRoomLink", addRoomLinkController);
module.exports = eventsRouter;
