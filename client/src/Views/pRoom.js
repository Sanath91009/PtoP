// this is rough work file

// import React, { useEffect, useRef, useState, useCallback } from "react";
// import io from "socket.io-client";
// import Peer from "peerjs";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//     faMicrophone,
//     faMicrophoneSlash,
//     faVideoCamera,
//     faVideoSlash,
//     faComment,
//     faCommentSlash,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Chatbox } from "../components/chatbox";
// import { v4 as uuidv4 } from "uuid";
// import userImg from "../images/defaultUser.png";
// import { UserAvatar } from "../components/userAvatar";
// import { ReactComponent as Hangup } from "../images/hangup.svg";
// import { ReactComponent as ScreenShare } from "../images/screenShare.svg";
// import { getUser } from "../services/authService";
// import config from "../config.json";
// import "../css/Proom.css";

// const Windowheight = window.innerHeight;
// export const PrivateRoom = () => {
//     const { eventID, roomID } = useParams();
//     const navigate = useNavigate();
//     const [chat, setChat] = useState(1);
//     const [myuserId, setMyUserId] = useState(uuidv4());
//     const [screenID, setScreenID] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const streamState = useRef();
//     const peersRef = useRef({});
//     const mapperRef = useRef({});
//     console.log("re-rendering", mapperRef.current, peersRef.current);
//     const [micButton, setMicButton] = useState({
//         className: "btn btn-danger",
//         icon: faMicrophoneSlash,
//     });
//     const [videoButton, setVideoButton] = useState({
//         className: "btn btn-danger",
//         icon: faVideoSlash,
//     });
//     const [chatButton, setChatButton] = useState({
//         icon: faComment,
//         className: "btn btn-dark",
//     });
//     const [screenButton, setScreenButton] = useState({
//         className: "btn btn-dark",
//     });
//     const [screenStream, setScreenStream] = useState(null);
//     const [othersScreenShare, setOthersScreenShare] = useState(false);
//     const [usersInRoom, setUsersInRoom] = useState([]);
//     const [videoID, setVideoId] = useState(0);
//     const setVideoRef = useRef();
//     const [myInfo, setMyInfo] = useState({});
//     setVideoRef.current = setVideoId;
//     const socket = io.connect(config.apiUrl);
//     const myPeer = new Peer(myuserId);
//     const addToPeers = (userID, call, videoCard, type = "normal") => {
//         const obj = {
//             call: call,
//             videoCard: videoCard,
//             type: type,
//         };
//         if (peersRef.current[userID] === undefined) {
//             peersRef.current[userID] = [obj];
//         } else {
//             peersRef.current[userID] = [obj, ...peersRef.current[userID]];
//         }
//     };

//     const getVideoClass = (userID) => {
//         console.log("creating video class : ", userID, videoID);
//         const videoClass = document.querySelector(".videos");
//         const myVideo = document.createElement("video");
//         const div_wrapper = document.createElement("div");
//         div_wrapper.classList.add("videoWrapper");
//         div_wrapper.style =
//             "display: flex; justify-content: center; height: 100%;width:118px";
//         myVideo.classList.add("camVideo");
//         myVideo.classList.add(`V${videoID}`);
//         div_wrapper.classList.add(`D${videoID}`);
//         mapperRef.current[userID] = videoID;
//         setVideoId((videoID) => {
//             return videoID + 1;
//         });
//         console.log("adding : ", myVideo);
//         return {
//             MainClass: videoClass,
//             myEle: myVideo,
//             div_wrapper: div_wrapper,
//         };
//     };
//     const getVideoClassRef = useRef();
//     getVideoClassRef.current = getVideoClass;

