import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import config from "../config.json";
import { toast } from "react-toastify";
import Navbar from "../components/navbar";
import { Login, getUser } from "../services/authService";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export const Auth = () => {
    const location = useLocation();
    const { section } = location.state;
    const navigate = useNavigate();
    useEffect(() => {
        if (getUser(section) != null) {
            const { username } = getUser(section);
            navigate("/dashboard", {
                replace: true,
                state: { section: section, username: username },
            });
        }
    });
    const HandleRegister = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const email_id = e.target.emailid.value;
        const password = e.target.password.value;
        const endpoint = config.apiUrl + "/register/jee";
        try {
            await fetch(endpoint, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    email_id: email_id,
                    password: password,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("data : ", data);
                    if (data.code == 200) {
                        toast("registered");
                        Login(section, data.token.accessToken);
                        navigate("/dashboard", {
                            replace: true,
                            state: { section: section, username: username },
                        });
                    } else {
                        console.log(data.message);
                        toast(data.message);
                    }
                });
        } catch (err) {
            toast(err);
        }
    };
    const HandleLogin = async (e) => {
        e.preventDefault();
        const username = e.target.username1.value;
        const password = e.target.password1.value;
        const endpoint = config.apiUrl + "/login/jee";
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
                        Login(section, data.token.accessToken);
                        navigate("/dashboard", {
                            replace: true,
                            state: { section: section, username: username },
                        });
                    } else {
                        toast(data.message);
                        console.log(data);
                    }
                });
        } catch (err) {
            console.log(err);
            toast(err);
        }
    };
    return (
        <div>
            <Navbar user={null} />
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        <form className="px-3" onSubmit={HandleRegister}>
                            <div className="form-group mb-2">
                                <label for="username">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    aria-describedby="username"
                                    placeholder="Enter Username"
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label for="emailid">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="emailid"
                                    aria-describedby="emailid"
                                    placeholder="Enter email"
                                />
                                <small
                                    id="emailHelp"
                                    className="form-text text-muted"
                                >
                                    We'll never share your email with anyone
                                    else.
                                </small>
                            </div>
                            <div className="form-group">
                                <label for="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    aria-describedby="password"
                                    placeholder="Password"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary mt-2"
                            >
                                Register
                            </button>
                        </form>
                    </div>
                    <div className="vr" style={{ width: 1, padding: 0 }}></div>
                    <div className="col">
                        <form className="px-3" onSubmit={HandleLogin}>
                            <div className="form-group mb-2">
                                <label for="username1">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username1"
                                    aria-describedby="username1"
                                    placeholder="Enter username"
                                />
                            </div>
                            <div className="form-group">
                                <label for="password1">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password1"
                                    aria-describedby="password1"
                                    placeholder="Password"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary mt-2"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
