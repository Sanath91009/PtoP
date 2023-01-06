import React from "react";
import { useNavigate } from "react-router-dom";
import config from "../config.json";
import { toast } from "react-toastify";
import Navbar from "../components/navbar";
import { Login, getUser } from "../services/authService";
import { useEffect, useState } from "react";
import Joi from "joi-browser";
import Countdown from "react-countdown";

export const Auth = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(false);
    const [error, setError] = useState({});
    const [resendOtp, setResendOtp] = useState(false);
    const schema = {
        emailid: Joi.string().required().email().label("emailid"),
        password: Joi.string().required().min(5).label("password"),
        username: Joi.string().required().min(5).label("username"),
    };
    useEffect(() => {
        if (getUser("token") != null) {
            const { username } = getUser("token");
            navigate("/dashboard", {
                replace: true,
                state: { username: username },
            });
        }
    });
    const validate = (e) => {
        const emailid = e.target.emailid.value;
        const username = e.target.username.value;
        const password = e.target.password.value;
        const fields = {
            emailid: emailid,
            password: password,
            username: username,
        };
        const results = Joi.validate(fields, schema, {
            abortEarly: false,
        });
        if (!results.error) return null;
        const error = {};
        for (let item of results.error.details) {
            error[item.path[0]] = item.message;
        }
        console.log("error : ", error);
        return error;
        return null;
    };
    const validateProperty = (e) => {
        const { id: name, value } = e.currentTarget;
        const obj = {
            [name]: value,
        };
        const subschema = { [name]: schema[name] };
        const { error } = Joi.validate(obj, subschema, { abortEarly: false });
        return error ? error.details[0].message : null;
    };
    const HandleChange = (e) => {
        setOtp(false);
        const { id: label } = e.currentTarget;
        const res = validateProperty(e);
        const error_temp = { ...error };
        if (res == null) {
            delete error_temp[label];
        } else {
            error_temp[label] = res;
        }
        setError(error_temp);
    };
    const HandleResend = async () => {
        const username = document.querySelector("#username").value;
        const endpoint = config.apiUrl + "/register/generateOtp";
        try {
            await fetch(endpoint, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    emailid: document.querySelector("#emailid").value,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("data : ", data);
                    if (data.code == 200) {
                        toast.success("otp sent to your mail");
                        localStorage.setItem("otp", data.hash);
                        setResendOtp(false);
                    } else {
                        console.log(data.message);
                        toast.error(data.message);
                    }
                });
        } catch (err) {
            toast.error(err);
        }
    };
    const HandleRegister = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        if (otp == false) {
            const error = validate(e);
            if (error == null) {
                setError({});
            } else {
                setError(error);
                return;
            }
            const endpoint = config.apiUrl + "/register/generateOtp";
            try {
                await fetch(endpoint, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        emailid: e.target.emailid.value,
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("data : ", data);
                        if (data.code == 200) {
                            setOtp(() => true);
                            console.log("otp hash : ", data.hash);
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
            const email_id = e.target.emailid.value;
            const password = e.target.password.value;
            const otp = e.target.otp.value;
            const endpoint = config.apiUrl + "/register/verifyOtp";
            try {
                await fetch(endpoint, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        otp: otp,
                        hash: localStorage.getItem("otp"),
                        addInfo: {
                            type: "registration",
                            pwd: password,
                            emailid: email_id,
                        },
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("data1 : ", data);
                        if (data.code == 200) {
                            toast("registered");
                            localStorage.removeItem("otp");
                            Login("token", data.token.accessToken);
                            navigate("/profile", {
                                replace: true,
                            });
                        }
                    });
            } catch (err) {
                toast.error(err);
            }
        }
    };
    const HandleLogin = async (e) => {
        e.preventDefault();

        const username = e.target.username1.value;
        const password = e.target.password1.value;
        const endpoint = config.apiUrl + "/login";
        try {
            await fetch(endpoint, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.code == 200) {
                        toast("login successfull");
                        Login("token", data.token.accessToken);
                        navigate("/dashboard", {
                            replace: true,
                        });
                    } else {
                        if (data.code != 410) {
                            setOtp(false);
                        }
                        toast(data.message);
                        console.log(data);
                    }
                });
        } catch (err) {
            console.log(err);
            toast(err);
        }
    };
    const renderer = ({ seconds, completed }) => {
        if (completed) {
        } else {
            return <span>{seconds}</span>;
        }
    };
    return (
        <div>
            <Navbar user={null} />
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        <form className="px-3" onSubmit={HandleRegister}>
                            <div className="text-center">
                                <h2>SignUp</h2>
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    aria-describedby="username"
                                    placeholder="Enter Username"
                                    onChange={(e) => HandleChange(e)}
                                />
                            </div>
                            {error["username"] && (
                                <div className="alert alert-danger">
                                    {error["username"]}
                                </div>
                            )}
                            <div className="form-group mb-2">
                                <label htmlFor="emailid">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="emailid"
                                    aria-describedby="emailid"
                                    placeholder="Enter email"
                                    onChange={(e) => HandleChange(e)}
                                />
                                <small
                                    id="emailHelp"
                                    className="form-text text-muted"
                                >
                                    We'll never share your email with anyone
                                    else.
                                </small>
                            </div>
                            {error["emailid"] && (
                                <div className="alert alert-danger">
                                    {error["emailid"]}
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    aria-describedby="password"
                                    placeholder="Password"
                                    onChange={(e) => HandleChange(e)}
                                />
                            </div>
                            {error["password"] && (
                                <div className="alert alert-danger">
                                    {error["password"]}
                                </div>
                            )}
                            {otp == true && (
                                <div className="form-group mb-2">
                                    <label htmlFor="otp">otp</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="otp"
                                        aria-describedby="otp"
                                        placeholder="Enter otp"
                                    />
                                    {resendOtp == false ? (
                                        <span>
                                            Resend otp in{" "}
                                            <Countdown
                                                date={Date.now() + 5000}
                                                intervalDelay={0}
                                                precision={3}
                                                renderer={renderer}
                                                onComplete={() =>
                                                    setResendOtp(true)
                                                }
                                            />{" "}
                                            seconds
                                        </span>
                                    ) : (
                                        <a
                                            onClick={HandleResend}
                                            style={{
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                            }}
                                        >
                                            Resend Otp
                                        </a>
                                    )}
                                </div>
                            )}
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn btn-primary mt-2"
                                >
                                    {otp && otp == false ? "Register" : "Enter"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="vr" style={{ width: 1, padding: 0 }}></div>
                    <div className="col">
                        <form className="px-3" onSubmit={HandleLogin}>
                            <div className="text-center">
                                <h2>Login</h2>
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor="username1">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username1"
                                    aria-describedby="username1"
                                    placeholder="Enter username"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password1">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password1"
                                    aria-describedby="password1"
                                    placeholder="Password"
                                />
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="btn btn-primary mt-2"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
