import React from "react";
import Navbar from "./navbar";
export const About = () => {
    return (
        <div>
            <Navbar />
            <div className="container my-5 dark">
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h4>Z. Peer Discussion</h4>
                    <p style={{ marginBottom: 0, marginTop: "10px" }}>
                        time limit per test: as long as you wish
                    </p>
                    <p style={{ margin: 0 }}>
                        memory limit per test: &#129300;
                    </p>
                    <p style={{ margin: 0 }}>
                        input: Interest towards peer discussion
                    </p>
                    <p style={{ margin: 0 }}>output: knowledge & Fun</p>
                </div>

                <p>
                    Sanath_kumar gave a contest in codeforces and now he wants
                    to discuss with other participants but he could not able to
                    do that as he don't have any friends group who are
                    interested in competitive programming. So he gave up on his
                    desire and continued to participate in contests for quite a
                    good amount of time with having a small amount of peer
                    discussion.
                </p>
                <p>
                    Now he feels that peer discussion is THE most important
                    thing that one should do after participitating in a contest.
                    So Sanath_kumar with the help of shadar && 7vivann designed
                    a platform where competitive programmers can go and requets
                    other to join a room or can accept requests or can randomly
                    pair with other participants by server.
                </p>

                <b>Input</b>
                <p>
                    Your interest towards gaining knowledge is the only input
                    here. You will be provided with the website link, go there
                    and enjoy the platform which was build for you.
                </p>

                <b>Output</b>
                <p>
                    comment "YES" if you enjoyed the platform, "NO" if you
                    didn't.
                </p>
                <p>
                    You may print each letter in any case (for example, "YES",
                    "Yes", "yes", and "yEs" will all be recognized as positive
                    answers).
                </p>

                <b>Example</b>
                <table
                    style={{
                        width: "100%",
                        border: "1px solid black",
                        borderCollapse: "collapse",
                    }}
                >
                    <tr
                        style={{
                            border: "1px solid black",
                            borderCollapse: "collapse",
                        }}
                    >
                        <th
                            style={{
                                fontWeight: "normal",
                                textAlign: "left",
                                fontFamily:
                                    "Consolas, lucida console, andale mono,bitstream vera sans mono, courier new, Courier",
                            }}
                        >
                            input
                        </th>
                    </tr>
                    <tr
                        style={{
                            border: "1px solid black",
                            borderCollapse: "collapse",
                        }}
                    >
                        <td
                            style={{
                                border: "1px solid black",
                                borderCollapse: "collapse",
                                backgroundColor: "#e0e0e0",
                                color: "#333",
                            }}
                        >
                            www.peer2peer.social
                        </td>
                    </tr>
                    <tr
                        style={{
                            border: "1px solid black",
                            borderCollapse: "collapse",
                        }}
                    >
                        <th
                            style={{
                                fontWeight: "normal",
                                textAlign: "left",
                                fontFamily:
                                    "Consolas, lucida console, andale mono,bitstream vera sans mono, courier new, Courier",
                            }}
                        >
                            output (expected)
                        </th>
                    </tr>
                    <tr
                        style={{
                            border: "1px solid black",
                            borderCollapse: "collapse",
                        }}
                    >
                        <td
                            style={{
                                border: "1px solid black",
                                borderCollapse: "collapse",
                                backgroundColor: "#e0e0e0",
                                color: "#333",
                            }}
                        >
                            YES
                        </td>
                    </tr>
                </table>
                <div className="my-3">
                    <b>Note</b>
                    <p>
                        I hope you will like the platform and enjoy learning.
                        Don't forget to give your value feedback.
                    </p>
                </div>
            </div>
        </div>
    );
};
