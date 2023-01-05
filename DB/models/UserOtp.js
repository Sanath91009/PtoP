const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const key = process.env.KEY;
const API_KEY = process.env.API_KEY;
const DOMAIN = "peer2peer.social";
async function createNewOTP(emailid) {
    const otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    const ttl = 10 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${emailid}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
    const fullHash = `${hash}.${expires}`;
    // console.log("otp : ", otp);
    // console.log("data : ", data);
    // send otp to mail id

    const mailgun = new Mailgun(formData);
    const client = mailgun.client({ username: "api", key: API_KEY });

    const messageData = {
        from: "no-reply@peer2peer.social",
        to: [emailid],
        subject: "Authentication Code",
        text: "Testing some Mailgun awesomness!",
        html: `<html><p>Welcome to P2P platform, happy learning</p><h3>OTP : ${otp}</h3></html>`,
    };
    client.messages
        .create(DOMAIN, messageData)
        .then((res) => {
            console.log("res : ", res);
        })
        .catch((err) => {
            console.error("err : ", err);
        });

    return fullHash;
}
async function verifyOTP(emailid, hash, otp) {
    let [hashValue, expires] = hash.split(".");
    let now = Date.now();
    if (now > parseInt(expires))
        return { status: 201, message: "otp expired, create new one" };
    let data = `${emailid}.${otp}.${expires}`;
    console.log("data : ", data);
    let newCalculatedHash = crypto
        .createHmac("sha256", key)
        .update(data)
        .digest("hex");
    console.log("new hash : ", newCalculatedHash);
    if (newCalculatedHash === hashValue) {
        return { status: 200, message: "authentication successful" };
    }
    return { status: 201, message: "authentication failed" };
}
module.exports = { createNewOTP, verifyOTP };
