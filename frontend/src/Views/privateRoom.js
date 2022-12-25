import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import config from "../config.json";
import { useLocation } from "react-router-dom";
import {
    faMicrophone,
    faMicrophoneSlash,
    faVideoCamera,
    faVideoSlash,
    faComment,
    faCommentSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chatbox } from "../components/chatbox";
import { v4 as uuidv4 } from "uuid";
import "../css/Proom.css";
import userImg from "../images/defaultUser.png";
import { UserAvatar } from "../components/userAvatar";
const Windowheight = window.innerHeight;
export const PrivateRoom = () => {
    const location = useLocation();
    const roomID = location.pathname.split("/").pop();
    const [streamState, setStreamState] = useState();
    const [chat, setChat] = useState(1);
    const [myuserId, setMyUserId] = useState(uuidv4());
    const [screenID, setScreenID] = useState(null);
    const [messages, setMessages] = useState([]);
    const [peers, setPeers] = useState({});
    const [mapper, setMapper] = useState({});
    const [micButton, setMicButton] = useState({
        className: "btn btn-danger",
        icon: faMicrophoneSlash,
    });
    const [videoButton, setVideoButton] = useState({
        className: "btn btn-danger",
        icon: faVideoSlash,
    });
    const [chatButton, setChatButton] = useState({
        icon: faComment,
        className: "btn btn-dark",
    });
    const [screenButton, setScreenButton] = useState({
        className: "btn btn-secondary",
    });
    const userStreams = {};
    const [screenStream, setScreenStream] = useState(null);
    const [othersScreenShare, setOthersScreenShare] = useState(false);
    const [username, setUsername] = useState("sanath");
    const [usersInRoom, setUsersInRoom] = useState([{ id: 0, name: username }]);
    const [videoID, setVideoId] = useState(0);
    const setVideoRef = useRef();
    setVideoRef.current = setVideoId;
    const socket = io.connect(config.apiUrl);
    const myPeer = new Peer(myuserId);

    const addToPeers = (userID, call, videoCard, type = "normal") => {
        const obj = {
            call: call,
            videoCard: videoCard,
            type: type,
        };
        const peers_temp = peers;
        if (peers_temp[userID] === undefined) {
            peers_temp[userID] = [obj];
        } else {
            peers_temp[userID] = [obj, ...peers_temp[userID]];
        }
        setPeers((prev) => peers_temp);
    };

    const getVideoClass = (userID) => {
        const videoClass = document.querySelector(".videos");
        const myVideo = document.createElement("video");
        const div_wrapper = document.createElement("div");
        div_wrapper.classList.add("videoWrapper");
        div_wrapper.style =
            "display: flex; justify-content: center; height: 100%;width:118px";
        myVideo.classList.add("camVideo");
        myVideo.classList.add(`V${videoID}`);
        div_wrapper.classList.add(`D${videoID}`);
        const mapper_temp = mapper;
        mapper_temp[userID] = videoID;
        setMapper(() => mapper_temp);
        setVideoId((videoID) => {
            return videoID + 1;
        });
        return {
            MainClass: videoClass,
            myEle: myVideo,
            div_wrapper: div_wrapper,
        };
    };
    const getVideoClassRef = useRef();
    getVideoClassRef.current = getVideoClass;

    const DataChannelHandler = (conn) => {
        console.log("conn : ", conn);
    };

    const VideoStreamingInit = async () => {
        var canvas = document.createElement("canvas");
        var canvas_stream = canvas.captureStream(25);
        var canvas_track = canvas_stream.getTracks()[0];
        const stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        });
        stream.getAudioTracks()[0].enabled = false;
        stream.addTrack(canvas_track);
        const elements = getVideoClassRef.current(myuserId);
        setStreamState((prev) => stream);
        addVideoStream(
            elements.myEle,
            elements.div_wrapper,
            elements.MainClass,
            stream,
            mapper[myuserId],
            username,
            true
        );
        myPeer.on("call", (call) => {
            call.answer(stream);
            console.log("call answered : ", call.metadata);
            const userID = call.metadata.userID;
            const Videoelements = getVideoClassRef.current(userID);
            call.on("stream", (stream_temp) => {
                addVideoStream(
                    Videoelements.myEle,
                    Videoelements.div_wrapper,
                    Videoelements.MainClass,
                    stream_temp
                );
            });
            addToPeers(userID, call, Videoelements.div_wrapper);
        });
        myPeer.on("connection", function (conn) {
            console.log("opened in answered side...");
            conn.on("open", function () {
                conn.send({
                    userID: myuserId,
                    username: username,
                    firstMessage: true,
                });
                setVideoButton((videoButton) => {
                    if (videoButton["className"] == "btn btn-danger") {
                        conn.send({
                            userID: myuserId,
                            remove: true,
                        });
                    }
                    return videoButton;
                });
                conn.on("data", function (data) {
                    console.log("received from data channel : ", data);
                    if (data.remove != undefined && data.remove == true) {
                        const timer = setTimeout(() => {
                            const video = document.querySelector(
                                `.V${mapper[data.userID]}`
                            );
                            video.style = "display:none;";
                            const div = document.querySelector(
                                `.D${mapper[data.userID]}`
                            );
                            div.append(
                                document.querySelector(
                                    `.A${mapper[data.userID]}`
                                )
                            );
                        }, 500);
                    }
                    if (data.add != undefined && data.add == true) {
                        const avat = document.querySelector(
                            `.A${mapper[data.userID]}`
                        );
                        avat.remove();
                        const video = document.querySelector(
                            `.V${mapper[data.userID]}`
                        );
                        video.style.display = null;
                    }
                    if (data.firstMessage == true) {
                        setUsersInRoom((usersInRoom) => {
                            return [
                                ...usersInRoom,
                                {
                                    id: mapper[data.userID],
                                    name: data.username,
                                },
                            ];
                        });
                        addToPeers(data.userID, conn, null, "data");
                    }
                });
            });
        });
        socket.on("screen-share-recv", (data) => {
            console.log("screen share recv : ", data, stream);
            setOthersScreenShare((prev) => true);
            const call = myPeer.call(data.screenuuid, stream, {
                metadata: { username: myuserId },
            });
            const screen_class = document.querySelector(".main-screen");
            const screenPart = document.createElement("video");
            screenPart.classList.add("ScreenShare");
            call.on("stream", (stream) => {
                console.log("call started : ", call);
                screenPart.srcObject = stream;
                screenPart.addEventListener("loadedmetadata", () => {
                    screenPart.play();
                });
                screen_class.append(screenPart);
                addToPeers(data.userID, call, screenPart, "screen");
            });
        });
        socket.on("stopped-screen-share-recv", () => {
            console.log("screen sharing stopped ", othersScreenShare);
            const screenPart = document.querySelector(".ScreenShare");
            screenPart.remove();
            setOthersScreenShare(() => false);
        });
        socket.on("stop-video-cam-recv", (data) =>
            stopVideoCamHandlerRef.current(data)
        );

        console.log("stream : ", stream.getVideoTracks());
    };
    useEffect(() => {
        console.log("updated : ", usersInRoom);
    }, [usersInRoom]);
    useEffect(() => {
        myPeer.on("open", (id) => {
            console.log("opened : ", id);
            socket.emit("join-room", roomID, id);
        });
        VideoStreamingInit();

        const handler = (userID) => {
            console.log("in handler ...");
            setStreamState((streamState) => {
                const call = myPeer.call(userID, streamState, {
                    metadata: {
                        userID: myuserId,
                        replace: false,
                        username: username,
                    },
                });
                console.log("call when connected user : ", call, streamState);
                const Videoelements = getVideoClassRef.current(userID);
                call.on("stream", (stream_temp) => {
                    addVideoStream(
                        Videoelements.myEle,
                        Videoelements.div_wrapper,
                        Videoelements.MainClass,
                        stream_temp
                    );
                });
                addToPeers(userID, call, Videoelements.div_wrapper);
                return streamState;
            });

            var conn = myPeer.connect(userID);
            conn.on("open", function () {
                conn.send({
                    userID: myuserId,
                    username: username,
                    firstMessage: true,
                });
                setVideoButton((videoButton) => {
                    if (videoButton["className"] == "btn btn-danger") {
                        conn.send({
                            userID: myuserId,
                            remove: true,
                        });
                    }
                    return videoButton;
                });
                conn.on("data", function (data) {
                    console.log("received from data channel : ", data);
                    if (data.remove != undefined && data.remove == true) {
                        const timer = setTimeout(() => {
                            const video = document.querySelector(
                                `.V${mapper[data.userID]}`
                            );
                            video.style = "display:none;";
                            const div = document.querySelector(
                                `.D${mapper[data.userID]}`
                            );
                            div.append(
                                document.querySelector(
                                    `.A${mapper[data.userID]}`
                                )
                            );
                        }, 500);
                    }
                    if (data.add != undefined && data.add == true) {
                        const avat = document.querySelector(
                            `.A${mapper[data.userID]}`
                        );
                        // avat.remove();
                        const video = document.querySelector(
                            `.V${mapper[data.userID]}`
                        );
                        video.style.display = null;
                    }
                    if (data.firstMessage == true) {
                        setUsersInRoom((usersInRoom) => {
                            return [
                                ...usersInRoom,
                                {
                                    id: mapper[data.userID],
                                    name: data.username,
                                },
                            ];
                        });
                        addToPeers(data.userID, conn, null, "data");
                    }
                });
            });

            addToPeers(userID, conn, null, "data");
        };
        socket.on("user-connected", handler);
        return () => socket.off("user-connected", handler);
    }, []);
    useEffect(() => {
        socket.on("user-disconnected", (userID) => {
            console.log("user disconnedted : ", userID);
            console.log("peers : ", peers[userID]);
            peers[userID].forEach((stream) => {
                deleteStream(stream);
            });

            delete peers[userID];
        });
    }, [socket]);
    const deleteStream = (stream) => {
        if (stream.videoCard) stream.videoCard.remove();
        stream.call.close();
        if (stream.type == "screen") {
            setOthersScreenShare(() => false);
        }
    };
    const stopVideoCamHandler = (data) => {
        console.log("video closing : ", data);
        peers[data.userID].forEach((stream) => {
            if (stream.type == "normal") {
                stream.videoCard.childNodes[0].srcObject = undefined;
                stream.videoCard.childNodes[0].poster = userImg;
            }
        });
    };
    const stopVideoCamHandlerRef = useRef();
    stopVideoCamHandlerRef.current = stopVideoCamHandler;

    const addVideoStream = (
        myVideo,
        div_wrapper,
        videos_class,
        stream,
        userID = null,
        username = null,
        stop = false
    ) => {
        myVideo.srcObject = stream;
        myVideo.autoPlay = true;
        myVideo.addEventListener("loadedmetadata", () => {
            myVideo.play();
        });
        if (stop == true) {
            myVideo.style = "display:none";
            div_wrapper.append(document.querySelector(".A0"));
        }
        div_wrapper.append(myVideo);
        videos_class.append(div_wrapper);
    };

    const HandleMicButton = () => {
        const micButton_temp = { ...micButton };
        if (micButton_temp["className"] == "btn btn-danger") {
            micButton_temp["className"] = "btn btn-dark";
            micButton_temp["icon"] = faMicrophone;
            streamState.getAudioTracks()[0].enabled = true;
        } else {
            micButton_temp["className"] = "btn btn-danger";
            micButton_temp["icon"] = faMicrophoneSlash;
            console.log("streamstate : ", streamState);
            streamState.getAudioTracks()[0].enabled = false;
        }
        setMicButton(micButton_temp);
    };
    const HandleVideoButton = () => {
        const videoButton_temp = { ...videoButton };
        if (videoButton_temp["className"] == "btn btn-danger") {
            videoButton_temp["className"] = "btn btn-dark";
            videoButton_temp["icon"] = faVideoCamera;
            const streamState_temp = streamState;
            if (streamState.getVideoTracks().length > 0)
                streamState_temp.removeTrack(streamState.getVideoTracks()[0]);
            navigator.mediaDevices
                .getUserMedia({
                    video: true,
                })
                .then((stream) => {
                    streamState_temp.addTrack(stream.getVideoTracks()[0]);
                    setScreenStream(streamState_temp);
                    const myVideo = document.querySelector(".V0");
                    myVideo.poster = undefined;
                    myVideo.srcObject = stream;
                    Object.keys(peers).forEach((key) => {
                        peers[key].forEach((stream_temp) => {
                            if (stream_temp.type == "normal") {
                                console.log(
                                    "sflsdlf : ",
                                    stream_temp.call.peerConnection.getSenders()
                                );
                                stream_temp.call.peerConnection
                                    .getSenders()[1]
                                    .replaceTrack(stream.getVideoTracks()[0]);
                            }
                            if (stream_temp.type == "data") {
                                console.log("sent data");
                                stream_temp.call.send({
                                    userID: myuserId,
                                    add: true,
                                });
                            }
                        });
                    });
                });
        } else {
            videoButton_temp["className"] = "btn btn-danger";
            videoButton_temp["icon"] = faVideoSlash;

            streamState.getVideoTracks()[0].stop();

            Object.keys(peers).forEach((key) => {
                peers[key].forEach((stream_temp) => {
                    if (stream_temp.type == "data") {
                        console.log("sent");
                        stream_temp.call.send({
                            userID: myuserId,
                            remove: true,
                        });
                    }
                });
            });

            // socket.emit("stop-video/-cam-send",{data:})
            // stream.getVideoTracks()[0].enabled = false;
        }
        setVideoButton(videoButton_temp);
    };
    const HandleChatbutton = () => {
        if (chat == 0) {
            setChat(1);
            setChatButton({
                className: "btn btn-dark",
                icon: faComment,
            });
        } else {
            console.log("changing : ", chat);
            setChat(0);
            setChatButton({
                className: "btn btn-danger",
                icon: faCommentSlash,
            });
        }
    };
    const HandleScreenShareButton = async () => {
        console.log("others : ", othersScreenShare);
        if (othersScreenShare === true) {
            return;
        } else if (screenID == null) {
            console.log("creating...");
            const screenuuid = uuidv4();
            const screenPeer = new Peer(screenuuid);
            screenPeer.on("open", (id) =>
                console.log("screen peer open : ", id)
            );
            const screen_class = document.querySelector(".main-screen");
            const screenPart = document.createElement("video");
            screenPart.classList.add("ScreenShare");
            navigator.mediaDevices
                .getDisplayMedia({
                    video: { cursor: "always" },
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100,
                    },
                })
                .then((ScreenStream) => {
                    socket.emit("screen-share-send", {
                        screenuuid: screenuuid,
                        username: username,
                        userID: myuserId,
                        roomID: roomID,
                    });
                    screenPart.srcObject = ScreenStream;
                    screen_class.append(screenPart);
                    screenPart.addEventListener("loadedmetadata", () => {
                        screenPart.play();
                    });
                    setScreenButton({ className: "btn btn-danger" });
                    setScreenID(() => screenuuid);
                    screenPeer.on("call", (call) => {
                        call.answer(ScreenStream);
                    });
                    setScreenStream(() => ScreenStream);
                });
        } else {
            console.log("closing : ", screenStream);
            const screenPart = document.querySelector(".ScreenShare");
            await screenStream.getTracks().forEach((track) => track.stop());
            screenPart.remove();
            setScreenStream(null);
            setScreenID(null);
            socket.emit("stopped-screen-share-send", {
                roomID: roomID,
                userID: myuserId,
            });
            setScreenButton({ className: "btn btn-secondary" });
        }
    };
    return (
        <div
            className="fluid-container"
            style={{
                height: Windowheight,
                width: "100%",
            }}
        >
            <div
                className="row"
                style={{ height: Windowheight, width: "100%", margin: 0 }}
            >
                <div
                    className={chat == 1 ? "col-sm-8" : "col-sm-12"}
                    style={{
                        height: Windowheight,
                        padding: 0,
                    }}
                >
                    <div
                        className="videos"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            height: "15%",
                            flexDirection: "row",
                        }}
                    ></div>
                    <div className="main-screen row"></div>
                    <div className="row justify-content-md-center row-cols-auto position-absolute bottom-0 start-50 translate-middle">
                        <div className="col">
                            <button
                                className={`${micButton.className} rounded-5`}
                                onClick={() => HandleMicButton()}
                                style={{ fontSize: 25 }}
                            >
                                <FontAwesomeIcon icon={micButton.icon} />
                            </button>
                        </div>
                        <div className="col">
                            <button
                                className={`${videoButton.className} rounded-5`}
                                onClick={() => HandleVideoButton()}
                                style={{ fontSize: 25 }}
                            >
                                <FontAwesomeIcon icon={videoButton.icon} />
                            </button>
                        </div>
                        <div className="col">
                            <button
                                className={`${chatButton.className} rounded-5`}
                                onClick={() => HandleChatbutton()}
                                style={{ fontSize: 25 }}
                            >
                                <FontAwesomeIcon icon={chatButton.icon} />
                            </button>
                        </div>
                        <div className="col">
                            <button
                                className={`${screenButton.className} rounded-5`}
                                onClick={() => HandleScreenShareButton()}
                                style={{ marginBottom: -28 }}
                            >
                                <img
                                    width={33}
                                    height={33}
                                    src={require("../images/screenShare.png")}
                                />
                            </button>
                        </div>
                    </div>
                </div>
                {chat == 1 ? (
                    <Chatbox
                        roomID={roomID}
                        setChat={setChat}
                        socket={socket}
                        setChatButton={setChatButton}
                        username={username}
                        userID={myuserId}
                        messages={messages}
                        setMessages={setMessages}
                    />
                ) : null}
            </div>
            <div className="avatars">
                {usersInRoom.map((a) => {
                    return (
                        <div className={`A${a.id}`}>
                            <UserAvatar name={a.name} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
