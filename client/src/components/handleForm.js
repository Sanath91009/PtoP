import React from "react";
import { useState } from "react";
import Countdown from "react-countdown";
export const HandleForm = ({
    HandleSubmit,
    section,
    otp,
    setOtp,
    resendOtp,
    setResendOtp,
}) => {
    const HandleChange = () => {
        if (otp[section] == undefined) return;
        const otp_temp = { ...otp };
        delete otp_temp[section];
        setOtp(otp_temp);
    };
    const renderer = ({ seconds, completed }) => {
        if (completed) {
        } else {
            return <span>{seconds}</span>;
        }
    };
    return (
        <form
            className="px-3"
            onSubmit={(e) => {
                e.preventDefault();
                let otp_val;
                if (otp[section] == true) otp_val = e.target.otp.value;

                return HandleSubmit(
                    section,
                    e.target.Handle.value,
                    e.target.emailid.value,
                    otp_val
                );
            }}
        >
            <div className="form-group mb-2">
                <label htmlFor="Handle">Handle</label>
                <input
                    type="text"
                    className="form-control"
                    id="Handle"
                    aria-describedby="Handle"
                    placeholder="Enter Handle"
                    onChange={HandleChange}
                />
            </div>
            <div className="form-group mb-2">
                <label htmlFor="emailid">Email address</label>
                <input
                    type="email"
                    className="form-control"
                    id="emailid"
                    aria-describedby="emailid"
                    placeholder="Enter email"
                    onChange={HandleChange}
                />
                <small id="emailHelp" className="form-text text-muted">
                    We'll never share your email with anyone else.
                </small>
            </div>
            {otp[section] && otp[section] == true && (
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
                                onComplete={() => setResendOtp(true)}
                            />{" "}
                            seconds
                        </span>
                    ) : (
                        <a
                            onClick={async () => {
                                await HandleSubmit(
                                    section,
                                    document.querySelector("#Handle").value,
                                    document.querySelector("#emailid").value
                                );
                                setResendOtp(false);
                            }}
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
                    className="btn btn-primary mt-2 authHandle1"
                >
                    Authenticate your handle
                </button>
            </div>
        </form>
    );
};
