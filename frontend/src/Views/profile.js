import React, { useState } from "react";
import Navbar from "../components/navbar";
import { PorfileInfo } from "../components/profileInfo";
import { UserAvatar } from "../components/userAvatar";
import { getUser } from "../services/authService";
function randomColor() {
    let hex = Math.floor(Math.random() * 0xffffff);
    let color = "#" + hex.toString(16);
    if (color == "#FFFFFF") return randomColor();
    return color;
}
export const Profile = () => {
    // const [username, setUsername] = useState(getUser("token"));
    const [username, setUsername] = useState("sanath");
    const [sections, setSections] = useState([
        "codeforces",
        "codechef",
        "atcoder",
        "leetcode",
    ]);

    const c = randomColor();
    return (
        <div style={{ height: "100%" }}>
            <Navbar user={username} />
            <div className="row" style={{ height: "100%" }}>
                <div
                    className="col-sm-5 align-middle"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        verticalAlign: "middle",
                    }}
                >
                    <div
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "30",
                            borderCollapse: "separate",
                            overflow: "hidden",
                        }}
                        className="rounded-circle"
                    >
                        <UserAvatar name={username} color={c} />
                    </div>
                    <p style={{ color: c, fontSize: "25px", margin: "0" }}>
                        <b>{username}</b>
                    </p>
                    <p>{"sanath303@gmail.com"}</p>
                </div>
                <div className="col-sm-7">
                    <h3>Handles Verification</h3>
                    <div id="accordion">
                        {sections &&
                            sections.map((section) => {
                                return <PorfileInfo section={section} />;
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};
