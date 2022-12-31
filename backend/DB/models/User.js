const mongoose = require("mongoose");
const crypto = require("crypto");
const key = process.env.KEY;
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
    admin: {
        type: Boolean,
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
function generateRandomColorHsl() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(30 + Math.random() * 71) + "%";
    const lightness = Math.floor(40 + Math.random() * 61) + "%";
    return "hsl(" + hue + ", " + saturation + ", " + lightness + ")";
}
async function getUser(username) {
    const data = await User.findOne({ username: username });
    return data;
}
async function getHandle(username, section) {
    const data = await User.findOne({ username: username }).select({
        handlesInfo: { $elemMatch: { section: section } },
    });
    if (
        data["handlesInfo"] == undefined ||
        data["handlesInfo"] == null ||
        data["handlesInfo"].length == 0
    )
        return null;
    const { handlesInfo } = data;
    console.log("afhs : ", handlesInfo);
    return handlesInfo[0].handle;
}

async function createUser(
    username,
    email_id,
    password,
    handlesInfo = [],
    admin = false
) {
    const color = generateRandomColorHsl();
    const pwd_hash = crypto
        .createHmac("sha256", key)
        .update(password + process.env.SALT)
        .digest("hex");
    const data = await User.create({
        emailId: email_id,
        username: username,
        password: pwd_hash,
        color: color,
        handlesInfo: handlesInfo,
        admin: admin,
    });
    return color;
}
async function addHandleInfo(username, handle, section) {
    console.log("adding handle info : ", username, handle);
    const data = await User.updateOne(
        { username: username },
        { $push: { handlesInfo: { handle: handle, section: section } } }
    );
    return data;
}
async function getHandlesInfo(username) {
    const data = await User.findOne({ username: username });
    return data["handlesInfo"];
}
module.exports = {
    getUser,
    createUser,
    getHandlesInfo,
    addHandleInfo,
    getHandle,
};
