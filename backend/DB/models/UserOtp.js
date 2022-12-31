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

    // send otp to mail id
    // Set the region
    AWS.config.update({ region: "REGION" });

    // Create sendEmail params
    var params = {
        Destination: {
            ToAddresses: [emailid],
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: "HTML_FORMAT_BODY",
                },
                Text: {
                    Charset: "UTF-8",
                    Data: otp,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "OTP-P2P",
            },
        },
        Source: "sanath303@gmail.com" /* required */,
        ReplyToAddresses: [],
    };

    // Create the promise and SES service object
    var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
        .sendEmail(params)
        .promise();

    // Handle promise's fulfilled/rejected states
    sendPromise
        .then(function (data) {
            console.log(data.MessageId);
        })
        .catch(function (err) {
            console.error(err, err.stack);
        });
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
