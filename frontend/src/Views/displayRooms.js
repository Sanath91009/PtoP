import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
export const DisplayRooms = ({ rooms, myInfo, eventID }) => {
    const navigate = useNavigate();
    const [itemsSize, setItemsSize] = useState(20);
    const scrollRef = useRef();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (
            scrollRef.current.scrollTop + scrollRef.current.clientHeight >=
                scrollRef.current.scrollHeight &&
            itemsSize < rooms.length
        ) {
            loadMore();
        }
    });
    const loadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setItemsSize((prev) => prev + 20);
            setLoading(false);
        }, 2000);
    };
    const showItems = () => {
        var items = [];
        let i = 0;
        while (i < rooms.length && i < itemsSize) {
            const room = rooms[i];
            items.push(
                <div
                    className="card text-center m-2"
                    key={i}
                    style={{
                        width: "190px",
                        height: "240px",
                    }}
                >
                    <div className="card-body text-center">
                        <small>Initiated by</small>
                        <h5
                            className="card-title m-0"
                            style={{
                                fontSize: "17px",
                            }}
                        >
                            {room.initiated}
                        </h5>
                        {room.random != true &&
                            room.roomMembers.map((m, index) => {
                                if (m.handle == room.initiated) {
                                    return (
                                        <p
                                            key={index}
                                            className="m-0"
                                            style={{
                                                fontSize: "13px",
                                            }}
                                        >
                                            solved :{m.solved.toString()}
                                            <br />
                                            rating: {m.rating}
                                        </p>
                                    );
                                }
                            })}
                        <small className="m-0">Room Members : </small>
                        {room.roomMembers.map((m, index) => {
                            if (m.handle != room.initiated) {
                                return (
                                    <p key={index} className="m-0">
                                        {m.handle}
                                    </p>
                                );
                            }
                        })}
                        <button
                            className="btn btn-success"
                            onClick={() =>
                                navigate(`/${eventID}/Proom/${room.uuid}`)
                            }
                            style={{
                                marginTop: "10px",
                            }}
                        >
                            Join Room
                        </button>
                    </div>
                </div>
            );
            i++;
        }
        return items;
    };
    return (
        <div
            style={{ overflow: "auto" }}
            ref={scrollRef}
            className="row d-flex flex-row"
        >
            {showItems()}
            {loading ? <p className="loading dark">loading ...</p> : ""}
        </div>
    );
};