//     const VideoStreamingInit = async () => {
//         var canvas = document.createElement("canvas");
//         var canvas_stream = canvas.captureStream(25);
//         var canvas_track = canvas_stream.getTracks()[0];
//         const stream = await navigator.mediaDevices.getUserMedia({
//             video: false,
//             audio: true,
//         });
//         stream.getAudioTracks()[0].enabled = false;
//         stream.addTrack(canvas_track);
//         const elements = getVideoClassRef.current(myuserId);
//         streamState.current = stream;
//         addVideoStream(
//             elements.myEle,
//             elements.div_wrapper,
//             elements.MainClass,
//             stream,
//             true
//         );
//         myPeer.on("connection", function (conn) {
//             console.log("opened in answered side...");
//             conn.on("open", function () {
//                 setMyInfo((myInfo) => {
//                     conn.send({
//                         userID: myuserId,
//                         handle: myInfo.handle,
//                         firstMessage: true,
//                         color: myInfo.color,
//                     });
//                     setVideoButton((videoButton) => {
//                         if (videoButton["className"] == "btn btn-danger") {
//                             conn.send({
//                                 userID: myuserId,
//                                 remove: true,
//                             });
//                         }
//                         return videoButton;
//                     });
//                     return myInfo;
//                 });

//                 conn.on("data", function (data) {
//                     console.log(
//                         "received from data channel : ",
//                         data,
//                         mapperRef.current[data.userID]
//                     );
//                     if (data.remove != undefined && data.remove == true) {
//                         const timer = setTimeout(() => {
//                             console.log(
//                                 "cideo : ",
//                                 mapperRef.current[data.userID]
//                             );
//                             const video = document.querySelector(
//                                 `.V${mapperRef.current[data.userID]}`
//                             );
//                             video.style = "display:none;";
//                             const div = document.querySelector(
//                                 `.D${mapperRef.current[data.userID]}`
//                             );
//                             div.append(
//                                 document.querySelector(
//                                     `.A${mapperRef.current[data.userID]}`
//                                 )
//                             );
//                         }, 1000);
//                     }
//                     if (data.add != undefined && data.add == true) {
//                         const avat = document.querySelector(
//                             `.A${mapperRef.current[data.userID]}`
//                         );
//                         document.querySelector(".avatars").append(avat);
//                         const video = document.querySelector(
//                             `.V${mapperRef.current[data.userID]}`
//                         );
//                         video.style.display = null;
//                     }
//                     if (data.firstMessage == true) {
//                         getVideoClassRef.current(data.userID);
//                         setUsersInRoom((usersInRoom) => {
//                             return [
//                                 ...usersInRoom,
//                                 {
//                                     id: mapperRef.current[data.userID],
//                                     handle: data.handle,
//                                     color: data.color,
//                                 },
//                             ];
//                         });
//                         addToPeers(data.userID, conn, null, "data");
//                     }
//                 });
//             });
//         });
//         myPeer.on("call", (call) => {
//             call.answer(stream);
//             console.log("call answered : ", call.metadata);
//             const userID = call.metadata.userID;
//             const myEle = document.querySelector(
//                 `.V${mapperRef.current[userID]}`
//             );
//             const div_wrapper = document.querySelector(
//                 `.D${mapperRef.current[userID]}`
//             );
//             const MainClass = document.querySelector(".videos");
//             call.on("stream", (stream_temp) => {
//                 addVideoStream(myEle, div_wrapper, MainClass, stream_temp);
//             });
//             addToPeers(userID, call, div_wrapper);
//         });

