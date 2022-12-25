const { Router } = require("express");
const {
    getEventsController,
    createEventController,
    registerCandidate,
    deregisterCandidate,
    getCandidatesByIdController,
    addRequestController,
    addRoomLinkController,
} = require("../Controllers/eventController");

const eventsRouter = Router();

eventsRouter.get("/getEvents", getEventsController);
eventsRouter.post("/createEvent", createEventController);
eventsRouter.get("/event/getCandidates", getCandidatesByIdController);
eventsRouter.post("/event/addRequest", addRequestController);
eventsRouter.post("/event/register", registerCandidate);
eventsRouter.post("/event/deregister", deregisterCandidate);
eventsRouter.post("/event/addRoomLink", addRoomLinkController);
module.exports = eventsRouter;
