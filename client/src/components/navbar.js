import React from "react";
import { Link, NavLink } from "react-router-dom";
import { About } from "./about";
import DarkMode from "./darkMode";
const Navbar = (props) => {
    return (
        <nav className="navbar navbar-expand-lg mb-1">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    P2P
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink
                                className="nav-link active"
                                aria-current="page"
                                to="/about"
                                style={{ marginRight: "5px" }}
                            >
                                About
                            </NavLink>
                        </li>
                        <li
                            className="nav-item"
                            style={{ marginTop: "8px", marginRight: "5px" }}
                        >
                            <DarkMode />
                        </li>
                        {props.user != null && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link active"
                                    aria-current="page"
                                    to="/dashboard"
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                        )}
                        {props.user != null && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link active"
                                    aria-current="page"
                                    to="/Profile"
                                >
                                    Profile
                                </NavLink>
                            </li>
                        )}
                        {props.user != null && (
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link active"
                                    aria-current="page"
                                    to="/logout"
                                >
                                    Logout
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
