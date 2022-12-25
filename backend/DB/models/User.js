const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    handlesInfo: [
        {
            handle: {
                type: String,
                required: true,
            },
            section: {
                type: String,
                required: true,
            },
        },
    ],
});

const User = mongoose.model("User", userSchema);
function randomColor() {
    let hex = Math.floor(Math.random() * 0xffffff);
    let color = "#" + hex.toString(16);
    if (color == "#FFFFFF") return randomColor();
    return color;
}
async function getUser(username) {
    const data = await User.findOne({ username: username });
    return data;
}

async function createUser(username, email_id, password) {
    const color = randomColor();
    const data = await User.create({
        emailId: email_id,
        username: username,
        password: password,
        color: color,
    });
    return color;
}
async function addHandlesInfo(username, handle, section) {
    const data = await User.updateOne(
        { username: username },
        { $push: { handle: handle, section: section } }
    );
    return data;
}
async function getHandlesInfo(username) {
    const data = await User.findOne({ username: username });
    if (data == null) return null;
    return data["handlesInfo"];
}
module.exports = {
    getUser,
    createUser,
    getHandlesInfo,
    addHandlesInfo,
};
