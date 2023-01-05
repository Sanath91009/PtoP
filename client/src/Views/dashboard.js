import React, { useEffect, useState } from "react";
import config from "../config.json";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { toast } from "react-toastify";
import Countdown from "react-countdown";
import { getUser } from "../services/authService";
function compare(a, b) {
    if (a.date < b.date) {
        return -1;
    }
    return 1;
}
export const Dashboard = (props) => {
    const [events, setEvents] = useState([]);
    const [username, setUsername] = useState(getUser("token").username);
    const navigate = useNavigate();
    var score = null;
    useEffect(() => {
        console.log("username : ", username);
        const endPoint = config["apiUrl"] + "/getEvents?username=" + username;
        fetch(endPoint, {
            headers: { authorization: localStorage.getItem("token") },
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
                        reg = true;
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
    const HandleClick = (event_cur) => {
        if (
            event_cur.showButton == "Register" ||
            event_cur.showButton == "Registered"
        ) {
            if (event_cur.date < Date.now()) {
                return;
            }
            try {
                document.querySelector(`.B${event_cur.id}`).disabled = true;
                const events_temp = [...events];
                if (event_cur.showButton !== "Registered") {
                    const endpoint = config["apiUrl"] + "/event/register";
                    fetch(endpoint, {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: username,
                            eventID: event_cur.id,
                            section: event_cur.section,
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log("response : ", data);
                            if (data.code >= 400) {
                                toast.error(data.message);
                                if (data.code == 400) {
                                    navigate("/profile");
                                }
                            } else {
                                console.log("data1: ", data);
                                if (data.code == 200) {
                                    event_cur.showButton = "Registered";
                                    event_cur.classNameButton = "btn btn-info";
                                    for (
                                        let i = 0;
                                        i < events_temp.length;
                                        i++
                                    ) {
                                        if (
                                            events_temp[i].id === event_cur.id
                                        ) {
                                            events_temp[i] = event_cur;
                                            break;
                                        }
                                    }
                                    setEvents(events_temp);
                                }
                            }
                            document.querySelector(
                                `.B${event_cur.id}`
                            ).disabled = false;
                        });
                } else {
                    const endpoint = config["apiUrl"] + "/event/deregister";
                    fetch(endpoint, {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: username,
                            eventID: event_cur.id,
                            section: event_cur.section,
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            event_cur.showButton = "Register";
                            event_cur.classNameButton = "btn btn-primary";
                            for (let i = 0; i < events_temp.length; i++) {
                                if (events_temp[i].id === event_cur.id) {
                                    events_temp[i] = event_cur;
                                    break;
                                }
                            }
                            setEvents(events_temp);
                            document.querySelector(
                                `.B${event_cur.id}`
                            ).disabled = false;
                        });
                }
            } catch (err) {
                console.log(err);
                toast(err);
            }
        } else if (event_cur.showButton == "Join") {
            navigate(`/${event_cur.id}/Groom`);
        }
    };
    const HandleCompletion = (eventID) => {
        const events_temp = [...events];
        for (let i = 0; i < events_temp.length; i++) {
            if (events_temp[i].id === eventID) {
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
            <Navbar user={username} />
            <div className="dashboard p-3">
                <h3>Welcome {username} </h3>
                <div className="d-flex flex-row row">
                    {events.length > 0 &&
                        events.map((event, index) => {
                            return (
                                event.showButton != "Completed" && (
                                    <div
                                        className="card m-2"
                                        style={{
                                            width: "240px",
                                            height: "240px",
                                        }}
                                        key={index}
                                    >
                                        <div className="card-body text-center my-auto">
                                            <img
                                                src={require("../images/codeforces.jpeg")}
                                                width={"200px"}
                                                height="100px"
                                            ></img>
                                            <h5 className="card-title">
                                                {event.name}
                                            </h5>
                                            <Countdown
                                                date={event.date}
                                                intervalDelay={0}
                                                precision={3}
                                                onComplete={() =>
                                                    HandleCompletion(event.id)
                                                }
                                            />
                                            <br></br>
                                            <button
                                                onClick={() =>
                                                    HandleClick(event)
                                                }
                                                className={`${event.classNameButton} B${event.id}`}
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
