import React, { useEffect, useRef, useState, useContext } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import { useNavigate, useParams } from "react-router-dom";
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
import config from "../config.json";
import userImg from "../images/defaultUser.png";
import { UserAvatar } from "../components/userAvatar";
import { ReactComponent as Hangup } from "../images/hangup.svg";
import { ReactComponent as ScreenShare } from "../images/screenShare.svg";
import { getUser } from "../services/authService";
import { SocketContext } from "../context/socket";
import "../css/Proom.css";

const Windowheight = window.innerHeight;

export const PrivateRoom = () => {
    const [chat, setChat] = useState(0);
    const { roomID, eventID } = useParams();
    const [myInfo, setMyInfo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [usersInRoom, setUsersInRoom] = useState([]);
    const [CurVideoID, setCurVideoID] = useState(0);
    const [newMessage, setNewMessage] = useState(0);
    const socket = useContext(SocketContext);
    const [myUserID, setMyUserID] = useState(uuidv4());
    const [usersVideoStatus, setUsersVideoStatus] = useState({});
    const [myPeer, setMyPeer] = useState();
    const [screenStream, setScreenStream] = useState(null);
    const [othersScreenShare, setOthersScreenShare] = useState(null);
    const [streamState, setStreamState] = useState();
    const [micButton, setMicButton] = useState({
        className: "btn btn-danger",
        icon: faMicrophoneSlash,
    });
    const [videoButton, setVideoButton] = useState({
        className: "btn btn-danger",
        icon: faVideoSlash,
    });
    const [chatButton, setChatButton] = useState({
        icon: faCommentSlash,
        className: "btn btn-danger",
    });
    const [screenButton, setScreenButton] = useState({
        className: "btn btn-dark",
    });
    const navigate = useNavigate();
    console.log("myUserId : ", myUserID);

    const getVideoClass = (userID) => {
        console.log("creating video class : ", userID, CurVideoID);
        const videoClass = document.querySelector(".videos");
        const myVideo = document.createElement("video");
        const div_wrapper = document.createElement("div");
        div_wrapper.classList.add("videoWrapper");
        div_wrapper.style =
            "display: flex; justify-content: center; height: 100%;width:130px";
        myVideo.classList.add("camVideo");
        myVideo.classList.add(`V${CurVideoID}`);
        div_wrapper.classList.add(`D${CurVideoID}`);
        myVideo.style = "display:none;margin:5px";
        div_wrapper.append(myVideo);
        videoClass.append(div_wrapper);
        // mapperRef.current[userID] = CurVideoID;
        setCurVideoID((CurVideoID) => {
            return CurVideoID + 1;
        });
        console.log("adding : ", myVideo);
        return {
            MainClass: videoClass,
            myEle: myVideo,
            div_wrapper: div_wrapper,
            videoID: CurVideoID,
        };
    };
    const getVideoClassRef = useRef();
    getVideoClassRef.current = getVideoClass;
    const VideoStreamingInit = async (myInfo) => {
        var canvas = document.createElement("canvas");
        var canvas_stream = canvas.captureStream(25);
        var canvas_track = canvas_stream.getTracks()[0];
        console.log(canvas_stream.getTracks());
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true,
            });
            stream.getAudioTracks()[0].enabled = false;
            stream.addTrack(canvas_track);
            const elements = getVideoClassRef.current(myUserID);
            elements.myEle.srcObject = stream;
            elements.myEle.autoPlay = true;
            elements.myEle.addEventListener("loadedmetadata", () => {
                elements.myEle.play();
            });
            elements.myEle.style.display = "none";
            setStreamState(stream);
            const videoID = elements.videoID;
            setUsersInRoom((usersInRoom) => [
                ...usersInRoom,
                { ...myInfo, videoID: videoID },
            ]);
            const temp = {};
            temp[videoID] = 0;
            setUsersVideoStatus((usersVideoStatus) => {
                return { ...usersVideoStatus, ...temp };
            });
        } catch (err) {
            alert(`${err}.Enable access`);
        }
    };
    useEffect(() => {
        console.log("usersvideo status changed : ", usersVideoStatus);
        Object.keys(usersVideoStatus).map((k, index) => {
            const b = usersVideoStatus[k];
            console.log(" k : ", k, b);
            if (b == 0) {
                const avat = document.querySelector(`.A${k}`);
                if (avat) {
                    const div_wrapper = document.querySelector(`.D${k}`);
                    div_wrapper.append(avat);
                }
            } else {
                const video = document.querySelector(`.V${k}`);
                if (video) {
                    video.style.display = null;
                }
            }
        });
    }, [usersVideoStatus]);
    useEffect(() => {
        console.log("users In room changed..");
    }, [usersInRoom]);
    const UserConnectedHandler = (data) => {
        const elements = getVideoClassRef.current(data.userID);
        console.log("when calling : ", streamState.getTracks());
        const call = myPeer.call(data.userID, streamState, {
            metadata: {
                userID: myInfo.userID,
                handle: myInfo.handle,
                color: myInfo.color,
                videoOn: videoButton.className == "btn btn-dark",
            },
        });
        console.log("new user came : ", data.userID, myInfo, elements.videoID);
        const videoID = elements.videoID;
        setUsersInRoom((usersInRoom) => [
            ...usersInRoom,
            {
                userID: data.userID,
                videoID: videoID,
                handle: data.handle,
                color: data.color,
                call: call,
            },
        ]);
        const temp = {};
        temp[videoID] = 0;
        setUsersVideoStatus((usersVideoStatus) => {
            return { ...usersVideoStatus, ...temp };
        });
        call.on("stream", (stream) => {
            console.log("call started...");
            elements.myEle.srcObject = stream;
            elements.myEle.autoPlay = true;
            elements.myEle.addEventListener("loadedmetadata", () => {
                elements.myEle.play();
            });
        });
    };
    useEffect(() => {
        if (myInfo != null) return;
        const data = getUser("token");
        if (data == null) {
            navigate("/");
        } else {
            const endpoint =
                config.apiUrl +
                `/room/getHandleFromRoom?username=${data.username}&eventID=${eventID}&roomID=${roomID}`;
            fetch(endpoint)
                .then((response) => response.json())
                .then((res) => {
                    if (res.code == 200) {
                        const myInfo = {
                            handle: res.handle,
                            color: data.color,
                            userID: myUserID,
                        };
                        VideoStreamingInit(myInfo);
                        setMyInfo(myInfo);
                    } else {
                        navigate("/");
                    }
                });
        }
    }, []);
    useEffect(() => {
        if (myInfo == null) return;
        if (!streamState) return;
        const myPeer = new Peer(myUserID);
        setMyPeer(myPeer);
        myPeer.on("open", (userID) => {
            console.log("peer connected : ", userID);
            socket.emit("join-room", {
                roomID: roomID,
                userID: userID,
                handle: myInfo.handle,
                color: myInfo.color,
            });
        });
    }, [myInfo, streamState]);
    useEffect(() => {
        console.log("useEffect called....", streamState);
        if (myPeer == null) return;
        myPeer.on("call", (call) => {
            console.log("streamState when ansewering : ", streamState);
            call.answer(streamState);
            const { userID, handle, color, videoOn } = call.metadata;
            const elements = getVideoClassRef.current(userID);
            console.log("call came : ", call.metadata.userID, elements.videoID);
            const videoID = elements.videoID;
            setUsersInRoom((usersInRoom) => [
                ...usersInRoom,
                {
                    userID: userID,
                    videoID: videoID,
                    handle: handle,
                    color: color,
                    call: call,
                },
            ]);
            if (videoOn == true) {
                const temp = {};
                temp[videoID] = 1;
                setUsersVideoStatus((usersVideoStatus) => {
                    return { ...usersVideoStatus, ...temp };
                });
            } else {
                const temp = {};
                temp[videoID] = 0;
                setUsersVideoStatus((usersVideoStatus) => {
                    return { ...usersVideoStatus, ...temp };
                });
            }
            call.on("stream", (stream) => {
                console.log("call startedd....");
                elements.myEle.srcObject = stream;
                elements.myEle.autoPlay = true;
                elements.myEle.addEventListener("loadedmetadata", () => {
                    elements.myEle.play();
                });
            });
        });
    }, [myPeer, CurVideoID, streamState, screenStream]);
    useEffect(() => {
        socket.on("user-connected", (data) => UserConnectedHandler(data));
        socket.on("user-disconnected", (userID) => {
            console.log("disconnected...", userID, usersInRoom);
            if (userID == myInfo.userID) {
                HandleEndCall();
                return;
            }
            for (let i = 0; i < usersInRoom.length; i++) {
                if (usersInRoom[i].userID == userID) {
                    console.log("cideoID : ", usersInRoom[i].videoID);
                    usersInRoom[i].call.close();
                    const id = usersInRoom[i].videoID;
                    document.querySelector(`.D${id}`).remove();
                }
            }
            if (othersScreenShare && othersScreenShare["userID"] == userID) {
                othersScreenShare["call"].close();
                setOthersScreenShare(null);
                document.querySelector(".ScreenShare").remove();
            }
        });
        socket.on("start-video-cam-again-recv", (data) => {
            console.log("start video cam");
            for (let i = 0; i < usersInRoom.length; i++) {
                if (usersInRoom[i].userID == data.userID) {
                    let id = usersInRoom[i].videoID;
                    document.querySelector(`.V${id}`).style.display = null;
                    document
                        .querySelector(".avatars")
                        .append(document.querySelector(`.A${id}`));
                    const temp = {};
                    temp[id] = 1;
                    setUsersVideoStatus((usersVideoStatus) => {
                        return { ...usersVideoStatus, ...temp };
                    });
                    break;
                }
            }
        });
        socket.on("stop-video-cam-recv", (data) => {
            console.log("stop video cam");
            for (let i = 0; i < usersInRoom.length; i++) {
                if (usersInRoom[i].userID == data.userID) {
                    let id = usersInRoom[i].videoID;
                    document.querySelector(`.V${id}`).style =
                        "display:none;margin:5px";
                    document
                        .querySelector(`.D${id}`)
                        .append(document.querySelector(`.A${id}`));
                    const temp = {};
                    temp[id] = 0;
                    setUsersVideoStatus((usersVideoStatus) => {
                        return { ...usersVideoStatus, ...temp };
                    });
                    break;
                }
            }
        });
        socket.on("screen-share-recv", (data) => {
            const call = myPeer.call(data.screenuuid, streamState, {
                metadata: { userID: myInfo.userID },
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
            });
            setOthersScreenShare({ call: call, userID: data.userID });
        });
        socket.on("stopped-screen-share-recv", (data) => {
            const { call } = othersScreenShare;
            call.close();
            document.querySelector(".ScreenShare").remove();
            setOthersScreenShare(null);
        });
        socket.on("chat-message-recv", (data) => {
            if (data.handle == myInfo.handle) return;
            if (chat == 0) {
                setNewMessage((prev) => prev + 1);
            } else {
                setNewMessage(0);
            }
            setMessages((prev) => [
                ...prev,
                {
                    handle: data.handle,
                    message: data.message,
                    timestamp: data.timestamp,
                },
            ]);
        });
        return () => {
            socket.off("user-connected");
            socket.off("user-disconnected");
            socket.off("start-video-cam-again-recv");
            socket.off("stop-video-cam-recv");
            socket.off("screen-share-recv");
            socket.off("stopped-screen-share-recv");
            socket.off("chat-message-recv");
        };
    }, [
        socket,
        myPeer,
        myInfo,
        CurVideoID,
        streamState,
        usersInRoom,
        screenStream,
        othersScreenShare,
        videoButton,
        chat,
    ]);

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
        let id;
        for (let i = 0; i < usersInRoom.length; i++) {
            if (usersInRoom[i].userID == myUserID) {
                id = usersInRoom[i].videoID;
            }
        }
        if (videoButton_temp["className"] == "btn btn-danger") {
            videoButton_temp["className"] = "btn btn-dark";
            videoButton_temp["icon"] = faVideoCamera;
            if (streamState.getVideoTracks().length > 0)
                streamState.removeTrack(streamState.getVideoTracks()[0]);
            navigator.mediaDevices
                .getUserMedia({
                    video: true,
                })
                .then((stream) => {
                    streamState.addTrack(stream.getVideoTracks()[0]);
                    setStreamState(streamState);

                    const myVideo = document.querySelector(`.V${id}`);
                    const avat = document.querySelector(`.A${id}`);
                    document.querySelector(".avatars").append(avat);
                    myVideo.style.display = null;
                    console.log("usersINRoom : ", usersInRoom);
                    for (let i = 0; i < usersInRoom.length; i++) {
                        if (usersInRoom[i].call) {
                            console.log("replcaing.... ", usersInRoom[i]);
                            usersInRoom[i].call.peerConnection
                                .getSenders()[1]
                                .replaceTrack(stream.getVideoTracks()[0]);
                        }
                    }
                    const temp = {};
                    temp[id] = 1;
                    setUsersVideoStatus((usersVideoStatus) => {
                        return { ...usersVideoStatus, ...temp };
                    });
                    socket.emit("start-video-cam-again-send", {
                        userID: myUserID,
                        roomID: roomID,
                    });
                })
                .catch((err) => {
                    alert(`${err}.Enable access`);
                });
        } else {
            videoButton_temp["className"] = "btn btn-danger";
            videoButton_temp["icon"] = faVideoSlash;
            streamState.getVideoTracks()[0].stop();
            const video = document.querySelector(`.V${id}`);
            video.style = "display:none;";
            const div = document.querySelector(`.D${id}`);
            div.append(document.querySelector(`.A${id}`));
            socket.emit("stop-video-cam-send", {
                roomID: roomID,
                userID: myUserID,
            });
            const temp = {};
            temp[id] = 0;
            setUsersVideoStatus((usersVideoStatus) => {
                return { ...usersVideoStatus, ...temp };
            });
        }
        setVideoButton(videoButton_temp);
    };
    const HandleChatbutton = () => {
        setNewMessage(0);
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
        if (othersScreenShare) {
            return;
        } else if (screenButton.className == "btn btn-dark") {
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
                        userID: myInfo.userID,
                        roomID: roomID,
                    });
                    screenPart.srcObject = ScreenStream;
                    screen_class.append(screenPart);
                    screenPart.addEventListener("loadedmetadata", () => {
                        screenPart.play();
                    });
                    setScreenButton({ className: "btn btn-danger" });
                    screenPeer.on("call", (call) => {
                        call.answer(ScreenStream);
                    });
                    setScreenStream(() => ScreenStream);
                })
                .catch((err) => {
                    alert(`${err}.Enable access`);
                });
        } else {
            console.log("closing : ", screenStream);
            const screenPart = document.querySelector(".ScreenShare");
            await screenStream.getTracks().forEach((track) => track.stop());
            screenPart.remove();
            setScreenStream(null);
            socket.emit("stopped-screen-share-send", {
                roomID: roomID,
                userID: myUserID,
            });
            setScreenButton({ className: "btn btn-dark" });
        }
    };
    const HandleEndCall = () => {
        if (screenStream) {
            screenStream.getTracks().forEach(function (track) {
                track.stop();
            });
        }
        if (streamState) {
            streamState.getTracks().forEach(function (track) {
                track.stop();
            });
        }
        socket.disconnect();
        for (let i = 0; i < usersInRoom.length; i++) {
            if (usersInRoom[i].userID != myInfo.userID) {
                usersInRoom[i].call.close();
            }
        }
        navigate("/dashboard");
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
                        className="videos m-3"
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            height: "15%",
                            flexDirection: "row",
                        }}
                    ></div>
                    <div className="main-screen row mx-4 my-2 p-2"></div>
                    <div
                        className="row justify-content-md-center row-cols-auto position-absolute start-50 translate-middle"
                        style={{ bottom: -25 }}
                    >
                        <div className="col p-1">
                            <button
                                className={`${micButton.className} rounded-5`}
                                onClick={() => HandleMicButton()}
                                style={{ fontSize: 20 }}
                            >
                                <FontAwesomeIcon icon={micButton.icon} />
                            </button>
                        </div>
                        <div className="col p-1">
                            <button
                                className={`${videoButton.className} rounded-5`}
                                onClick={() => HandleVideoButton()}
                                style={{ fontSize: 20 }}
                            >
                                <FontAwesomeIcon icon={videoButton.icon} />
                            </button>
                        </div>
                        <div className="col p-1">
                            <button
                                className={`${chatButton.className} rounded-5`}
                                onClick={() => HandleChatbutton()}
                                style={{ fontSize: 20 }}
                            >
                                <FontAwesomeIcon icon={chatButton.icon} />
                                {newMessage > 0 ? (
                                    <span
                                        class="position-absolute px-2 translate-middle bg-primary border border-dark rounded-circle"
                                        style={{
                                            padding: "3px",
                                            left: "58%",
                                            fontSize: "10px",
                                            color: "#fff",
                                            top: "6px",
                                        }}
                                    >
                                        {newMessage}
                                    </span>
                                ) : null}
                            </button>
                        </div>
                        <div className="col p-1">
                            <button
                                className={`${screenButton.className} rounded-5`}
                                onClick={() => HandleScreenShareButton()}
                            >
                                <ScreenShare width={20} height={30} />
                            </button>
                        </div>
                        <div className="col p-1">
                            <button
                                className={"btn btn-danger rounded-5"}
                                onClick={() => HandleEndCall()}
                            >
                                <Hangup width={20} height={30} />
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
                        handle={myInfo.handle}
                        userID={myUserID}
                        messages={messages}
                        setMessages={setMessages}
                    />
                ) : null}
            </div>
            <div className="avatars" style={{ display: "none" }}>
                {usersInRoom.length > 0 &&
                    usersInRoom.map((a, index) => {
                        console.log("a : ", a);
                        return (
                            <div className={`A${a.videoID} mx-2`} key={index}>
                                <UserAvatar
                                    name={a.handle}
                                    color={a.color}
                                    showName={true}
                                />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};
