import React from "react";
import io from "socket.io-client";
import config from "../config.json";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/navbar";
const socket = io.connect(config.apiUrl);
function compare(a, b) {
    if (a.timestamp < b.timestamp) {
        return -1;
    }
    return 1;
}
export const GlobalRoom = () => {
    const location = useLocation();
    const { username, eventID, score = 2 } = location.state;
    const [requestees, setRequestees] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [reqSent, setReqSent] = useState({});
    const [reqAccepted, setReqAccepted] = useState({});
    const [roomLinks, setRoomLinks] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        socket.emit("join_room", { room: username });
        const endpoint = config.apiUrl + "/events/getCandidates";
        fetch(endpoint, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ eventID: eventID }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data : ", data);
                setCandidates(data.message);
                for (let i = 0; i < data.message.length; i++) {
                    if (username == data.message[i].username) {
                        const reqSent_temp = { ...reqSent };
                        for (
                            let j = 0;
                            j < data.message[i].requestsSent.length;
                            j++
                        ) {
                            let k = data.message[i].requestsSent[j].username;
                            reqSent_temp[k] = 1;
                        }
                        setReqSent(reqSent_temp);
                        setRequestees(data.message[i].requests);
                        data.message[i].roomLinks.sort(compare);
                        setRoomLinks(data.message[i].roomLinks);
                        break;
                    }
                }
            });
    }, []);
    useEffect(() => {
        socket.on("receive_message", (data) => {
            const requestees_temp = [...requestees];
            requestees_temp.push(data);
            console.log(requestees_temp);
            setRequestees(requestees_temp);
        });
        socket.on("createdRoom", (data) => {
            const roomLinks_temp = [...roomLinks];
            roomLinks_temp.push(data);
            roomLinks_temp.sort(compare);
            setRoomLinks(roomLinks_temp);
            toast(`Room Link - ${data.username}`);
        });
    }, [socket]);
    const HandleRequest = (candidate) => {
        if (
            reqSent[candidate.username] === undefined ||
            reqSent[candidate.username] === null
        ) {
            socket.emit("send_message", {
                eventID: eventID,
                username: username,
                score: score,
                room: candidate.username,
                room_score: candidate.score,
            });
            const reqSent_temp = { ...reqSent };
            reqSent_temp[candidate.username] = 1;
            setReqSent(reqSent_temp);
        }
    };
    const HandleRequestReceived = (candidate) => {
        const reqAccepted_temp = { ...reqAccepted };
        if (
            reqAccepted_temp[candidate.username] === undefined ||
            reqAccepted_temp[candidate.username] === null
        ) {
            const len = Object.keys(reqAccepted_temp).length;
            if (len == 1) {
                toast("You can select at most 1");
                return;
            }
            reqAccepted_temp[candidate.username] = 1;
        } else {
            delete reqAccepted_temp[candidate.username];
        }
        setReqAccepted(reqAccepted_temp);
    };
    const HandleCreationRoom = () => {
        socket.emit("CreateRoom", {
            requestTo: reqAccepted,
            username: username,
            score: score,
        });
    };
    const HandleRandomPairing = () => {
        socket.emit("join room", username);
        socket.emit("random_pairing", {
            eventID: eventID,
            username: username,
            score: score,
        });
    };
    if (candidates.length == 0) return <div>Loading....</div>;
    console.log("reqAccepted : ", reqAccepted);
    return (
        <div>
            <Navbar user={username} />
            <div className="text-center">
                <button
                    className="btn btn-dark"
                    onClick={() => HandleRandomPairing()}
                >
                    Start Random Pairing
                </button>
            </div>
            <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button
                        className="nav-link active"
                        id="nav-participants-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-participants"
                        type="button"
                        role="tab"
                        aria-controls="nav-participants"
                        aria-selected="true"
                    >
                        Total Participants
                    </button>
                    <button
                        className="nav-link"
                        id="nav-requests-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-requests"
                        type="button"
                        role="tab"
                        aria-controls="nav-requests"
                        aria-selected="false"
                    >
                        Requests
                    </button>
                    <button
                        className="nav-link"
                        id="nav-roomLinks-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-roomLinks"
                        type="button"
                        role="tab"
                        aria-controls="nav-roomLinks"
                        aria-selected="false"
                    >
                        Links
                    </button>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div
                    className="tab-pane fade show active"
                    id="nav-participants"
                    role="tabpanel"
                    aria-labelledby="nav-participants-tab"
                >
                    <div className="row">
                        {candidates &&
                            candidates.map((candidate, index) => {
                                return (
                                    candidate.username != username && (
                                        <div
                                            className="card col-sm-3"
                                            key={index}
                                        >
                                            <div className="card-body text-center">
                                                <h5 className="card-title">
                                                    {candidate.username}
                                                </h5>
                                                <p>Score : {candidate.score}</p>
                                                <button
                                                    className={
                                                        reqSent[
                                                            candidate.username
                                                        ]
                                                            ? "btn btn-success"
                                                            : "btn btn-primary"
                                                    }
                                                    onClick={() =>
                                                        HandleRequest(candidate)
                                                    }
                                                >
                                                    {reqSent[candidate.username]
                                                        ? "Sent"
                                                        : "Request"}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                );
                            })}
                    </div>
                </div>
                <div
                    className="tab-pane fade"
                    id="nav-requests"
                    role="tabpanel"
                    aria-labelledby="nav-requests-tab"
                >
                    <div className="row">
                        <p className="mt-3">
                            You can accept atmost 1 requestee to create a room
                            for dicussion
                        </p>
                        <div className="text-end px-3">
                            <button
                                className={
                                    Object.keys(reqAccepted).length != 0
                                        ? "btn btn-danger"
                                        : "btn btn-danger disabled"
                                }
                                aria-disabled={
                                    Object.keys(reqAccepted).length == 0
                                        ? "true"
                                        : "false"
                                }
                                onClick={() => HandleCreationRoom()}
                            >
                                Make a Room
                            </button>
                        </div>
                        {requestees &&
                            requestees.map((requestee, index) => {
                                return (
                                    <div className="card col-sm-3" key={index}>
                                        <div className="card-body text-center">
                                            <h5 className="card-title">
                                                {requestee.username}
                                            </h5>
                                            <p>Score : {requestee.score}</p>
                                            <button
                                                className={
                                                    reqAccepted[
                                                        requestee.username
                                                    ]
                                                        ? "btn btn-success"
                                                        : "btn btn-primary"
                                                }
                                                onClick={() =>
                                                    HandleRequestReceived(
                                                        requestee
                                                    )
                                                }
                                            >
                                                {reqAccepted[requestee.username]
                                                    ? "Added"
                                                    : "Add to cart"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>

                <div
                    className="tab-pane fade"
                    id="nav-roomLinks"
                    role="tabpanel"
                    aria-labelledby="nav-roomLinks-tab"
                >
                    <div className="row">
                        {roomLinks.map((roomLink, index) => {
                            return (
                                <div
                                    className="card col-sm-2 text-center"
                                    key={index}
                                >
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {roomLink.username}
                                        </h5>
                                        <p className="card-text">
                                            Score : {roomLink.score}
                                        </p>
                                        <button
                                            className="btn btn-success"
                                            onClick={() =>
                                                navigate(
                                                    "/event/Proom/" +
                                                        roomLink.uuid,
                                                    {
                                                        state: username,
                                                    }
                                                )
                                            }
                                        >
                                            Join Room
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
