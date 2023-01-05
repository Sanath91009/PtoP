const mongoose = require("mongoose");

const EventsSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    date: {
        type: Number,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    dependent: {
        questions: [
            {
                code: {
                    type: String,
                },
                name: {
                    type: String,
                },
            },
        ],
        contestInfo: {
            type: String,
        },
    },
    candidatesInfo: [
        {
            username: {
                type: String,
                required: true,
            },
            handle: {
                type: String,
                required: true,
            },
            solved: [
                {
                    type: String,
                },
            ],
            rating: {
                type: Number,
            },
            requests: [
                {
                    handle: {
                        type: String,
                        required: true,
                    },
                    rating: {
                        type: Number,
                    },
                    solved: [
                        {
                            type: String,
                        },
                    ],
                },
            ],
            requestsSent: [
                {
                    handle: {
                        type: String,
                        required: true,
                    },
                    rating: {
                        type: Number,
                    },
                    solved: [
                        {
                            type: String,
                        },
                    ],
                },
            ],
        },
    ],
});
const Events = mongoose.model("Events", EventsSchema);

async function createEvent(name, date, section, dependent, candidatesInfo) {
    let id = await Events.countDocuments({});
    id += 1;
    console.log("dependent : ", dependent);
    const res = await Events.create({
        name: name,
        date: date,
        section: section,
        dependent: dependent,
        id: id,
        candidatesInfo: candidatesInfo,
    });
    return res;
}
async function addRequest(
    eventID,
    handle_b,
    solved_b,
    rating_b,
    handle_a,
    solved_a,
    rating_a
) {
    console.log(
        eventID,
        handle_b,
        solved_b,
        rating_b,
        handle_a,
        solved_a,
        rating_a
    );
    const data = await Events.updateOne(
        { id: eventID, "candidatesInfo.handle": handle_b },
        {
            $push: {
                "candidatesInfo.$.requests": {
                    handle: handle_a,
                    solved: solved_a,
                    rating: rating_a,
                },
            },
        }
    );
    const res = await Events.updateOne(
        { id: eventID, "candidatesInfo.handle": handle_a },
        {
            $push: {
                "candidatesInfo.$.requestsSent": {
                    handle: handle_b,
                    solved: solved_b,
                    rating: rating_b,
                },
            },
        }
    );
    return data;
}
async function getQuestions(eventID) {
    console.log("eventID :", eventID);
    const data = await Events.find({ id: eventID }).select(
        "dependent.questions"
    );
    if (data == null) {
        return null;
    }
    return data[0]["dependent"];
}
async function getEvents(username) {
    console.log("username : ", username);
    const data = await Events.find().select({
        name: true,
        date: true,
        id: true,
        section: true,
        candidatesInfo: { $elemMatch: { username: username } },
    });
    console.log("data : ", data);
    return data;
}
async function getEventById(id) {
    const data = await Events.find({ id: id });
    if (!data || data.length == 0) return null;
    console.log("data[0 : ", data[0]);
    return data[0];
}
async function getCandidatesById(eventID) {
    const { candidatesInfo } = await Events.findOne({
        id: eventID,
    }).select(
        "candidatesInfo.handle candidatesInfo.solved candidatesInfo.rating"
    );
    return candidatesInfo;
}
async function getSectionByID(eventID) {
    const { section } = await Events.findOne({ id: eventID });
    return section;
}
async function getEventsInfoOfCandidate(eventID, username) {
    const { candidatesInfo } = await Events.findOne({
        id: eventID,
    }).select({ candidatesInfo: { $elemMatch: { username: username } } });
    return candidatesInfo;
}
async function addCandidate(
    eventID,
    handle,
    username,
    solved,
    rating,
    requests = [],
    requestsSent = []
) {
    const res = await Events.updateOne(
        { id: eventID },
        {
            $push: {
                candidatesInfo: {
                    handle: handle,
                    username: username,
                    solved: solved,
                    rating: rating,
                    requests: requests,
                    requestsSent: requestsSent,
                },
            },
        }
    );
    return res;
}
async function removeCandidate(eventID, username) {
    const res = await Events.updateOne(
        { id: eventID },
        { $pull: { candidatesInfo: { username: username } } }
    );
    return res;
}

module.exports = {
    getEvents,
    createEvent,
    addCandidate,
    removeCandidate,
    getCandidatesById,
    addRequest,
    getEventsInfoOfCandidate,
    getEventById,
    getSectionByID,
    getQuestions,
};
