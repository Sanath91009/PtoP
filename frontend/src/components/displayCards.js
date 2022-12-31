import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

export const DisplayCard = ({
    candidates,
    myInfo,
    HandleClick,
    reqDict,
    label,
    label1,
}) => {
    const [itemsSize, setItemsSize] = useState(20);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef();
    useEffect(() => {
        if (
            scrollRef.current.scrollTop + scrollRef.current.clientHeight >=
                scrollRef.current.scrollHeight &&
            itemsSize < candidates.length
        ) {
            loadMore();
        }
    });
    const showItems = () => {
        var items = [];
        let i = 0,
            j = 0;
        while (j < itemsSize && i < candidates.length) {
            const candidate = candidates[i];
            if (candidate.handle != myInfo.handle) {
                items.push(
                    <div
                        className="card m-2"
                        style={{
                            width: "190px",
                            height: "165px",
                        }}
                        key={i}
                    >
                        <div className="card-body text-center">
                            <h5
                                className="card-title"
                                style={{ fontSize: "17px" }}
                            >
                                {candidate.handle}
                            </h5>
                            <p className="m-0" style={{ fontSize: "13px" }}>
                                {candidate.solved
                                    ? `Solved :${candidate.solved.toString()}`
                                    : ""}
                            </p>
                            <p style={{ fontSize: "13px" }}>
                                {candidate.rating
                                    ? `rating : ${candidate.rating}`
                                    : ""}
                            </p>
                            <button
                                className={
                                    reqDict[candidate.handle]
                                        ? "btn btn-success"
                                        : "btn btn-primary"
                                }
                                onClick={() => HandleClick(candidate)}
                            >
                                {reqDict[candidate.handle] ? label1 : label}
                            </button>
                        </div>
                    </div>
                );
                j++;
            }
            i++;
        }
        return items;
    };
    const loadMore = () => {
        setLoading(true);
        setTimeout(() => {
            setItemsSize((prev) => prev + 5);
            setLoading(false);
        }, 2000);
    };
    console.log("display candidates");
    return (
        <div
            style={{ overflow: "auto" }}
            ref={scrollRef}
            className="row d-flex flex-row"
        >
            {showItems()}
            {loading ? <p className="loading">loading ...</p> : ""}
        </div>
    );
};
