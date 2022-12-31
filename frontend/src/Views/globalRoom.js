import React from "react";
import io from "socket.io-client";
import config from "../config.json";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/navbar";
import { getUser } from "../services/authService";
import { DisplayCard } from "../components/displayCards";
import { DisplayRooms } from "./displayRooms";
import { Filter } from "../components/filter";
import { HandleForm } from "../components/handleForm";
const socket = io.connect(config.apiUrl);
function compare(a, b) {
    if (a.timestamp < b.timestamp) {
        return -1;
    }
    return 1;
}
export const GlobalRoom = () => {
    const { eventID } = useParams();

    const [requestees, setRequestees] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [reqSent, setReqSent] = useState({});
    const [reqAccepted, setReqAccepted] = useState({});
    const [rooms, setRooms] = useState([]);
    const [newRequests, setNewRequests] = useState(0);
    const [newLinks, setNewLinks] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [randomClass, setRandomClass] = useState("btn btn-dark");
    const [candidatesFiltered, setCandidatesFiltered] = useState([]);
    const [requesteesFiltered, setRequesteesFiltered] = useState([]);
    const [roomsFiltered, setRoomsFiltered] = useState([]);
    const navigate = useNavigate();
    const [username, setUsername] = useState(getUser("token").username);
    const [myInfo, setMyInfo] = useState({});
    useEffect(() => {
        const endpoint =
            config.apiUrl + `/event/getCandidates?eventID=${eventID}`;
        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                console.log("data : ", data);
                // sort with rating
                setCandidates(data.message);
                setCandidatesFiltered(data.message);
            });
        const endpoint1 =
            config.apiUrl +
            `/event/getCandidateInfo?eventID=${eventID}&username=${username}`;
        fetch(endpoint1)
            .then((response) => response.json())
            .then((data) => {
                const reqSent_temp = {};
                const info = data.message[0];
                const { requests, handle, solved, rating } = info;
                if (info.requestsSent) {
                    for (let i = 0; i < info.requestsSent.length; i++) {
                        let k = info.requestsSent[i].handle;
                        reqSent_temp[k] = 1;
                    }
                }
                console.log(requests);
                setReqSent(reqSent_temp);
                setRequestees(requests);
                setRequesteesFiltered(requests);
                setMyInfo({ handle: handle, solved: solved, rating: rating });
                console.log("data: ", data);
                socket.emit("join_room", { room: handle });
                const endpoint3 =
                    config.apiUrl +
                    `/room/getRoomLinks?eventID=${eventID}&handle=${handle}`;
                fetch(endpoint3)
                    .then((response) => response.json())
                    .then((data) => {
                        setRooms(data.data);
                        setRoomsFiltered(data.data);
                    });
            });
        const endpoint2 =
            config.apiUrl + "/event/getQuestions?eventID=" + eventID;
        fetch(endpoint2)
            .then((response) => response.json())
            .then((data) => {
                const { questions } = data.data;
                setQuestions(questions);
            })
            .catch((err) => {
                toast.error(err);
            });
    }, []);
    const FilterCard = (c, rating_from, rating_to, handle_filter, solved) => {
        console.log("c : ", c);
        const temp = isSubset(solved, c.solved);
        return (
            c.handle.startsWith(handle_filter) &&
            c.rating >= rating_from &&
            c.rating <= rating_to &&
            temp
        );
    };
    const checkData = (data) => {
        const handle_filter = document.querySelector("#handle").value;
        let rating_from = document.querySelector("#from").value;
        let rating_to = document.querySelector("#to").value;
        if (!rating_from) rating_from = 0;
        if (!rating_to) rating_to = 4000;
        let solved = [];
        questions.map((q) => {
            const temp = document.querySelector(`#${q.code}`).checked;
            if (temp) {
                solved.push(q.code);
            }
        });
        return FilterCard(data, rating_from, rating_to, handle_filter, solved);
    };
    const checkDataForRoom = (c) => {
        const handle_filter = document.querySelector("#handle").value;
        let rating_from = document.querySelector("#from").value;
        let rating_to = document.querySelector("#to").value;
        if (!rating_from) rating_from = 0;
        if (!rating_to) rating_to = 4000;
        let solved = [];
        questions.map((q) => {
            const temp = document.querySelector(`#${q.code}`).checked;
            if (temp) {
                solved.push(q.code);
            }
        });
        const temp = c.roomMembers;
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].handle != myInfo.handle) {
                if (
                    FilterCard(
                        temp[i],
                        rating_from,
                        rating_to,
                        handle_filter,
                        solved
                    )
                ) {
                    return true;
                }
            }
        }
        return false;
    };
    useEffect(() => {
        socket.on("receive_message", (data) => {
            const requestees_temp = [...requestees];
            requestees_temp.push(data);
            console.log(requestees_temp);
            setRequestees(requestees_temp);
            setNewRequests((newRequests) => newRequests + 1);
            if (checkData(data))
                setRequesteesFiltered((prev) => [...prev, data]);
        });
        socket.on("createdRoom", (data) => {
            console.log("room created... : ", data, data.random);
            const rooms_temp = [...rooms];
            rooms_temp.push(data);
            rooms_temp.sort(compare);
            if (data.random == true) {
                console.log("setting");
                setRandomClass(() => "btn btn-dark");
            }
            setRooms(rooms_temp);
            setNewLinks((prev) => prev + 1);
            if (checkDataForRoom(data))
                setRoomsFiltered((prev) => [...prev, data]);
        });
    }, [socket]);
    function isSubset(filtered, cand) {
        const result = filtered.every((val) => cand.includes(val));
        console.log("filtered : ", filtered, cand);
        return result;
    }
    const HandleFilterClickReq = (e) => {
        e.preventDefault();
        let handle_filter = e.target.handle.value;
        let rating_from = e.target.from.value ? e.target.from.value : 0;
        let rating_to = e.target.to.value ? e.target.to.value : 4000;
        if (rating_to < rating_from) rating_to = rating_from;
        let solved = [];
        questions.map((q) => {
            const temp = e.target[q.code].checked;
            if (temp == true) {
                solved.push(q.code);
            }
        });

        let requesteesFiltered_temp = [...requestees];
        requesteesFiltered_temp = requesteesFiltered_temp.filter((c) => {
            return FilterCard(c, rating_from, rating_to, handle_filter, solved);
        });
        setRequesteesFiltered(requesteesFiltered_temp);
    };
    const HandleFilterClickRooms = (e) => {
        e.preventDefault();
        let handle_filter = e.target.handle.value;
        let rating_from = e.target.from.value ? e.target.from.value : 0;
        let rating_to = e.target.to.value ? e.target.to.value : 4000;
        if (rating_to < rating_from) rating_to = rating_from;
        let solved = [];
        questions.map((q) => {
            const temp = e.target[q.code].checked;
            if (temp == true) {
                solved.push(q.code);
            }
        });

        let roomsFiltered_temp = [...rooms];
        roomsFiltered_temp = roomsFiltered_temp.filter((c) => {
            const temp = c.roomMembers;
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].handle != myInfo.handle) {
                    if (
                        FilterCard(
                            temp[i],
                            rating_from,
                            rating_to,
                            handle_filter,
                            solved
                        )
                    ) {
                        return true;
                    }
                }
            }
            return false;
        });
        setRoomsFiltered(roomsFiltered_temp);
    };
    const HandleFilterClickCandidates = (e) => {
        e.preventDefault();
        let handle_filter = e.target.handle.value;
        let rating_from = e.target.from.value ? e.target.from.value : 0;
        let rating_to = e.target.to.value ? e.target.to.value : 4000;
        if (rating_to < rating_from) rating_to = rating_from;
        let solved = [];
        questions.map((q) => {
            const temp = e.target[q.code].checked;
            if (temp == true) {
                solved.push(q.code);
            }
        });
        let candidatesFiltered_temp = [...candidates];
        candidatesFiltered_temp = candidatesFiltered_temp.filter((c) => {
            return FilterCard(c, rating_from, rating_to, handle_filter, solved);
        });
        setCandidatesFiltered(candidatesFiltered_temp);
    };
    const HandleRequest = (candidate) => {
        console.log("myInfo : ", myInfo, candidate);
        if (
            reqSent[candidate.handle] === undefined ||
            reqSent[candidate.handle] === null
        ) {
            socket.emit("send_message", {
                eventID: eventID,
                handle: myInfo.handle,
                solved: myInfo.solved,
                rating: myInfo.rating,
                room: candidate.handle,
                room_solved: candidate.solved,
                room_rating: candidate.rating,
            });
            const reqSent_temp = { ...reqSent };
            reqSent_temp[candidate.handle] = 1;
            setReqSent(reqSent_temp);
        }
    };
    const HandleRequestReceived = (candidate) => {
        const reqAccepted_temp = { ...reqAccepted };
        if (
            reqAccepted_temp[candidate.handle] === undefined ||
            reqAccepted_temp[candidate.handle] === null
        ) {
            const len = Object.keys(reqAccepted_temp).length;
            if (len == 3) {
                toast("You can select at most 3");
                return;
            }
            reqAccepted_temp[candidate.handle] = {
                solved: candidate.solved,
                rating: candidate.rating,
            };
        } else {
            delete reqAccepted_temp[candidate.handle];
        }
        setReqAccepted(reqAccepted_temp);
    };
    const HandleCreationRoom = () => {
        console.log("sending creating room");
        const timestamp = Date.now();
        socket.emit("CreateRoom", {
            eventID: eventID,
            requestTo: reqAccepted,
            handle: myInfo.handle,
            solved: myInfo.solved,
            rating: myInfo.rating,
            timestamp: timestamp,
        });
    };
    const HandleRandomPairing = () => {
        socket.emit("join room", myInfo.handle);
        setRandomClass("btn btn-success");
        socket.emit("random_pairing", {
            eventID: eventID,
            handle: myInfo.handle,
            solved: myInfo.solved,
            rating: myInfo.rating,
        });
    };
    const currentTab = localStorage.getItem("currentTab");
    return (
        <div>
            <Navbar user={myInfo.handle} />
            <div className="random text-center">
                <button
                    className={randomClass}
                    onClick={() => HandleRandomPairing()}
                >
                    Start Random Pairing
                </button>
            </div>
            <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button
                        className={
                            "nav-link " +
                            (!localStorage.getItem("currentTab") ||
                            localStorage.getItem("currentTab") == "participants"
                                ? "active"
                                : "")
                        }
                        id="nav-participants-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-participants"
                        type="button"
                        role="tab"
                        aria-controls="nav-participants"
                        aria-selected="true"
                        onClick={() =>
                            localStorage.setItem("currentTab", "participants")
                        }
                    >
                        Total Participants
                    </button>
                    <button
                        className={
                            "nav-link " +
                            (localStorage.getItem("currentTab") == "requestees"
                                ? "active"
                                : "")
                        }
                        id="nav-requests-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-requests"
                        type="button"
                        role="tab"
                        aria-controls="nav-requests"
                        aria-selected="false"
                        onClick={() => {
                            localStorage.setItem("currentTab", "requestees");
                            setNewRequests(0);
                        }}
                    >
                        Requests
                        {newRequests > 0 && (
                            <span className="ms-2 badge bg-danger rounded-5">
                                {newRequests}
                            </span>
                        )}
                    </button>
                    <button
                        className={
                            "nav-link " +
                            (localStorage.getItem("currentTab") == "rooms"
                                ? "active"
                                : "")
                        }
                        id="nav-roomLinks-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-roomLinks"
                        type="button"
                        role="tab"
                        aria-controls="nav-roomLinks"
                        aria-selected="false"
                        onClick={() => {
                            localStorage.setItem("currentTab", "rooms");
                            setNewLinks(0);
                        }}
                    >
                        Links
                        {newLinks > 0 && (
                            <span className="ms-2 badge bg-danger rounded-5">
                                {newLinks}
                            </span>
                        )}
                    </button>
                </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
                <div
                    className={
                        "tab-pane fade px-4 py-2 " +
                        (!localStorage.getItem("currentTab") ||
                        localStorage.getItem("currentTab") == "participants"
                            ? "active show"
                            : "")
                    }
                    id="nav-participants"
                    role="tabpanel"
                    aria-labelledby="nav-participants-tab"
                >
                    <div className="row">
                        <div className="col-sm-10">
                            {candidatesFiltered.length > 0 && (
                                <DisplayCard
                                    HandleClick={HandleRequest}
                                    myInfo={myInfo}
                                    candidates={candidatesFiltered}
                                    reqDict={reqSent}
                                    label="request"
                                    label1="sent"
                                    name="participants"
                                />
                            )}
                        </div>
                        <div className="col-sm-2">
                            <Filter
                                HandleFilterClick={HandleFilterClickCandidates}
                                questions={questions}
                                label="Cand"
                                HandleFilter={() =>
                                    setCandidatesFiltered(candidates)
                                }
                            />
                        </div>
                    </div>
                </div>
                <div
                    className={
                        "tab-pane fade px-4 py-2 " +
                        (localStorage.getItem("currentTab") == "requestees"
                            ? "active show"
                            : "")
                    }
                    id="nav-requests"
                    role="tabpanel"
                    aria-labelledby="nav-requests-tab"
                >
                    <div className="row">
                        <p className="my-1 col-sm-10">
                            You can accept atmost 3 requestees to create a room
                            for dicussion
                        </p>
                        <div className="text-end col-sm-2">
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
                    </div>
                    <div className="row">
                        <div className="col-sm-10">
                            {requesteesFiltered.length > 0 && (
                                <DisplayCard
                                    HandleClick={HandleRequestReceived}
                                    myInfo={myInfo}
                                    candidates={requesteesFiltered}
                                    reqDict={reqAccepted}
                                    label="Accept"
                                    label1="Added to cart"
                                    name="requestees"
                                />
                            )}
                        </div>
                        <div className="col-sm-2">
                            <Filter
                                HandleFilterClick={HandleFilterClickReq}
                                questions={questions}
                                label="Req"
                                HandleFilter={() =>
                                    setRequesteesFiltered(requestees)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div
                    className={
                        "tab-pane fade px-4 py-2 " +
                        (localStorage.getItem("currentTab") == "rooms"
                            ? "active show"
                            : "")
                    }
                    id="nav-roomLinks"
                    role="tabpanel"
                    aria-labelledby="nav-roomLinks-tab"
                >
                    <div className="row">
                        <div className="col-sm-10">
                            {roomsFiltered.length > 0 && (
                                <DisplayRooms
                                    eventID={eventID}
                                    rooms={roomsFiltered}
                                    myInfo={myInfo}
                                />
                            )}
                        </div>
                        <div className="col-sm-2">
                            <Filter
                                HandleFilterClick={HandleFilterClickRooms}
                                questions={questions}
                                label="links"
                                HandleFilter={() => setRoomsFiltered(rooms)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
