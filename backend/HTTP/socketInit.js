const e = require("cors");
const { Server } = require("socket.io");
const { addRequest } = require("../DB/models/Events");
const { v4: uuidv4 } = require("uuid");
const { ConnectionPoolClosedEvent } = require("mongodb");
const { addRoomLink } = require("../DB/models/Events");
const { addRoom, addRoomMember } = require("../DB/models/Rooms");

function SocketInit(app, server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });
    var socketToRoom = {};
    var socketToRoomChat = {};
    var handlesJoined = {};
    var screenShareID = {};
    let user = new Set();
    io.on("connect", (socket) => {
        socket.on("join_room", (data) => {
            console.log("client connected : ", data);
            const temp = data.room;
            socket.join(temp);
            socketToRoom[data.room] = socket;
            socket.on("disconnect", () => {
                delete socketToRoom[data.room];
            });
        });
        socket.on("send_message", async (data) => {
            let room = data.room;
            console.log("data L ", data);
            socket.to(room).emit("receive_message", {
                handle: data.handle,
                solved: data.solved,
                rating: data.rating,
            });
            await addRequest(
                data.eventID,
                data.room,
                data.room_solved,
                data.room_rating,
                data.handle,
                data.solved,
                data.rating
            );
        });
        socket.on("CreateRoom", async (data) => {
            let uuid = uuidv4();
            const { eventID, handle, solved, rating, requestTo, timestamp } =
                data;
            await addRoom(eventID, uuid, handle, timestamp);
            console.log("handle : ", {
                handle: handle,
                solved: solved,
                rating: rating,
            });
            await addRoomMember(uuid, {
                handle: handle,
                solved: solved,
                rating: rating,
            });
            const handles = Object.keys(requestTo);
            console.log("creting room : ", data);
            for (let i = 0; i < handles.length; i++) {
                if (socketToRoom[handles[i]] != undefined) {
                    socketToRoom[handles[i]].emit("createdRoom", {
                        uuid: uuid,
                        initiated: handle,
                        roomMembers: requestTo,
                        timestamp: timestamp,
                    });
                }

                await addRoomMember(uuid, {
                    handle: handles[i],
                    solved: requestTo[handles[i]].solved,
                    rating: requestTo[handles[i]].rating,
                });
            }
        });
        socket.on("random_pairing", async (data) => {
            console.log("random pariing ", data);
            user.add(JSON.stringify(data));
            console.log(user);
            if (user.size === 2) {
                let uuid = uuidv4();
                let temp = Array.from(user);
                const timestamp = Date.now();
                temp[0] = JSON.parse(temp[0]);
                temp[1] = JSON.parse(temp[1]);
                socketToRoom[temp[0].handle].emit("createdRoom", {
                    uuid: uuid,
                    initiated: "server",
                    timestamp: timestamp,
                    roomMembers: [
                        {
                            handle: temp[0].handle,
                            solved: temp[0].solved,
                            rating: temp[0].rating,
                        },
                        {
                            handle: temp[1].handle,
                            solved: temp[1].solved,
                            rating: temp[1].rating,
                        },
                    ],

                    random: true,
                });

                socket.emit("createdRoom", {
                    uuid: uuid,
                    initiated: "server",
                    timestamp: timestamp,
                    roomMembers: [
                        {
                            handle: temp[0].handle,
                            solved: temp[0].solved,
                            rating: temp[0].rating,
                        },
                        {
                            handle: temp[1].handle,
                            solved: temp[1].solved,
                            rating: temp[1].rating,
                        },
                    ],

                    random: true,
                });
                console.log("sent !!!");
                user.clear();
                await addRoom(data.eventID, uuid, "server", timestamp);
                await addRoomMember(uuid, {
                    handle: temp[1].handle,
                    solved: temp[1].solved,
                    rating: temp[1].rating,
                });
                await addRoomMember(uuid, {
                    handle: temp[0].handle,
                    solved: temp[0].solved,
                    rating: temp[0].rating,
                });
            }
        });

        socket.on("join-room", (data) => {
            const { roomID, userID, handle } = data;
            console.log("handlesJoined : ", handlesJoined, handle);
            if (handlesJoined[handle]) {
                console.log("handle alreay there : ");
                socket
                    .to(handlesJoined[handle].roomID)
                    .emit("user-disconnected", handlesJoined[handle].userID);
            }
            console.log("new user came roomID : ", roomID, userID);
            socket.join(roomID);
            socket.to(roomID).emit("user-connected", data);
            if (
                (screenShareID[roomID] != null ||
                    screenShareID[roomID] != undefined) &&
                socketToRoomChat[screenShareID[roomID].userID] != undefined
            ) {
                socket.emit("screen-share-recv", screenShareID[roomID]);
            }
            handlesJoined[handle] = { roomID: roomID, userID: userID };
            socketToRoomChat[userID] = socket;
            console.log("sockettoRoom : ", userID);
            socket.on("disconnect", () => {
                console.log("disconnected");
                socket.to(roomID).emit("user-disconnected", userID);
                delete socketToRoomChat[userID];
                delete handlesJoined[handle];
            });
        });
        socket.on("start-video-cam-again-send", (data) => {
            socketToRoomChat[data.userID]
                .to(data.roomID)
                .emit("start-video-cam-again-recv", data);
        });
        socket.on("chat-message-send", (data) => {
            console.log("recieved message : ", data);
            socketToRoomChat[data.userID]
                .to(data.roomID)
                .emit("chat-message-recv", data);
        });
        socket.on("screen-share-send", (data) => {
            console.log("screen-share-send : ", data);
            screenShareID[data.roomID] = data;
            socketToRoomChat[data.userID]
                .to(data.roomID)
                .emit("screen-share-recv", data);
        });
        socket.on("stopped-screen-share-send", (data) => {
            socketToRoomChat[data.userID]
                .to(data.roomID)
                .emit("stopped-screen-share-recv", data.userID);
            delete screenShareID[data.roomID];
        });

        socket.on("stop-video-cam-send", (data) => {
            socketToRoomChat[data.userID]
                .to(data.roomID)
                .emit("stop-video-cam-recv", data);
        });
    });
    return io;
}
module.exports = SocketInit;
