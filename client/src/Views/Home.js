import React from "react";
import Navbar from "../components/navbar";
import { NavLink } from "react-router-dom";
export const Home = () => {
    return (
        <div className="home">
            <Navbar user={null} />
            <div className="text-center d-flex flex-column justify-content-center">
                <div className="align-middle">
                    <div
                        className="card"
                        style={{ width: "300px", margin: "0 auto" }}
                    >
                        <div className="card-body text-center">
                            <img
                                width="200px"
                                height={"200px"}
                                src={require("../images/cp.png")}
                            ></img>
                            <h5 className="card-title">
                                Competitive Programming
                            </h5>
                            <NavLink
                                to="/auth"
                                state={{ section: "codeforces" }}
                                className="btn btn-primary"
                            >
                                Join
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <h3>#letsgrowtogether</h3>
                </div>
            </div>
        </div>
    );
};
