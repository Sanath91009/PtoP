import React from "react";

export const Filter = ({
    HandleFilterClick,
    questions,
    label,
    HandleFilter,
}) => {
    const HandleReset = () => {
        document.querySelector(`.filter${label}`).reset();
        HandleFilter();
    };
    return (
        <form className={`filter${label} py-5`} onSubmit={HandleFilterClick}>
            <div className="form-group mb-2">
                <label htmlFor="handle">Handle starts with...</label>
                <input
                    type="text"
                    className="form-control"
                    id="handle"
                    aria-describedby="handle"
                    placeholder="Enter handle"
                />
            </div>
            <div className="row m-0">
                <p className="m-0 p-0">Enter Range of rating</p>
                <div className="col-sm-5 p-0">
                    <input
                        className="form-control"
                        id="from"
                        placeholder="From"
                    ></input>
                </div>
                <div className="col-sm-2 p-0 text-center">
                    <p className="m-0 p-1 h-100">to</p>
                </div>
                <div className="col-sm-5 p-0">
                    <input
                        className="form-control"
                        id="to"
                        placeholder="To"
                    ></input>
                </div>
            </div>
            <div className="my-2">
                <p className="p-0 m-0">Solved</p>
                {questions &&
                    questions.map((q) => {
                        return (
                            <div className="form-check" key={q.code}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value=""
                                    id={q.code}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={q.code}
                                >
                                    {q.code}
                                </label>
                            </div>
                        );
                    })}
            </div>
            <div className="w-100 text-center m-0">
                <button
                    className="btn btn-primary"
                    type="submit"
                    style={{ display: "block", margin: "auto" }}
                >
                    Filter
                </button>
                <a
                    onClick={HandleReset}
                    style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                        display: "inline-block",
                        marginTop: "10px",
                    }}
                >
                    clear filter
                </a>
            </div>
        </form>
    );
};
