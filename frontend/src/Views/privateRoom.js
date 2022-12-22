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
const Windowheight = window.innerHeight;
export const PrivateRoom = () => {
    const location = useLocation();
    const roomID = location.pathname.split("/").pop();
    const [streamState, setStreamState] = useState(null);
    const [chat, setChat] = useState(1);
    const [myuserId, setMyUserId] = useState(uuidv4());
    const [micButton, setMicButton] = useState({
        className: "btn btn-danger",
        icon: faMicrophoneSlash,
    });
    const [screenID, setScreenID] = useState(null);
    const [messages, setMessages] = useState([]);
    const peers = {};
    const [numVideos, setNumVideos] = useState(0);
    const [mapper, setMapper] = useState({});
    const [streamMapper, setStreamMapper] = useState({});

    // const _setStreamMapper=()=>{
    //     setStreamMapper
    // }
    const stopVideoCamHandler = (data) => {
        console.log("stream wrapper : ", streamMapper, data);
        const streamMapper_temp = streamMapper;
        console.log(
            "streamMapper_temp[data.userID] : ",
            streamMapper_temp[data.userID]
        );
        // streamMapper_temp[data.userID].removeTrack(
        //     streamMapper_temp[data.userID].getVideoTracks()[0]
        // );
        streamMapper_temp[data.userID].videoCard.srcObject = null;
        streamMapper_temp[data.userID].videoCard.poster = "hi";
        setStreamMapper(() => streamMapper);
    };

    const stopVideoCamHandlerRef = useRef();
    stopVideoCamHandlerRef.current = stopVideoCamHandler;
    const [videoButton, setVideoButton] = useState({
        className: "btn btn-dark",
        icon: faVideoCamera,
    });
    const [chatButton, setChatButton] = useState({
        icon: faComment,
        className: "btn btn-dark",
    });
    const [screenButton, setScreenButton] = useState({
        className: "btn btn-secondary",
    });
    const [screenStream, setScreenStream] = useState(null);
    const [othersScreenShare, setOthersScreenShare] = useState(false);
    const [usersInRoom, setUsersInRoom] = useState([]);
    const [username, setUsername] = useState("hi");
    const socket = io.connect(config.apiUrl);
    const myPeer = new Peer(myuserId);

    const addToPeers = (userID, call, videoCard, screenStream = false) => {
        console.log("adding...", screenStream);
        const obj = {
            call: call,
            videoCard: videoCard,
            screenStream: screenStream,
        };
        if (peers[userID] === undefined) {
            peers[userID] = [obj];
        } else {
            peers[userID] = [obj, ...peers[userID]];
        }
    };
    const getVideoClass = () => {
        const videoClass = document.querySelector(".videos");
        const myVideo = document.createElement("video");
        const div_wrapper = document.createElement("div");
        div_wrapper.classList.add("videoWrapper");
        div_wrapper.style =
            "display: flex; justify-content: center; height: 100%;";
        myVideo.classList.add("camVideo");
        myVideo.classList.add(numVideos);
        return {
            MainClass: videoClass,
            myEle: myVideo,
            div_wrapper: div_wrapper,
        };
    };
    const VideoStreamingInit = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        stream.getAudioTracks()[0].enabled = false;
        console.log("stream : ", stream);
        const elements = getVideoClass();
        addVideoStream(
            elements.myEle,
            elements.div_wrapper,
            elements.MainClass,
            stream
        );
        setNumVideos(numVideos + 1);
        myPeer.on("call", (call) => {
            call.answer(stream);
            console.log("call answered : ", call.metadata);
            const userID = call.metadata.userID;
            setUsersInRoom(() => [userID, ...usersInRoom]);
            const Videoelements = getVideoClass();
            // const ImgElements = getImgClass();
            call.on("stream", (stream_temp) => {
                const streamMapper_temp = { ...streamMapper };
                console.log(
                    "userid and stram : ",
                    userID,
                    stream_temp,
                    stream_temp.getVideoTracks()
                );
                streamMapper_temp[userID] = {
                    stream: stream_temp,
                    videoCard: Videoelements.myEle,
                };
                setStreamMapper(() => streamMapper_temp);
                addVideoStream(
                    Videoelements.myEle,
                    Videoelements.div_wrapper,
                    Videoelements.MainClass,
                    stream_temp
                );
            });
            addToPeers(userID, call, Videoelements.div_wrapper);
        });
        socket.on("user-connected", (userID) => {
            console.log("user connected...");
            connectUser(userID, stream);
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
                addToPeers(data.userID, call, screenPart, true);
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
        setStreamState((prev) => stream);
        console.log("stream : ", stream.getVideoTracks());
    };
    useEffect(() => {
        myPeer.on("open", (id) => {
            console.log("opened : ", id);
            socket.emit("join-room", roomID, id);
        });

        VideoStreamingInit();
    }, []);
    useEffect(() => {
        socket.on("user-disconnected", (userID) => {
            console.log("user disconnedted : ", userID);
            console.log("peers : ", peers[userID]);
            peers[userID].forEach((stream) => {
                if (stream.videoCard) stream.videoCard.remove();
                stream.call.close();
                if (stream.screenStream == true) {
                    setOthersScreenShare(() => false);
                }
            });

            delete peers[userID];
        });
    }, [socket]);

    const addVideoStream = (myVideo, div_wrapper, videos_class, stream) => {
        myVideo.srcObject = stream;
        myVideo.autoPlay = true;
        myVideo.addEventListener("loadedmetadata", () => {
            myVideo.play();
        });
        div_wrapper.append(myVideo);
        videos_class.append(div_wrapper);
    };
    const connectUser = (userID, stream) => {
        const call = myPeer.call(userID, stream, {
            metadata: { userID: myuserId },
        });
        const Videoelements = getVideoClass();
        call.on("stream", (stream_temp) => {
            const streamMapper_temp = { ...streamMapper };
            streamMapper_temp[userID] = {
                stream: stream_temp,
                videoCard: Videoelements.myEle,
            };
            setStreamMapper(() => streamMapper_temp);
            addVideoStream(
                Videoelements.myEle,
                Videoelements.div_wrapper,
                Videoelements.MainClass,
                stream_temp
            );
        });
        addToPeers(userID, call, Videoelements.div_wrapper);
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
            streamState.removeTrack(streamState.getVideoTracks()[0]);
            navigator.mediaDevices
                .getUserMedia({
                    video: true,
                })
                .then((vstream) => {
                    const stream_temp = streamState;
                    stream_temp.addTrack(vstream.getVideoTracks()[0]);
                    setScreenStream(() => stream_temp);
                });
        } else {
            videoButton_temp["className"] = "btn btn-danger";
            videoButton_temp["icon"] = faVideoSlash;
            streamState.getVideoTracks()[0].stop();
            socket.emit("stop-video-cam-send", {
                userID: myuserId,
                roomID: roomID,
            });
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
                        className="videos row"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            height: "15%",
                            flexDirection: "column",
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
        </div>
    );
};
