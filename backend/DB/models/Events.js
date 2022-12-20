const RemoveAnswersObject = require("../../Helpers/Question/RemoveAnswers");
const { calculateScore } = require("../../Helpers/Question/ResultEvaluation");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const QuestionSchema = new mongoose.Schema({
    subjectType: {
        type: String,
        enum: ["Maths", "Physics", "Chemistry"],
        required: true,
    },
    questionDesc: {
        type: String,
        required: true,
    },
    answer: {
        type: [Boolean],
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
});

const EventsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
    },
    date: {
        type: Number,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["discussion", "exam"],
        default: "discussion",
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
    questions: [QuestionSchema],
});
const Events = mongoose.model("Events", EventsSchema);

async function createEvent(
    name,
    date,
    section,
    type,
    candidatesInfo = [],
    questions = []
) {
    const res = await Events.create({
        name: name,
        date: date,
        section: section,
        type: type,
        candidatesInfo: candidatesInfo,
        questions: questions,
    });
    return res;
}
async function addRequest(eventID, username_b, score_b, username_a, score_a) {
    const data = await Events.updateOne(
        { _id: eventID, "candidatesInfo.username": username_b },
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
        { _id: eventID, "candidatesInfo.username": username_a },
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
async function getEvents(section) {
    const data = await Events.find({ section: section });
    return data;
}

async function getQuestionsByExamId(examId) {
    const data = await Events.findOne({ _id: examId });
    return data;
}

// can cache results when an examid is requested
async function getQuestionsById(examId) {
    const data = await getQuestionsByExamId(examId);
    const {
        questions: questionsWithAnswers,
        name: n,
        date: d,
        section: s,
        type: t,
    } = data;
    const dataWithoutAnswers = {
        questions: RemoveAnswersObject.RemoveAnswers(questionsWithAnswers),
        name: n,
        date: d,
        section: s,
        type: t,
    };
    return dataWithoutAnswers;
}
async function getCandidatesById(examId) {
    const { candidatesInfo } = await Events.findOne({
        _id: new ObjectId(examId),
    });
    return candidatesInfo;
}
// answers of form <id, chosenArr>
async function calculateScoreInExam(answers, examId, username) {
    const questions = await getQuestionsByExamId(examId);
    const keys = questions.questions.map(
        ({ answer: a, subjectType: b, ...rest }) => {
            return {
                answer: a,
                subjectType: b,
            };
        }
    );
    console.log();
    const subScore = await calculateScore(answers, keys);
    updateScoreCandidate(examId, username, subScore["totalScore"]);
    return subScore;
}
async function getScore(eventId, username) {
    const res = await Events.findOne({
        _id: eventId,
        "candidatesInfo.username": username,
    }).select({ candidatesInfo: { $elemMatch: { username: username } } });
    if (res) return res.candidatesInfo[0].score;
    return null;
}
async function addCandidate(eventID, username) {
    const res = await Events.updateOne(
        { _id: eventID },
        { $push: { candidatesInfo: { username: username } } }
    );
    return res;
}
async function removeCandidate(eventID, username) {
    const res = await Events.updateOne(
        { _id: eventID },
        { $pull: { candidatesInfo: { username: username } } }
    );
    return res;
}
async function updateScoreCandidate(eventID, username, score) {
    const res = await Events.updateOne(
        { _id: eventID, "candidatesInfo.username": username },
        { $set: { "candidatesInfo.$.score": score } }
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
            _id: eventID,
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
            _id: eventID,
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
    getQuestionsById,
    calculateScoreInExam,
    createEvent,
    addCandidate,
    updateScoreCandidate,
    removeCandidate,
    getCandidatesById,
    getScore,
    addRequest,
    addRoomLink,
};
