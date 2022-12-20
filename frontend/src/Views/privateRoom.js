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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
var peers = {};
export const PrivateRoom = () => {
    const location = useLocation();
    const roomID = location.pathname.split("/").pop();
    const videoRef1 = useRef(null);
    const videoRef2 = useRef(null);
    const [streamState, setStreamState] = useState();
    const [micButton, setMicButton] = useState({
        className: "btn btn-danger",
        icon: faMicrophoneSlash,
    });
    const [videoButton, setVideoButton] = useState({
        className: "btn btn-dark",
        icon: faVideoSlash,
    });
    const socket = io.connect(config.apiUrl);
    const myPeer = new Peer(undefined);
    const VideoStreamingInit = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        stream.getAudioTracks()[0].enabled = false;
        // stream.getVideoTracks()[0].enabled = false;
        addVideoStream(videoRef1, stream);
        myPeer.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (stream_temp) =>
                addVideoStream(videoRef2, stream_temp)
            );
        });
        socket.on("user-connected", (userID) => {
            connectUser(userID, stream);
        });
        socket.on("user-disconnected", (userID) => {
            console.log("user disconnedted : ", userID);
            peers[userID].close();
        });
        setStreamState(stream);
    };
    useEffect(() => {
        myPeer.on("open", (id) => {
            console.log("opened");
            socket.emit("join-room", roomID, id);
        });
        VideoStreamingInit();
    }, []);
    const addVideoStream = (ref, stream) => {
        console.log("added : ", stream);
        ref.current.srcObject = stream;
        ref.current.autoPlay = true;
    };
    const connectUser = (userID, stream) => {
        const call = myPeer.call(userID, stream);
        call.on("stream", (stream_temp) => {
            addVideoStream(videoRef2, stream_temp);
        });
        call.on("close", () => {
            console.log("closing");
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        });
        peers[userID] = call;
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
            console.log("streamstate : ", streamState);
            streamState.getVideoTracks()[0].enabled = true;
        } else {
            videoButton_temp["className"] = "btn btn-danger";
            videoButton_temp["icon"] = faVideoSlash;
            console.log("streamstate : ", streamState);
            streamState.getVideoTracks()[0].enabled = false;
            // stream.getVideoTracks()[0].enabled = false;
        }
        setVideoButton(videoButton_temp);
    };
    return (
        <div style={{ width: "100%", height: "100%" }} className="row">
            <div className="col" style={{ height: "100%" }}>
                <video autoPlay={true} ref={videoRef1}></video>
                <video autoPlay={true} ref={videoRef2}></video>
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        textAlign: "center",
                        width: "100%",
                    }}
                >
                    <button
                        className={`${micButton.className} rounded-5`}
                        onClick={() => HandleMicButton()}
                        style={{ marginRight: 10, fontSize: 25 }}
                    >
                        <FontAwesomeIcon icon={micButton.icon} />
                    </button>
                    <button
                        className={`${videoButton.className} rounded-5`}
                        onClick={() => HandleVideoButton()}
                        style={{ marginRight: 10, fontSize: 25 }}
                    >
                        <FontAwesomeIcon icon={videoButton.icon} />
                    </button>
                    <button className="btn btn-danger rounded-5">
                        <img
                            width={36}
                            height={36}
                            src={require("../images/screenShare.png")}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};
