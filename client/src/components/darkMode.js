import React from "react";
import "../css/DarkMode.css";
import { useState } from "react";
const setDark = () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
};

const setLight = () => {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
};

const storedTheme = localStorage.getItem("theme");

const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

const defaultDark =
    storedTheme === "dark" || (storedTheme === null && prefersDark);

if (defaultDark) {
    setDark();
}

const DarkMode = () => {
    const [isDark, setIsDark] = useState(defaultDark);
    return (
        <a
            onClick={() => {
                if (isDark) {
                    setIsDark(false);
                    setLight();
                } else {
                    setIsDark(true);
                    setDark();
                }
            }}
            style={{ cursor: "pointer", textDecoration: "none" }}
            className="dark active"
        >
            {!isDark ? "Dark" : "Light"}
        </a>
    );
};

export default DarkMode;
