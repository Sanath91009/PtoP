const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = process.env.KEY;

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
    console.log("otp : ", otp);
    return fullHash;
}
async function verifyOTP(emailid, hash, otp) {
    let [hashValue, expires] = hash.split(".");
    let now = Date.now();
    if (now > parseInt(expires))
        return { status: 201, message: "otp expired, create new one" };
    let data = `${emailid}.${otp}.${expires}`;
    let newCalculatedHash = crypto
        .createHmac("sha256", key)
        .update(data)
        .digest("hex");
    if (newCalculatedHash === hashValue) {
        return { status: 200, message: "authentication successful" };
    }
    return { status: 201, message: "authentication failed" };
}
module.exports = { createNewOTP, verifyOTP };
