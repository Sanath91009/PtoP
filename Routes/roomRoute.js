const { Router } = require("express");
const {
    getRoomLinksController,
    checkRoomForUserController,
} = require("../Controllers/roomController");
const roomRouter = Router();
roomRouter.get("/getHandleFromRoom", checkRoomForUserController);
roomRouter.get("/getRoomLinks", getRoomLinksController);
module.exports = roomRouter;
