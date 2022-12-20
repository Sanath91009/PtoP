const score = (chosenOptions, key) => {
    let s = 0;
    const result = key.map((b, i) => {
        if (b && chosenOptions[i]) s = s + 1;
        return b && chosenOptions[i];
    });
    return s;
};
async function calculateScore(answers, keys) {
    var subScore = {};
    var totalScore = 0;
    answers.map((answer, i) => {
        const eachQuestionScore = score(answer, keys[i].answer);
        if (subScore[keys[i].subjectType] === undefined) {
            subScore[keys[i].subjectType] = 0;
        }
        totalScore += eachQuestionScore;
        subScore[keys[i].subjectType] += eachQuestionScore;
        return eachQuestionScore;
    });
    subScore["totalScore"] = totalScore;
    return subScore;
}

module.exports = {
    calculateScore,
};
