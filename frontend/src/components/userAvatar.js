import { block } from "joi-browser";
import React from "react";

const getInitials = (name) => {
    let ans = name[0];
    ans += name.slice(-1);
    return ans.toUpperCase();
};
function randomColor() {
    let hex = Math.floor(Math.random() * 0xffffff);
    let color = "#" + hex.toString(16);
    if (color == "#FFFFFF") return randomColor();
    return color;
}
export const UserAvatar = ({ name, color, showName = false }) => {
    const c = color == undefined ? randomColor() : color;
    return (
        <div
            className="sb-avatar sb-avatar--text"
            style={{
                display: "inline-block",
                verticalAlign: "middle",
                width: "100%",
                height: "100%",
                fontFamily: "Helvetica",
            }}
        >
            <div
                className=" sb-avatar__text"
                title={name}
                style={{
                    width: "100%",
                    height: "100%",
                    lineHeight: "initial",
                    textAlign: "center",
                    backgroundColor: c,
                }}
            >
                <div
                    style={{
                        display: "table",
                        tableLayout: "fixed",
                        width: "100%",
                        height: "100%",
                        fontSize: "50px",
                    }}
                >
                    {showName == false ? (
                        <span
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "table-cell",
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                                color: "white",
                                overflow: "hidden",
                            }}
                        >
                            <span>{getInitials(name)}</span>
                        </span>
                    ) : (
                        <span
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "table-cell",
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                                color: "white",
                                overflow: "hidden",
                            }}
                            className="text-center"
                        >
                            <p className="m-1">{getInitials(name)}</p>
                            <p
                                style={{
                                    fontSize: "30%",
                                    whiteSpace: "nowrap",
                                    wordWrap: "break-word",
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {name}
                            </p>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