//         socket.on("screen-share-recv", (data) => {
//             console.log("screen share recv : ", data, stream);
//             setOthersScreenShare((prev) => true);
//             const call = myPeer.call(data.screenuuid, stream, {
//                 metadata: { userID: myuserId },
//             });
//             const screen_class = document.querySelector(".main-screen");
//             const screenPart = document.createElement("video");
//             screenPart.classList.add("ScreenShare");
//             call.on("stream", (stream) => {
//                 console.log("call started : ", call);
//                 screenPart.srcObject = stream;
//                 screenPart.addEventListener("loadedmetadata", () => {
//                     screenPart.play();
//                 });
//                 screen_class.append(screenPart);
//                 addToPeers(data.userID, call, screenPart, "screen");
//             });
//         });
//         socket.on("stopped-screen-share-recv", (userID) => {
//             console.log("screen sharing stopped ", othersScreenShare);
//             setOthersScreenShare(() => false);
//             peersRef.current[userID].forEach((stream) => {
//                 if (stream.type == "screen") {
//                     stream.call.close();
//                     stream.videoCard.remove();
//                 }
//             });
//         });
//         socket.on("stop-video-cam-recv", (data) =>
//             stopVideoCamHandlerRef.current(data)
//         );
//     };
//     const proom_init = async () => {
//         const info = getUser("token");
//         if (info == null) {
//             navigate("/auth");
//         }
//         const { color, username } = info;
//         const endpoint1 =
//             config.apiUrl +
//             `/event/getCandidateInfo?eventID=${eventID}&username=${username}`;
//         await fetch(endpoint1)
//             .then((response) => response.json())
//             .then((data) => {
//                 const info1 = data.message[0];
//                 const { handle, solved, rating } = info1;
//                 console.log("data : ", data);

//                 setMyInfo({
//                     handle: handle,
//                     solved: solved,
//                     rating: rating,
//                     color: color,
//                 });
//                 setUsersInRoom((e) => [
//                     ...e,
//                     { handle: handle, color: color, id: 0 },
//                 ]);
//             });
//     };
//     const UserConnectedHandler = (userID) => {
//         console.log("in handler ...");
//         var conn = myPeer.connect(userID);
//         conn.on("open", function () {
//             console.log("myINfo in conn open:  ", myInfo);
//             conn.send({
//                 userID: myuserId,
//                 handle: myInfo.handle,
//                 firstMessage: true,
//                 color: myInfo.color,
//             });
//             if (videoButton["className"] == "btn btn-danger") {
//                 conn.send({
//                     userID: myuserId,
//                     remove: true,
//                 });
//             }

//             conn.on("data", function (data) {
//                 if (data.remove != undefined && data.remove == true) {
//                     const timer = setTimeout(() => {
//                         const video = document.querySelector(
//                             `.V${mapperRef.current[data.userID]}`
//                         );
//                         console.log(
//                             "in data.reomve : ",
//                             video,
//                             mapperRef.current[data.userID]
//                         );
//                         video.style = "display:none;";
//                         const div = document.querySelector(
//                             `.D${mapperRef.current[data.userID]}`
//                         );
//                         div.append(
//                             document.querySelector(
//                                 `.A${mapperRef.current[data.userID]}`
//                             )
//                         );
//                     }, 1000);
//                 }
//                 if (data.add != undefined && data.add == true) {
//                     const avat = document.querySelector(
//                         `.A${mapperRef.current[data.userID]}`
//                     );
//                     document.querySelector(".avatars").append(avat);
//                     const video = document.querySelector(
//                         `.V${mapperRef.current[data.userID]}`
//                     );
//                     video.style.display = null;
//                 }
//                 if (data.firstMessage == true) {
//                     getVideoClassRef.current(data.userID);
//                     setUsersInRoom((usersInRoom) => {
//                         return [
//                             ...usersInRoom,
//                             {
//                                 id: mapperRef.current[data.userID],
//                                 handle: data.handle,
//                                 color: data.color,
//                             },
//                         ];
//                     });
//                     addToPeers(data.userID, conn, null, "data");
//                 }
//             });
//         });
//         setMyInfo((myInfo) => {
//             const call = myPeer.call(userID, streamState.current, {
//                 metadata: {
//                     userID: myuserId,
//                     replace: false,
//                     handle: myInfo.handle,
//                     color: myInfo.color,
//                 },
//             });
//             const myEle = document.querySelector(
//                 `.V${mapperRef.current[userID]}`
//             );
//             const div_wrapper = document.querySelector(
//                 `.D${mapperRef.current[userID]}`
//             );
//             const MainClass = document.querySelector(".videos");
//             console.log(
//                 "call when connected user : ",
//                 myEle,
//                 mapperRef.current[userID]
//             );
//             call.on("stream", (stream) => {
//                 addVideoStream(myEle, div_wrapper, MainClass, stream);
//             });
//             addToPeers(userID, call, div_wrapper);
//             return myInfo;
//         });

