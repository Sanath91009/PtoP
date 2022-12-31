import React, { useState } from "react";
import Navbar from "../components/navbar";
import { PorfileInfo } from "../components/profileInfo";
import { UserAvatar } from "../components/userAvatar";
import { getUser } from "../services/authService";
import { useEffect } from "react";
import { toast } from "react-toastify";
import config from "../config.json";
import { useNavigate } from "react-router-dom";
const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateString(length) {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }

    return result;
}
export const Profile = () => {
    const navigate = useNavigate();
    const [resendOtp, setResendOtp] = useState(false);

    const [username, setUsername] = useState(null);
    const [color, setColor] = useState(null);
    const [email, setEmail] = useState(null);
    const [sections, setSections] = useState(["codeforces", "codechef"]);
    const [otp, setOtp] = useState({});
    const [verified, setVerfied] = useState({});
    useEffect(() => {
        const { username, color, email } = getUser("token");
        setUsername(() => username);
        setColor(() => color);
        setEmail(email);
        if (username == null) {
            navigate("/auth");
        }
        const endpoint = config.apiUrl + `/getHandlesInfo?username=${username}`;
        fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                const handlesInfo = data.data;
                const verified_temp = { ...verified };
                for (let i = 0; i < handlesInfo.length; i++) {
                    verified_temp[handlesInfo[i].section] =
                        handlesInfo[i].handle;
                }
                setVerfied(verified_temp);
            });
    }, []);
    const [fullName, setFullName] = useState(generateString(15));
    const HandleSubmitCodechef = () => {
        const handle = document.getElementById("codechefHandle").value;
        try {
            const endpoint =
                config.apiUrl +
                `/checkUserCodeChef?handle=${handle}&fullName=${fullName}&username=${username}`;
            fetch(endpoint)
                .then((response) => response.json())
                .then((data) => {
                    if (data.code == 200) {
                        const verified_temp = { ...verified };
                        verified_temp["codechef"] = handle;
                        setVerfied(verified_temp);
                        toast.success("Authentication Succuessful");
                    } else {
                        toast.error(
                            "Please change your full name in codechef profile"
                        );
                    }
                });
        } catch (err) {
            console.log(err);
        }
    };
    const HandleSubmitCodeForces = async (
        section,
        handle,
        emailid,
        otp_val = null
    ) => {
        if (email == emailid) {
            const endpoint = config.apiUrl + "/auth/" + section;
            try {
                await fetch(endpoint, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        handle: handle,
                        emailid: email,
                        username: username,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.code == 200) {
                            const verified_temp = { ...verified };
                            verified_temp[section] = handle;
                            setVerfied(verified_temp);
                            toast.success(
                                `${section} handle authenitcation successful`
                            );
                        } else {
                            toast.error(
                                `Authentication for ${section} failed : ${data.message}`
                            );
                        }
                    });
            } catch (err) {
                toast.error(err);
            }
        } else {
            console.log("otp : ", otp[section]);
            if (otp[section] == undefined) {
                const endpoint = config.apiUrl + "/register/generateOtp";
                try {
                    await fetch(endpoint, {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            emailid: emailid,
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log("data : ", data);
                            if (data.code == 200) {
                                const otp_temp = { ...otp };
                                otp_temp[section] = true;
                                setOtp(otp_temp);
                                setResendOtp(false);
                                localStorage.setItem("otp", data.hash);
                            } else {
                                console.log(data.message);
                                toast.error(data.message);
                            }
                        });
                } catch (err) {
                    toast.error(err);
                }
            } else {
                const endpoint = config.apiUrl + "/register/verifyOtp";
                console.log("otp_val : ", otp_val);
                try {
                    await fetch(endpoint, {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: username,
                            otp: otp_val,
                            hash: localStorage.getItem("otp"),
                            addInfo: {
                                type: "authentication",
                                handle: handle,
                                section: section,
                                emailid: emailid,
                            },
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log("data1 : ", data);
                            if (data.code == 200) {
                                const verified_temp = { ...verified };
                                verified_temp[section] = handle;
                                setVerfied(verified_temp);
                                toast.success(
                                    `${section} handle authenitcation successful`
                                );
                            } else {
                                if (data.code != 410) {
                                    const otp_temp = { ...otp };
                                    delete otp_temp[section];
                                    setOtp(otp_temp);
                                }
                                toast.error(
                                    `Authentication for ${section} failed : ${data.message}`
                                );
                            }
                        });
                } catch (err) {
                    toast.error(err);
                }
            }
        }
    };
    if (username == null) return <div>Loading.....</div>;
    return (
        <div className="profile" style={{ height: "100%" }}>
            <Navbar user={username} />
            {username == null ? (
                <div>Loading</div>
            ) : (
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
                            <UserAvatar name={username} color={color} />
                        </div>
                        <p
                            style={{
                                color: color,
                                fontSize: "25px",
                                margin: "0",
                            }}
                        >
                            <b>{username}</b>
                        </p>
                        <p
                            style={{
                                color: color,
                                fontSize: "15px",
                                margin: "0",
                            }}
                        >
                            {email}
                        </p>
                    </div>
                    <div className="col-sm-7">
                        <h3>Handles Verification</h3>
                        <div id="accordion" style={{ width: "75%" }}>
                            {sections &&
                                sections.map((section, index) => {
                                    return (
                                        <div key={index}>
                                            <PorfileInfo
                                                section={section}
                                                HandleSubmit={
                                                    section == "codechef"
                                                        ? HandleSubmitCodechef
                                                        : HandleSubmitCodeForces
                                                }
                                                handle={verified[section]}
                                                otp={otp}
                                                setOtp={setOtp}
                                                fullName={fullName}
                                                resendOtp={resendOtp}
                                                setResendOtp={setResendOtp}
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
