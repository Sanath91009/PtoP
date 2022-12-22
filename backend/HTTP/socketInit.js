const e = require("cors");
const { set } = require("mongoose");
const socketio = require("socket.io");
const { Server } = require("socket.io");
const { addRequest } = require("../DB/models/Events");
const { v4: uuidv4 } = require("uuid");
const { ConnectionPoolClosedEvent } = require("mongodb");
const { addRoomLink } = require("../DB/models/Events");

function SocketInit(app, server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });
    var socketToRoom = {};
    var socketToRoomChat = {};
    var screenShareID = {};
    let user = new Set();
    io.on("connect", (socket) => {
        socket.on("join_room", (data) => {
            console.log("client connected : ", data);
            const temp = data.room;
            socket.join(temp);
            socketToRoom[data.room] = socket;
        });
        socket.on("send_message", async (data) => {
            let room = data.room;
            socket.to(room).emit("receive_message", {
                username: data.username,
                score: data.score,
            });
            await addRequest(
                data.eventID,
                data.room,
                data.room_score,
                data.username,
                data.score
            );
        });

        socket.on("join-room", (roomID, userID) => {
            console.log("roomID : ", roomID, userID);
            socket.join(roomID);
            socket.to(roomID).emit("user-connected", userID);
            console.log("user came : ", screenShareID);
            if (
                screenShareID[roomID] != null ||
                screenShareID[roomID] != undefined
            ) {
                socket.emit("screen-share-recv", screenShareID[roomID]);
            }
            socketToRoomChat[userID] = socket;
            socket.on("disconnect", () => {
                console.log("disconnected");
                socket.to(roomID).emit("user-disconnected", userID);
            });
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
                .emit("stopped-screen-share-recv", { userID: data.userID });
        });
        socket.on("CreateRoom", (data) => {
            let uuid = uuidv4();
            const timestamp = Date.now();
            const usernames = Object.keys(data.requestTo);
            for (let i = 0; i < usernames.length; i++) {
                console.log(typeof usernames[i]);
                socketToRoom[usernames[i]].emit("createdRoom", {
                    uuid: uuid,
                    username: data.username,
                    score: data.score,
                    timestamp: timestamp,
                });
            }
        });
        socket.on("stop-video-cam-send", (data) => {
            socketToRoomChat[data.userID]
                .to(data.roomID)
                .emit("stop-video-cam-recv", data);
        });
        socket.on("random_pairing", async (data) => {
            console.log("random pariing ", data);
            let obj = {
                username: data.username,
                score: data.score,
            };
            user.add(JSON.stringify(obj));
            console.log(user);
            if (user.size === 2) {
                let uuid = uuidv4();
                let temp = Array.from(user);
                temp[0] = JSON.parse(temp[0]);
                temp[1] = JSON.parse(temp[1]);
                const timestamp = Date.now();
                socketToRoom[temp[0].username].emit("createdRoom", {
                    uuid: uuid,
                    username: temp[1].username,
                    score: temp[1].score,
                    timestamp: timestamp,
                });
                socket.emit("createdRoom", {
                    uuid: uuid,
                    username: temp[0].username,
                    score: temp[0].score,
                    timestamp: timestamp,
                });
                console.log("sent !!!");
                await addRoomLink(
                    data.eventID,
                    temp[0].username,
                    temp[0].score,
                    temp[1].username,
                    temp[1].score,
                    timestamp
                );
                user.clear();
            }
        });
    });
    return io;
}
module.exports = SocketInit;
