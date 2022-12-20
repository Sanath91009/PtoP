import React from "react";
import { useLocation } from "react-router-dom";
export const ShowResults = () => {
    const location = useLocation();
    const { username, eventID, subScores } = location.state;

    return (
        <div>
            <h3>Results of {username}</h3>
            <table className="table w-25 m-5 table-striped">
                <thead className="table-dark">
                    <tr>
                        <th scope="col">Subjects</th>
                        <th scope="col">Marks</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(subScores).map((key) => {
                        console.log(key, subScores[key]);
                        return (
                            <tr>
                                <td>{key}</td>
                                <td>{subScores[key]}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
