const mongoose = require("mongoose");
const { generateOtp } = require("../../Services/Auth/OtpGenerator");

// import { authenticator } from 'otplib';
const { authenticator } = require("otplib");

const userOtpSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    secret: {
        type: String,
        required: true,
    },
});

const UserOtp = mongoose.model("UserOtp", userOtpSchema);

async function getUserOtp(username) {
    const data = await UserOtp.findOne({ username: username });
    return data;
}

async function createUserOtp(username) {
    const token = generateOtp();

    // check if user exists
    // if true: update
    // else create

    const data = await UserOtp.findOne({ username: username });
    const secret = authenticator.generateSecret();
    const otp = authenticator.generate(secret);
    if (data) {
        console.log(
            `user already requested an otp~~ Updating the old one otp: ${otp} secret: ${secret}`
        );
        const res = await UserOtp.updateOne(
            {
                username: username,
            },
            {
                otp: otp,
                secret: secret,
            }
        );
    } else {
        console.log(`new rquest otp: ${otp} secret: ${secret}`);
        const res = await UserOtp.create({
            username: username,
            otp: otp,
            secret: secret,
        });
    }
    return data;
}

async function verifyUserOtp(username, token) {
    let res = {};
    // const token = generateOtp();

    // check if user exists
    // if true: update
    // else create

    // const secret = process.env.SECRET;
    const data = await UserOtp.findOne({ username: username });
    const { secret } = data;
    console.log(`${token} ${secret}`);
    let isValid;
    if (data) {
        try {
            isValid = authenticator.check(token, secret);
            console.log("isValid: ", isValid, token, " token ");
            if (isValid) {
                res.status = 200;
                res.message = "successfully verified";
            } else {
                res.status = 400;
                res.message = "Not Verified";
            }
        } catch (err) {
            // Possible errors
            // - options validation
            // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
            res.status = 401;
            res.message = `${err}\n${isValid}`;
        }
    } else {
        res.status = 402;
        res.message = "user doesnt have an otp entry in database";
    }
    return res;
}
async function deleteUserOtp(username) {
    const data = await UserOtp.remove({ username: username });
    return data;
}
module.exports = {
    getUserOtp,
    createUserOtp,
    verifyUserOtp,
    deleteUserOtp,
};
