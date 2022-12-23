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
    faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Windowheight = window.innerHeight;

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
    const refState = useRef(null);
    useEffect(() => {
        socket.on("chat-message-recv", (data) => {
            if (data.username == username) return;
            setMessages((prev) => [
                ...prev,
                {
                    username: data.username,
                    message: data.message,
                    timestamp: data.timestamp,
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
    function check(text) {
        if (text == "") return true;
        const lines = text.split("\n");
        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[i].length; j++) {
                if (lines[i][j] != " ") {
                    return false;
                }
            }
        }
        return true;
    }
    const sendMessage = () => {
        console.log(`text : asa${text}d`);

        if (check(text) == true) return;
        console.log("check failed");
        const timestamp = Date.now();
        socket.emit("chat-message-send", {
            roomID: roomID,
            username: "hi",
            message: text,
            userID: userID,
            timestamp: timestamp,
        });
        const messages_temp = [...messages];
        messages_temp.push({
            username: username,
            message: text,
            timestamp: timestamp,
        });
        console.log("messages_temp : ", messages_temp);
        setMessages(messages_temp);
        setText(() => "");
    };
    const changeTimeFormat = (timestamp) => {
        let date = new Date(timestamp);
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        return hours + ":" + minutes.slice(-2);
    };
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
                                messages.map((m, index) => {
                                    return m.username === username ? (
                                        <div className="d-flex flex-row justify-content-end ">
                                            <div>
                                                <p
                                                    className="small text-break message text-white p-2 mb-1 rounded-3 bg-primary message"
                                                    style={{ margin: 0 }}
                                                >
                                                    {m.message}
                                                </p>
                                                {index + 1 == messages.length ||
                                                (messages[index + 1]
                                                    .username === m.username &&
                                                    changeTimeFormat(
                                                        messages[index + 1]
                                                            .timestamp
                                                    ) !==
                                                        changeTimeFormat(
                                                            m.timestamp
                                                        )) ? (
                                                    <p
                                                        class="small rounded-3 text-muted d-flex justify-content-end"
                                                        style={{ margin: 0 }}
                                                    >
                                                        {changeTimeFormat(
                                                            m.timestamp
                                                        )}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-row justify-content-start ">
                                            <div>
                                                {index == 0 ||
                                                messages[index - 1].username !=
                                                    m.username ? (
                                                    <p class="small rounded-3 m-0 d-flex justify-content-start">
                                                        {m.username}
                                                    </p>
                                                ) : null}
                                                <p
                                                    className="small text-break message text-white p-2 mb-1 rounded-3 bg-secondary message"
                                                    style={{ margin: 0 }}
                                                >
                                                    {m.message}
                                                </p>
                                                {index + 1 == messages.length ||
                                                (messages[index + 1]
                                                    .username === m.username &&
                                                    changeTimeFormat(
                                                        messages[index + 1]
                                                            .timestamp
                                                    ) !==
                                                        changeTimeFormat(
                                                            m.timestamp
                                                        )) ? (
                                                    <p
                                                        class="small rounded-3 text-muted d-flex justify-content-start"
                                                        style={{ margin: 0 }}
                                                    >
                                                        {changeTimeFormat(
                                                            m.timestamp
                                                        )}
                                                    </p>
                                                ) : null}
                                            </div>
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