//         addToPeers(userID, conn, null, "data");
//     };
//     const UserConnectedHandlerRef = useRef();
//     UserConnectedHandlerRef.current = UserConnectedHandler;
//     useEffect(() => {
//         proom_init();
//         myPeer.on("open", (id) => {
//             console.log("opened : ", id);
//             socket.emit("join-room", roomID, id);
//         });
//         VideoStreamingInit();
//     }, []);
//     useEffect(() => {
//         window.addEventListener("popstate", (event) => {
//             console.log("lshfoias");
//             HandleEndCall();
//         });
//     }, [streamState, screenStream]);
//     useEffect(() => {
//         socket.on("user-connected", (data) => {
//             UserConnectedHandlerRef.current(data);
//         });
//         socket.on("user-disconnected", (userID) => {
//             console.log("user disconnedted : ", userID);
//             console.log("peersRef.current : ", peersRef.current[userID]);
//             if (peersRef.current[userID]) {
//                 peersRef.current[userID].forEach((stream) => {
//                     deleteStream(stream);
//                 });
//             }

//             delete peersRef.current[userID];
//         });
//         return () => {
//             socket.off("user-connected");
//         };
//     }, [socket, myInfo, videoButton]); // handle disconnect
//     const deleteStream = (stream) => {
//         if (stream.videoCard) stream.videoCard.remove();
//         stream.call.close();
//         if (stream.type == "screen") {
//             setOthersScreenShare(() => false);
//         }
//     };
//     const stopVideoCamHandler = (data) => {
//         console.log("video closing : ", data);
//         peersRef.current[data.userID].forEach((stream) => {
//             if (stream.type == "normal") {
//                 stream.videoCard.childNodes[0].srcObject = undefined;
//                 stream.videoCard.childNodes[0].poster = userImg;
//             }
//         });
//     };
//     const stopVideoCamHandlerRef = useRef();
//     stopVideoCamHandlerRef.current = stopVideoCamHandler;

//     const addVideoStream = (
//         myVideo,
//         div_wrapper,
//         videos_class,
//         stream,
//         stop = false
//     ) => {
//         // console.log(
//         //     "adding vdei stream : ",
//         //     div_wrapper,
//         //     document.querySelector(".A0")
//         // );
//         myVideo.srcObject = stream;
//         myVideo.autoPlay = true;
//         myVideo.addEventListener("loadedmetadata", () => {
//             myVideo.play();
//         });
//         if (stop == true) {
//             myVideo.style = "display:none";
//             div_wrapper.append(document.querySelector(".A0"));
//         }
//         div_wrapper.append(myVideo);
//         videos_class.append(div_wrapper);
//     };

