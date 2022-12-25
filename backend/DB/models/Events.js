const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

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
        type: String,
        required: false,
    },
    candidatesInfo: [
        {
            username: {
                type: String,
                required: true,
            },
            score: {
                type: Number,
                required: true,
            },
            requests: [
                {
                    username: {
                        type: String,
                        required: true,
                    },
                    score: {
                        type: Number,
                        required: true,
                    },
                },
            ],
            requestsSent: [
                {
                    username: {
                        type: String,
                        required: true,
                    },
                    score: {
                        type: Number,
                        required: true,
                    },
                },
            ],
            roomLinks: [
                {
                    uuid: {
                        type: String,
                        required: true,
                    },
                    username: {
                        type: String,
                        required: true,
                    },
                    score: {
                        type: String,
                        required: true,
                    },
                    timestamp: {
                        type: Number,
                        required: true,
                    },
                },
            ],
        },
    ],
});
const Events = mongoose.model("Events", EventsSchema);

async function createEvent(
    name,
    date,
    section,
    dependent = [],
    candidatesInfo = []
) {
    const res = await Events.create({
        name: name,
        date: date,
        section: section,
        dependent: dependent,
        id: 1 + Events.count(),
        candidatesInfo: candidatesInfo,
    });
    return res;
}
async function addRequest(eventID, username_b, score_b, username_a, score_a) {
    const data = await Events.updateOne(
        { id: eventID, "candidatesInfo.username": username_b },
        {
            $push: {
                "candidatesInfo.$.requests": {
                    username: username_a,
                    score: score_a,
                },
            },
        }
    );
    const res = await Events.updateOne(
        { id: eventID, "candidatesInfo.username": username_a },
        {
            $push: {
                "candidatesInfo.$.requestsSent": {
                    username: username_b,
                    score: score_b,
                },
            },
        }
    );
    return data;
}
async function getEvents() {
    const data = await Events.find();
    return data;
}

async function getCandidatesById(examId) {
    const { candidatesInfo } = await Events.findOne({
        id: new ObjectId(examId),
    });
    return candidatesInfo;
}

async function addCandidate(eventID, username) {
    const res = await Events.updateOne(
        { id: eventID },
        { $push: { candidatesInfo: { username: username } } }
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

async function addRoomLink(
    eventID,
    username_a,
    score_a,
    username_b,
    score_b,
    uuid,
    timestamp
) {
    const res = await Events.updateOne(
        {
            id: eventID,
            "candidatesInfo.username": username_a,
        },
        {
            $push: {
                "candidatesInfo.$.roomLinks": {
                    username: username_b,
                    score: score_b,
                    uuid: uuid,
                    timestamp: timestamp,
                },
            },
        }
    );
    const res1 = await Events.updateOne(
        {
            id: eventID,
            "candidatesInfo.username": username_b,
        },
        {
            $push: {
                "candidatesInfo.$.roomLinks": {
                    username: username_a,
                    score: score_a,
                    uuid: uuid,
                    timestamp: timestamp,
                },
            },
        }
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
    addRoomLink,
};
