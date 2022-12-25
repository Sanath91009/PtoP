import React from "react";

export const HandleForm = ({ onSubmit, section }) => {
    return (
        <form
            className="px-3"
            onSubmit={(e) =>
                onSubmit(section, e.target.username.value, e.target.email.value)
            }
        >
            <div className="form-group mb-2">
                <label for="Handle">Handle</label>
                <input
                    type="text"
                    className="form-control"
                    id="Handle"
                    aria-describedby="Handle"
                    placeholder="Enter Handle"
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
                <small id="emailHelp" className="form-text text-muted">
                    We'll never share your email with anyone else.
                </small>
            </div>

            <div className="text-center">
                <button type="submit" className="btn btn-primary mt-2">
                    Authenticate your profile
                </button>
            </div>
        </form>
    );
};
