import React from "react";
import Avatar from "react-avatar";

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
export const UserAvatar = ({ name, color }) => {
    const c = color == undefined ? randomColor() : color;
    return (
        <div
            class="sb-avatar sb-avatar--text"
            style={{
                display: "inline-block",
                verticalAlign: "middle",
                width: "100%",
                height: "100%",
                fontFamily: "Helvetica",
            }}
        >
            <div
                class=" sb-avatar__text"
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
                    <span
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "table-cell",
                            verticalAlign: "middle",
                            whiteSpace: "nowrap",
                            color: "white",
                        }}
                    >
                        <span>{getInitials(name)}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};
