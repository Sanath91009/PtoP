const {
    createUser,
    getUser,
    getHandlesInfo,
    addHandleInfo,
} = require("../../DB/models/User.js");

const {
    checkIfLogin,
    performLogin,
} = require("../../Services/Auth/LoginService");

const { haveCodeforces } = require("../../Helpers/Auth/codeforces");

const { createNewOTP, verifyOTP } = require("../../DB/models/UserOtp.js");
const { checkUser } = require("../../WebScrapping/codechef.js");

function HandleUserLogin(req, res, next) {
    checkIfLogin(req.cookies.__AT__)
        .then((token) => {
            res.send({ code: 200, token });
        })
        .catch((err) => {
            performLogin(res, req.body.username, req.body.password)
                .then((token) => {
                    res.status(200);
                    res.send({ code: 200, token });
                })
                .catch((err) => {
                    next(err);
                });
        });
}

async function HandleUserLogout(req, res, next) {
    console.log("Into Handle user LogOut");
    console.log(req.cookies);
    res.clearCookie("__AT__", { sameSite: "none", secure: true });
    res.send({ code: 200, message: "Logged out successfully" });
    console.log("User Logged out");
}

async function HandleOtpGeneration(req, res, next) {
    const { emailid } = req.body;
    try {
        const data = await createNewOTP(emailid);
        res.send({ code: 200, message: "generated successfully", hash: data });
    } catch (err) {
        next(err);
    }
}

async function HandleOtpVerification(req, res, next) {
    const { otp, addInfo, username, hash } = req.body;
    console.log("otp: ", otp, addInfo);
    try {
        const { emailid, pwd } = addInfo;
        const { status, message } = await verifyOTP(emailid, hash, otp);
        console.log("message : ", message);
        if (status == 200) {
            if (addInfo.type == "registration") {
                const result = await getUser(username);
                if (result != undefined && result != null) {
                    res.send({ code: 400, message: "User already registered" });
                } else {
                    const color = await createUser(username, emailid, pwd);
                    performLogin(res, username, pwd)
                        .then((token) => {
                            res.send({
                                code: 200,
                                message: "verified and user created",
                                color: color,
                                token: token,
                            });
                        })
                        .catch((err) => {
                            next(err);
                        });
                }
            } else {
                const { handle, section, emailid } = addInfo;
                console.log("handle : ", handle, emailid);
                if (section == "codeforces") {
                    haveCodeforces(handle, emailid)
                        .then(async (data) => {
                            console.log("data : ", data);
                            if (data.code == 200) {
                                await addHandleInfo(
                                    username,
                                    handle,
                                    "codeforces"
                                );
                            }
                            res.send(data);
                        })
                        .catch((err) => {
                            res.send({
                                data: 404,
                                message: "codeforces site is down",
                            });
                            next(err);
                        });
                } else if (section == "atcoder") {
                } else if ((section = "leetcode")) {
                }
            }
        } else {
            res.send({ code: status, message: message });
        }
    } catch (err) {
        next(err);
    }
}
async function AuthenticateCodechefController(req, res, next) {
    const handle = req.query.handle;
    const fullName = req.query.fullName;
    const username = req.query.username;
    try {
        const data = await checkUser(handle, fullName);
        if (data) {
            res.send({ code: 200, message: "user authenticated" });
            await addHandleInfo(username, handle, "codechef");
        } else {
            res.send({ code: 201, message: "User not authenticated" });
        }
    } catch (err) {
        next(err);
    }
}
async function authenticateCodeforcesContoller(req, res, next) {
    const { username, handle, emailid } = req.body;
    haveCodeforces(handle, emailid)
        .then(async (data) => {
            res.send(data);
            if (data.code == 200) {
                await addHandleInfo(username, handle, "codeforces");
            }
        })
        .catch((err) => next(err));
}
async function getHandlesInfoController(req, res, next) {
    const { username } = req.query;
    try {
        const data = await getHandlesInfo(username);
        res.send({ code: 200, data: data });
    } catch (err) {
        next(err);
    }
}
module.exports = {
    HandleUserLogin,
    HandleUserLogout,
    HandleOtpVerification,
    HandleOtpGeneration,
    getHandlesInfoController,
    authenticateCodeforcesContoller,
    AuthenticateCodechefController,
};
