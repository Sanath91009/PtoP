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
                    <h5 className="card-title">Competitive Programming</h5>
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
    );
};
