import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import React from "react";
import { NavLink } from "react-router-dom";
export const Section = () => {
    return (
        <div className="row">
            <div className="card col-sm-3">
                <div className="card-body text-center">
                    <img
                        width="200rem"
                        src={require("../images/codeforces.jpeg")}
                    ></img>
                    <h5 className="card-title">Codeforces</h5>
                    <NavLink
                        to="/cpauth"
                        state={{ section: "codeforces" }}
                        className="btn btn-primary"
                    >
                        Join
                    </NavLink>
                </div>
            </div>
            <div className="card col-sm-3">
                <div className="card-body text-center">
                    <img
                        width="250rem"
                        src={require("../images/codechef.png")}
                        style={{ paddingBottom: 10 }}
                    ></img>
                    <h5 className="card-title">Codechef</h5>

                    <NavLink
                        to="/cpauth"
                        state={{ section: "codechef" }}
                        className="btn btn-primary"
                    >
                        Join
                    </NavLink>
                </div>
            </div>
            <div className="card col-sm-3">
                <div className="card-body text-center">
                    <img
                        width="160rem"
                        style={{ paddingBottom: 2 }}
                        src={require("../images/JEE.jpeg")}
                    ></img>
                    <h5 className="card-title">JEE</h5>

                    <NavLink
                        to="/auth"
                        state={{ section: "JEE" }}
                        className="btn btn-primary"
                    >
                        Join
                    </NavLink>
                </div>
            </div>
            <div className="card col-sm-3">
                <div className="card-body text-center">
                    <img
                        width="200rem"
                        src={require("../images/cat.png")}
                        style={{ paddingBottom: 10 }}
                    ></img>
                    <h5 className="card-title">CAT</h5>

                    <NavLink
                        to="/auth"
                        state={{ section: "CAT" }}
                        className="btn btn-primary"
                    >
                        Join
                    </NavLink>
                </div>
            </div>
        </div>
    );
};
