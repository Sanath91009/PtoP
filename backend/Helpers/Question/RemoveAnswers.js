// import { removeAnswers } from "./RemoveAnswers";

// TODO: use https://www.mongodb.com/docs/manual/aggregation/#single-purpose-aggregation-methods
// array of questions to be grouped

const RemoveAnswers = (questions) => {
    if (questions !== null && questions !== undefined) {
        const temp = questions.map(
            ({
                answer: a,
                questionDesc: q,
                subjectType: s,
                options: o,
                _id: i,
            }) => ({
                questionDesc: q,
                subjectType: s,
                options: o,
                _id: i,
            })
        );
        return temp;
    }

    // return questions.map(({questions: qs, ...rest})=>({rest}))
    else return null;
};

module.exports = {
    RemoveAnswers,
};