//     const HandleMicButton = () => {
//         const micButton_temp = { ...micButton };
//         if (micButton_temp["className"] == "btn btn-danger") {
//             micButton_temp["className"] = "btn btn-dark";
//             micButton_temp["icon"] = faMicrophone;
//             streamState.getAudioTracks()[0].enabled = true;
//         } else {
//             micButton_temp["className"] = "btn btn-danger";
//             micButton_temp["icon"] = faMicrophoneSlash;
//             console.log("streamstate : ", streamState);
//             streamState.getAudioTracks()[0].enabled = false;
//         }
//         setMicButton(micButton_temp);
//     };
//     const HandleVideoButton = () => {
//         const videoButton_temp = { ...videoButton };
//         if (videoButton_temp["className"] == "btn btn-danger") {
//             videoButton_temp["className"] = "btn btn-dark";
//             videoButton_temp["icon"] = faVideoCamera;
//             if (streamState.current.getVideoTracks().length > 0)
//                 streamState.current.removeTrack(
//                     streamState.current.getVideoTracks()[0]
//                 );
//             navigator.mediaDevices
//                 .getUserMedia({
//                     video: true,
//                 })
//                 .then((stream) => {
//                     streamState.current.addTrack(stream.getVideoTracks()[0]);
//                     const myVideo = document.querySelector(".V0");
//                     const avat = document.querySelector(".A0");
//                     document.querySelector(".avatars").append(avat);
//                     myVideo.style.display = null;
//                     console.log(myVideo);
//                     Object.keys(peersRef.current).forEach((key) => {
//                         peersRef.current[key].forEach((stream_temp) => {
//                             if (stream_temp.type == "normal") {
//                                 console.log(
//                                     "sflsdlf : ",
//                                     stream_temp.call.peerConnection.getSenders()
//                                 );
//                                 stream_temp.call.peerConnection
//                                     .getSenders()[1]
//                                     .replaceTrack(stream.getVideoTracks()[0]);
//                             }
//                             if (stream_temp.type == "data") {
//                                 console.log("sent data");
//                                 stream_temp.call.send({
//                                     userID: myuserId,
//                                     add: true,
//                                 });
//                             }
//                         });
//                     });
//                 });
//         } else {
//             videoButton_temp["className"] = "btn btn-danger";
//             videoButton_temp["icon"] = faVideoSlash;

//             streamState.current.getVideoTracks()[0].stop();
//             const video = document.querySelector(".V0");
//             video.style = "display:none;";
//             const div = document.querySelector(".D0");
//             div.append(document.querySelector(".A0"));

