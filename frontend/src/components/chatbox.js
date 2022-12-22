import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getUser } from "../services/authService";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/chat.css";
import {
    faClose,
    faPaperPlane,
    faCommentSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Windowheight = window.innerHeight;
const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
};

export const Chatbox = (props) => {
    const {
        socket,
        roomID,
        setChat,
        setChatButton,
        username,
        userID,
        messages,
        setMessages,
    } = props;
    const [text, setText] = useState("");
    const [shiftTimeStamp, setShiftTimeStamp] = useState(0);
    const refState = useRef(null);
    useEffect(() => {
        // const username = getUser();
        // if (username == null) {
        //     navigate("/");
        // }
        socket.on("chat-message-recv", (data) => {
            if (data.username == username) return;
            setMessages((prev) => [
                ...prev,
                {
                    username: data.username,
                    message: data.message,
                },
            ]);
        });
    }, []);
    const scrollToBottom = () => {
        if (refState == null) return;
        refState.current.scrollIntoView();
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const sendMessage = () => {
        console.log(`text : asa${text}d`);
        console.log("dlfhs : ", text === " ");
        if (text == "") return;
        socket.emit("chat-message-send", {
            roomID: roomID,
            username: "sanath",
            message: text,
            userID: userID,
        });
        const messages_temp = [...messages];
        messages_temp.push({ username: username, message: text });
        console.log("messages_temp : ", messages_temp);
        setMessages(messages_temp);
        setText(() => "");
    };
    console.log("shuft time : ", shiftTimeStamp);
    return (
        <div
            className="container col-sm-4 py-0 px-0"
            style={{ height: Windowheight }}
        >
            <div
                className="row d-flex justify-content-center"
                style={{ height: Windowheight, margin: 0 }}
            >
                <div
                    className="col-md-10 col-lg-8 col-xl-6"
                    style={{ height: Windowheight, width: "100%", padding: 0 }}
                >
                    <div
                        className="card"
                        id="chat2"
                        style={{ height: Windowheight }}
                    >
                        <div className="card-header d-flex justify-content-between align-items-center p-3">
                            <h5 className="mb-0">Chat</h5>
                            <button
                                className="btn btn-outline-secondary btn-sm rounded-4"
                                data-mdb-ripple-color="dark"
                                onClick={() => {
                                    setChat(0);
                                    setChatButton({
                                        className: "btn btn-danger",
                                        icon: faCommentSlash,
                                    });
                                }}
                            >
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                        </div>
                        <div
                            className="card-body"
                            data-mdb-perfect-scrollbar="true"
                            style={{
                                maxHeight: "90%",
                                overflow: "auto",
                                height: "90%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {messages &&
                                messages.map((m) => {
                                    return m.username === username ? (
                                        <div className="d-flex flex-row justify-content-end ">
                                            <p className="small p-2 me-3 text-break mb-1 text-white rounded-3 bg-primary message">
                                                {m.message}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-row justify-content-start ">
                                            <p className="small p-2 ms-3 text-break mb-1 text-white rounded-3 bg-secondary message">
                                                {m.message}
                                            </p>
                                        </div>
                                    );
                                })}
                            <div ref={refState}></div>
                        </div>
                        <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                            <textarea
                                onChange={(e) => setText(e.target.value)}
                                type="text"
                                value={text}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        sendMessage();
                                    }
                                }}
                                placeholder="Type message"
                                className="form-control form-control-lg"
                                id="exampleFormControlInput1"
                                style={{ resize: "none" }}
                            />
                            <button
                                className="btn btn-primary ms-3"
                                onClick={() => sendMessage()}
                            >
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
