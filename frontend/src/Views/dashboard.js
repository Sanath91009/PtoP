import React, { useEffect, useState } from "react";
import config from "../config.json";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { toast } from "react-toastify";
import Countdown from "react-countdown";
function compare(a, b) {
    if (a.date < b.date) {
        return -1;
    }
    return 1;
}
export const Dashboard = (props) => {
    const [events, setEvents] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const { section, username } = location.state;
    var score = null;
    const endPoint = config["apiUrl"] + "/events/getEvents";
    useEffect(() => {
        fetch(endPoint, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                section: section,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                const events = data.data;
                events.sort(compare);

                for (let i = 0; i < events.length; i++) {
                    let reg = false;

                    if (
                        events[i].candidatesInfo &&
                        events[i].candidatesInfo.length
                    ) {
                        for (
                            let j = 0;
                            j < events[i].candidatesInfo.length;
                            j++
                        ) {
                            if (
                                events[i].candidatesInfo[j].username ===
                                username
                            ) {
                                reg = true;
                            }
                        }
                    }
                    if (events[i].date + config.duration < Date.now()) {
                        events[i].showButton = "Completed";
                    } else if (events[i].date > Date.now()) {
                        if (reg == false) {
                            events[i].showButton = "Register";
                            events[i].classNameButton = "btn btn-primary";
                        } else {
                            events[i].showButton = "Registered";
                            events[i].classNameButton = "btn btn-info";
                        }
                    } else {
                        if (reg == false) {
                            events[i].showButton = "Event Started";
                            events[i].classNameButton = "btn btn-secondary";
                        } else {
                            events[i].showButton = "Join";
                            events[i].classNameButton = "btn btn-success";
                        }
                    }
                }
                setEvents(events);
            });
    }, []);
    const HandleClick = (eventID) => {
        var event_cur = null;
        console.log("eventID : ", eventID);
        for (let i = 0; i < events.length; i++) {
            if (events[i]._id === eventID) {
                event_cur = events[i];
                break;
            }
        }
        if (
            event_cur.showButton == "Register" ||
            event_cur.showButton == "Registered"
        ) {
            if (event_cur.date <= Date.now()) {
                return;
            }
            if (
                event_cur.type == "discussion" &&
                event_cur.dependent !== undefined &&
                event_cur.dependent !== null
            ) {
                var cur_dep = event_cur.dependent;
                if (cur_dep == "codeforces") {
                } else if (cur_dep == "codechef") {
                } else {
                    const endpoint = config["apiUrl"] + "/events/getScore";
                    fetch(endpoint, {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: username,
                            eventID: eventID,
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.message == null) {
                                toast(
                                    "this is disucssion event (only for those who attended corresponding exam event)"
                                );
                                return;
                            } else {
                                score = data.message;
                            }
                        });
                }
            }
            try {
                const events_temp = [...events];
                if (event_cur.showButton !== "Registered") {
                    const endpoint = config["apiUrl"] + "/events/register";
                    fetch(endpoint, {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: username,
                            eventID: eventID,
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            event_cur.showButton = "Registered";
                            event_cur.classNameButton = "btn btn-info";
                            for (let i = 0; i < events_temp.length; i++) {
                                if (events_temp[i]._id === event_cur._id) {
                                    events_temp[i] = event_cur;
                                    break;
                                }
                            }
                            setEvents(events_temp);
                        });
                } else {
                    const endpoint = config["apiUrl"] + "/events/deregister";
                    fetch(endpoint, {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: username,
                            eventID: eventID,
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            event_cur.showButton = "Register";
                            event_cur.classNameButton = "btn btn-primary";
                            for (let i = 0; i < events_temp.length; i++) {
                                if (events_temp[i]._id === event_cur._id) {
                                    events_temp[i] = event_cur;
                                    break;
                                }
                            }
                            setEvents(events_temp);
                        });
                }
            } catch (err) {
                console.log(err);
                toast(err);
            }
        } else if (event_cur.showButton == "Join") {
            if (event_cur.type == "exam") {
                navigate("/event/exam", {
                    state: {
                        eventID: eventID,
                        username: username,
                        section: section,
                        score: score,
                    },
                });
            } else {
                navigate("/event/Groom", {
                    state: {
                        eventID: eventID,
                        username: username,
                        section: section,
                        score: score,
                    },
                });
            }
        }
    };
    const HandleCompletion = (eventID) => {
        const events_temp = [...events];
        for (let i = 0; i < events_temp.length; i++) {
            if (events_temp[i]._id === eventID) {
                if (
                    events_temp[i].showButton == "Register" ||
                    events_temp[i].showButton == "Event Started"
                ) {
                    events_temp[i].showButton = "Event Started";
                    events_temp[i].classNameButton = "btn btn-secondary";
                } else {
                    events_temp[i].showButton = "Join";
                    events_temp[i].classNameButton = "btn btn-success";
                }
                setEvents(events_temp);
                break;
            }
        }
    };
    return (
        <div>
            <Navbar user={username} section={section} />
            <div className="p-3">
                <h1>{section}</h1>
                <h3>Welcome {username} </h3>
                <p>
                    By entering into lobby you will be registetred for
                    discussion, you can wait to enter into discussion platform
                    or you can check your mail inbox for the invitation link to
                    meet your peer
                </p>
                <div className="row">
                    {events &&
                        events.map((event, index) => {
                            return (
                                event.showButton != "Completed" && (
                                    <div className="card col-sm-3" key={index}>
                                        <div className="card-body text-center">
                                            <h5 className="card-title">
                                                {event.name}
                                            </h5>
                                            <Countdown
                                                date={event.date}
                                                intervalDelay={0}
                                                precision={3}
                                                onComplete={() =>
                                                    HandleCompletion(event._id)
                                                }
                                            />
                                            <br></br>
                                            <button
                                                onClick={() =>
                                                    HandleClick(event._id)
                                                }
                                                className={
                                                    event.classNameButton
                                                }
                                            >
                                                {event.showButton}
                                            </button>
                                        </div>
                                    </div>
                                )
                            );
                        })}
                </div>
            </div>
        </div>
    );
};
