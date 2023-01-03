import React from "react";
import { HandleForm } from "./handleForm";
import { faCopy, faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
export const PorfileInfo = (props) => {
    const {
        section,
        HandleSubmit,
        handle,
        otp,
        setOtp,
        fullName,
        resendOtp,
        setResendOtp,
    } = props;
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (copied) setCopied(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [copied]);
    return (
        <div className="card">
            <div className="card-header" id={section}>
                <h5 className="mb-0">
                    <button
                        className={
                            handle == undefined
                                ? "btn btn-danger collapsed"
                                : "btn btn-success collapsed"
                        }
                        data-bs-toggle="collapse"
                        data-bs-target={`#Collapse${section}`}
                        aria-expanded="false"
                        aria-controls={`Collapse${section}`}
                        style={{ width: "130px" }}
                    >
                        {section}
                    </button>
                </h5>
            </div>

            <div
                id={`Collapse${section}`}
                className="collapse authenticateForm"
                aria-labelledby={section}
                data-bs-parent="#accordion"
            >
                {handle == undefined ? (
                    section == "codechef" ? (
                        <div className="card-body">
                            <div className="form-group mb-2">
                                <label htmlFor="Handle">Handle</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="codechefHandle"
                                    aria-describedby="Handle"
                                    placeholder="Enter Handle"
                                />
                            </div>
                            <p className="dark">
                                Please change your full name in codechef to{" "}
                                <span style={{ fontSize: "20px" }}>
                                    {" "}
                                    <b>{fullName} </b>{" "}
                                </span>
                                {copied == false ? (
                                    <FontAwesomeIcon
                                        icon={faCopy}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                fullName
                                            );
                                            setCopied(true);
                                        }}
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                )}{" "}
                                for authentication
                            </p>
                            <button
                                className="btn btn-primary authHandle2"
                                onClick={HandleSubmit}
                            >
                                Hit after changing your full name
                            </button>
                        </div>
                    ) : (
                        <div className="card-body">
                            <HandleForm
                                HandleSubmit={HandleSubmit}
                                section={section}
                                otp={otp}
                                setOtp={setOtp}
                                resendOtp={resendOtp}
                                setResendOtp={setResendOtp}
                            />
                        </div>
                    )
                ) : (
                    <div className="card-body">
                        <p className="dark">Handle : {handle}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