//             Object.keys(peersRef.current).forEach((key) => {
//                 peersRef.current[key].forEach((stream_temp) => {
//                     if (stream_temp.type == "data") {
//                         console.log("sent");
//                         stream_temp.call.send({
//                             userID: myuserId,
//                             remove: true,
//                         });
//                     }
//                 });
//             });
//         }
//         setVideoButton(videoButton_temp);
//     };
//     const HandleChatbutton = () => {
//         if (chat == 0) {
//             setChat(1);
//             setChatButton({
//                 className: "btn btn-dark",
//                 icon: faComment,
//             });
//         } else {
//             console.log("changing : ", chat);
//             setChat(0);
//             setChatButton({
//                 className: "btn btn-danger",
//                 icon: faCommentSlash,
//             });
//         }
//     };
//     const HandleScreenShareButton = async () => {
//         console.log("others : ", othersScreenShare);
//         if (othersScreenShare === true) {
//             return;
//         } else if (screenID == null) {
//             console.log("creating...");
//             const screenuuid = uuidv4();
//             const screenPeer = new Peer(screenuuid);
//             screenPeer.on("open", (id) =>
//                 console.log("screen peer open : ", id)
//             );
//             const screen_class = document.querySelector(".main-screen");
//             const screenPart = document.createElement("video");
//             screenPart.classList.add("ScreenShare");
//             navigator.mediaDevices
//                 .getDisplayMedia({
//                     video: { cursor: "always" },
//                     audio: {
//                         echoCancellation: true,
//                         noiseSuppression: true,
//                         sampleRate: 44100,
//                     },
//                 })
//                 .then((ScreenStream) => {
//                     socket.emit("screen-share-send", {
//                         screenuuid: screenuuid,
//                         handle: myInfo.handle,
//                         userID: myuserId,
//                         roomID: roomID,
//                     });
//                     screenPart.srcObject = ScreenStream;
//                     screen_class.append(screenPart);
//                     screenPart.addEventListener("loadedmetadata", () => {
//                         screenPart.play();
//                     });
//                     setScreenButton({ className: "btn btn-danger" });
//                     setScreenID(() => screenuuid);
//                     screenPeer.on("call", (call) => {
//                         call.answer(ScreenStream);
//                     });
//                     setScreenStream(() => ScreenStream);
//                 });
//         } else {
//             console.log("closing : ", screenStream);
//             const screenPart = document.querySelector(".ScreenShare");
//             await screenStream.getTracks().forEach((track) => track.stop());
//             screenPart.remove();
//             setScreenStream(null);
//             setScreenID(null);
//             socket.emit("stopped-screen-share-send", {
//                 roomID: roomID,
//                 userID: myuserId,
//             });
//             setScreenButton({ className: "btn btn-dark" });
//         }
//     };
//     const HandleEndCall = () => {
//         socket.disconnect();
//         if (screenStream) {
//             screenStream.getTracks().forEach(function (track) {
//                 track.stop();
//             });
//         }
//         if (streamState.current) {
//             streamState.current.getTracks().forEach(function (track) {
//                 track.stop();
//             });
//         }
//         Object.keys(peersRef.current).forEach((userID) => {
//             peersRef.current[userID].forEach((stream) => {
//                 deleteStream(stream);
//             });
//         });
//         navigate("/dashboard");
//     };
//     if (myInfo == {}) return <div></div>;
//     return (
//         <div
//             className="fluid-container"
//             style={{
//                 height: Windowheight,
//                 width: "100%",
//             }}
//         >
//             <div
//                 className="row"
//                 style={{ height: Windowheight, width: "100%", margin: 0 }}
//             >
//                 <div
//                     className={chat == 1 ? "col-sm-8" : "col-sm-12"}
//                     style={{
//                         height: Windowheight,
//                         padding: 0,
//                     }}
//                 >
//                     <div
//                         className="videos"
//                         style={{
//                             display: "flex",
//                             justifyContent: "center",
//                             height: "15%",
//                             flexDirection: "row",
//                         }}
//                     ></div>
//                     <div className="main-screen row"></div>
//                     <div
//                         className="row justify-content-md-center row-cols-auto position-absolute start-50 translate-middle"
//                         style={{ bottom: -25 }}
//                     >
//                         <div className="col p-1">
//                             <button
//                                 className={`${micButton.className} rounded-5`}
//                                 onClick={() => HandleMicButton()}
//                                 style={{ fontSize: 20 }}
//                             >
//                                 <FontAwesomeIcon icon={micButton.icon} />
//                             </button>
//                         </div>
//                         <div className="col p-1">
//                             <button
//                                 className={`${videoButton.className} rounded-5`}
//                                 onClick={() => HandleVideoButton()}
//                                 style={{ fontSize: 20 }}
//                             >
//                                 <FontAwesomeIcon icon={videoButton.icon} />
//                             </button>
//                         </div>
//                         <div className="col p-1">
//                             <button
//                                 className={`${chatButton.className} rounded-5`}
//                                 onClick={() => HandleChatbutton()}
//                                 style={{ fontSize: 20 }}
//                             >
//                                 <FontAwesomeIcon icon={chatButton.icon} />
//                             </button>
//                         </div>
//                         <div className="col p-1">
//                             <button
//                                 className={`${screenButton.className} rounded-5`}
//                                 onClick={() => HandleScreenShareButton()}
//                             >
//                                 <ScreenShare width={20} height={30} />
//                             </button>
//                         </div>
//                         <div className="col p-1">
//                             <button
//                                 className={"btn btn-danger rounded-5"}
//                                 onClick={() => HandleEndCall()}
//                             >
//                                 <Hangup width={20} height={30} />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//                 {chat == 1 ? (
//                     <Chatbox
//                         roomID={roomID}
//                         setChat={setChat}
//                         socket={socket}
//                         setChatButton={setChatButton}
//                         handle={myInfo.handle}
//                         userID={myuserId}
//                         messages={messages}
//                         setMessages={setMessages}
//                     />
//                 ) : null}
//             </div>
//             <div className="avatars">
//                 {usersInRoom &&
//                     usersInRoom.map((a, index) => {
//                         return (
//                             <div className={`A${a.id}`} key={index}>
//                                 <UserAvatar name={a.handle} color={a.color} />
//                             </div>
//                         );
//                     })}
//             </div>
//         </div>
//     );
// };
