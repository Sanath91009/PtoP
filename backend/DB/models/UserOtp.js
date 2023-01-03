const otpGenerator = require("otp-generator");
const crypto = require("crypto");
var AWS = require("aws-sdk");
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
    console.log("data : ", data);
    // send otp to mail id

    // var params = {
    //     Destination: {
    //         ToAddresses: [emailid],
    //     },
    //     Message: {
    //         Body: {
    //             Html: {
    //                 Charset: "UTF-8",
    //                 Data: "HTML_FORMAT_BODY",
    //             },
    //             Text: {
    //                 Charset: "UTF-8",
    //                 Data: "otp : " + otp,
    //             },
    //         },
    //         Subject: {
    //             Charset: "UTF-8",
    //             Data: "OTP",
    //         },
    //     },
    //     Source: "peertopeer303@gmail.com",
    // };

    // var sendPromise = SES.sendEmail(params).promise();

    // sendPromise
    //     .then(function (data) {
    //         console.log(data.MessageId);
    //     })
    //     .catch(function (err) {
    //         console.error(err, err.stack);
    //     });
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
