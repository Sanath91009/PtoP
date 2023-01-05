const { Router } = require("express");
const {
    getEventsController,
    createEventController,
    registerCandidate,
    deregisterCandidate,
    getCandidatesByIdController,
    addRequestController,
    getQestionsController,
    getEventInfoOfCandidateController,
    getUserResultController,
} = require("../Controllers/eventController");

const eventsRouter = Router();

eventsRouter.get("/getEvents", getEventsController);
eventsRouter.post("/createEvent", createEventController);
eventsRouter.get("/event/getCandidates", getCandidatesByIdController);
eventsRouter.get("/event/getCandidateInfo", getEventInfoOfCandidateController);
eventsRouter.post("/event/addRequest", addRequestController);
eventsRouter.post("/event/register", registerCandidate);
eventsRouter.post("/event/deregister", deregisterCandidate);
eventsRouter.get("/event/getQuestions", getQestionsController);
eventsRouter.get("/getUserResult", getUserResultController);
module.exports = eventsRouter;
