import React from "react";
import Navbar from "../components/navbar";
import { Section } from "../components/sections";
import { UserAvatar } from "../components/userAvatar";
import { useEffect } from "react";
import { createElement } from "react";
export const Home = () => {
    const name = "xlfsoif";
    useEffect(() => {
        const temp = <UserAvatar name={"asdad"} />;
        console.log("temp : ", temp);
        document.querySelector(".temp").append(document.querySelector(".avat"));
    }, []);
    return (
        <div className="hi">
            <Navbar user={null} />
            <Section></Section>
            <div className="temp"></div>
        </div>
    );
};
