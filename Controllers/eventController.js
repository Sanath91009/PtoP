const {
    getEvents,
    createEvent,
    addCandidate,
    removeCandidate,
    getCandidatesById,
    addRequest,
    getEventsInfoOfCandidate,
    getEventById,
    getQuestions,
} = require("../DB/models/Events");
const { getHandle, getUser } = require("../DB/models/User");
const { getUserResult, getUserRating } = require("../WebScrapping/codechef");
async function getEventsController(req, res, next) {
    const username = req.query.username;
    try {
        const result = await getEvents(username);
        res.send({ code: 200, data: result });
    } catch (err) {
        next(err);
    }
}

async function addRequestController(req, res, next) {
    // s sending request to b
    const { eventID, handle_a, handle_b, score_a, score_b } = req.body;
    try {
        const result = await addRequest(
            eventID,
            handle_b,
            score_b,
            handle_a,
            score_a
        );
        res.send({ code: 200, data: result, message: "request added" });
    } catch (err) {
        next(err);
    }
}

async function createEventController(req, res, next) {
    if (!req.user) {
        res.send({ code: 500, message: "only authenticated users can access" });
        next(req.err);
    } else if (req.user.admin == false) {
        res.send({ code: 500, message: "only admins can create event" });
    } else {
        const {
            name,
            date,
            section,
            dependent = [],
            candidatesInfo = [],
        } = req.body;
        try {
            const result = await createEvent(
                name,
                date,
                section,
                dependent,
                candidatesInfo
            );
            res.send({ code: 200, data: "Event created" });
        } catch (err) {
            next(err);
        }
    }
}
async function userParticipated(handle, section, eventID) {
    const { dependent } = await getEventById(eventID);
    const res = {};
    if (section == "codeforces") {
        const endpoint = `https://codeforces.com/api/contest.standings?contestId=${dependent.contestInfo}&handles=${handle}`;
        await fetch(endpoint)
            .then((response) => response.json())
            .then(async (data) => {
                if (data.status != "OK") {
                    res.participated = false;
                } else if (data.result.rows.length == 0) {
                    res.participated = false;
                } else {
                    res.participated = true;
                    const sub = data.result.rows[0].problemResults;
                    res.solved = [];
                    for (let i = 0; i < sub.length; i++) {
                        if (sub[i].points > 0) {
                            res.solved.push(dependent.questions[i].code);
                        }
                    }
                }
                const url = `https://codeforces.com/api/user.info?handles=${handle}`;
                await fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        res.rating = data.result[0].rating;
                    });
            });
        return res;
    } else if (section == "codechef") {
        const data = await getUserResult(dependent.contestInfo, handle);
        if (data == null) {
            res.participated = false;
        } else {
            res.participated == true;
            res.solved = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i] != "-") {
                    res.solved.push(dependent.questions[i].code);
                }
            }
        }
        const rating = await getUserRating(handle);
        res.rating = rating;
        return res;
    }
}
async function getUserResultController(req, res, next) {
    const contestID = req.query.contestID;
    const handle = req.query.handle;
    const data = await getUserResult(contestID, handle);
    res.send({ code: 200, data: data });
}
async function registerCandidate(req, res, next) {
    const { username, eventID, section } = req.body;
    const data = await getEventsInfoOfCandidate(eventID, username);
    console.log("data : ", data);
    if (data.length != 0) {
        res.send({ code: 201, message: "already registered" });
        return;
    }
    try {
        const handle = await getHandle(username, section);
        if (handle == null) {
            res.send({ code: 400, message: "handle not authenticated yet" });
        } else {
            const par = await userParticipated(handle, section, eventID);
            console.log("par : ", par);
            if (par.participated == false) {
                if (!par.rating || par.rating < 1900) {
                    res.send({
                        code: 401,
                        message:
                            "sorry you are not participated in this contest",
                    });
                } else {
                    const result = await addCandidate(
                        eventID,
                        handle,
                        username,
                        par.solved,
                        par.rating
                    );
                    res.send({
                        code: 200,
                        message: "Registered to event successfully",
                        handle: handle,
                    });
                }
            } else {
                const result = await addCandidate(
                    eventID,
                    handle,
                    username,
                    par.solved,
                    par.rating
                );
                res.send({
                    code: 200,
                    message: "Registered to event successfully",
                    handle: handle,
                });
            }
        }
    } catch (err) {
        next(err);
    }
}
async function deregisterCandidate(req, res, next) {
    const { username, eventID } = req.body;
    try {
        const result = await removeCandidate(eventID, username);
        res.send({ code: 200, message: "DeRegistered to event successfully" });
    } catch (err) {
        next(err);
    }
}
async function getQestionsController(req, res, next) {
    const eventID = req.query.eventID;
    try {
        const data = await getQuestions(eventID);

        res.send({ code: 200, data: data });
    } catch (err) {
        next(err);
    }
}
async function getCandidatesByIdController(req, res, next) {
    const eventID = req.query.eventID;
    try {
        const result = await getCandidatesById(eventID);
        res.send({ code: 200, message: result });
    } catch (err) {
        next(err);
    }
}
async function getEventInfoOfCandidateController(req, res, next) {
    const eventID = req.query.eventID;
    const username = req.query.username;
    try {
        const result = await getEventsInfoOfCandidate(eventID, username);
        if (!result || result.length == 0) {
            res.send({ code: 400, message: "candidate not found" });
        } else res.send({ code: 200, message: result });
    } catch (err) {
        next(err);
    }
}
module.exports = {
    getEventsController,
    createEventController,
    registerCandidate,
    deregisterCandidate,
    getCandidatesByIdController,
    addRequestController,
    getQestionsController,
    getEventInfoOfCandidateController,
    getUserResultController,
};
