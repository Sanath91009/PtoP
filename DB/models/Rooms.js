const mongoose = require("mongoose");
const { TimeSeriesReducers } = require("redis");
const { getSectionByID } = require("./Events");
const { getHandle } = require("./User");

const RoomsSchema = new mongoose.Schema({
    eventID: {
        type: Number,
        required: true,
    },
    uuid: {
        type: String,
        required: true,
    },
    initiated: {
        type: String,
        required: true,
    },
    roomMembers: [
        {
            username: {
                type: String,
                required: true,
            },
            handle: {
                type: String,
                required: true,
            },
            solved: [
                {
                    type: String,
                },
            ],
            rating: {
                type: String,
                requierd: true,
            },
        },
    ],
    timestamp: {
        type: Number,
        required: true,
    },
});

const Rooms = mongoose.model("Rooms", RoomsSchema);
async function addRoomMember(uuid, roomMember) {
    const data = await Rooms.updateOne(
        { uuid: uuid },
        {
            $push: {
                roomMembers: {
                    handle: roomMember.handle,
                    solved: roomMember.solved,
                    rating: roomMember.rating,
                },
            },
        }
    );
    return data;
}
async function addRoom(eventID, uuid, initiated, timestamp) {
    const res = await Rooms.find({
        eventID: eventID,
        uuid: uuid,
        timestamp: timestamp,
    });
    if (!res || res.length == 0) {
        const data = await Rooms.create({
            eventID: eventID,
            uuid: uuid,
            initiated: initiated,
            roomMembers: [],
            timestamp: timestamp,
        });
        return data;
    }
}
async function getRooms(eventID, handle) {
    const data = await Rooms.find({ eventID, "roomMembers.handle": handle });
    return data;
}
async function getRoomInfo(uuid, handle) {
    const data = await Rooms.findOne({
        uuid: uuid,
        "roomMembers.handle": handle,
    });
    if (data.length == 0) return null;
    return { handle: data.handle };
}
async function checkRoomForUser(username, eventID, roomID) {
    const section = await getSectionByID(eventID);
    const handle = await getHandle(username, section);
    console.log("section : ", section, handle);
    if (handle == null) {
        return null;
    }
    const data = await Rooms.findOne({
        eventID: eventID,
        uuid: roomID,
        "roomMembers.$.handle": handle,
    });
    if (data == null || JSON.stringify(data) == "{}") return null;
    return handle;
}
module.exports = {
    addRoom,
    getRooms,
    addRoomMember,
    getRoomInfo,
    checkRoomForUser,
};
