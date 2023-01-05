const { getRooms, checkRoomForUser } = require("../DB/models/Rooms");

async function getRoomLinksController(req, res, next) {
    const eventID = req.query.eventID;
    const handle = req.query.handle;
    try {
        const data = await getRooms(eventID, handle);
        res.send({ code: 200, data: data });
    } catch (err) {
        next(err);
    }
}
async function checkRoomForUserController(req, res, next) {
    const username = req.query.username;
    const eventID = req.query.eventID;
    const roomID = req.query.roomID;
    console.log(username, eventID, roomID);
    try {
        const data = await checkRoomForUser(username, eventID, roomID);
        if (data == null) {
            res.send({ code: 201, message: "User not found in room" });
        } else res.send({ code: 200, handle: data });
    } catch (err) {
        next(err);
    }
}
module.exports = { getRoomLinksController, checkRoomForUserController };
