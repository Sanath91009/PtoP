const {
    createUser,
    getUser,
    getHandlesInfo,
    addHandlesInfo,
} = require("../../DB/models/User.js");

const {
    checkIfLogin,
    performLogin,
} = require("../../Services/Auth/LoginService");

const { haveCodeforces } = require("../../Helpers/Auth/codeforces");

const {
    getUserOtp,
    createUserOtp,
    verifyUserOtp,
    deleteUserOtp,
} = require("../../DB/models/UserOtp.js");

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
    const { username } = req.body;
    console.log("username ", username);
    try {
        const data = await createUserOtp(username);
        res.send({ code: 200, message: "generated successfully" });
    } catch (err) {
        next(err);
    }
}

async function HandleOtpVerification(req, res, next) {
    const { username, otp, addInfo } = req.body;
    console.log("otp: ", otp);
    try {
        const { status, message } = await verifyUserOtp(username, otp);
        if (status == 200) {
            await deleteUserOtp(username);
            if (addInfo.type == "registration") {
                const { emailID, pwd } = addInfo;
                const result = await getUser(username);
                if (result != undefined && result != null) {
                    res.send({ code: 400, message: "User already registered" });
                } else {
                    const color = await createUser(username, emailID, pwd);
                    performLogin(res, username, password)
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
                const { handle, section } = addInfo;
                await addHandlesInfo(username, handle, section);
                res.send({ code: 200, message: "verified" });
            }
        } else {
            res.send({ code: 400, message: message });
        }
    } catch (err) {
        next(err);
    }
}
async function getHandlesInfoController(req, res, next) {
    const { username } = req.query.username;
    try {
        const data = await getHandlesInfo(username);
        res.send({ code: 200, data: data });
    } catch (err) {
        next(err);
    }
}
module.exports = {
    HandleUserLogin,
    HandleUserRegister,
    HandleUserRegisterJee,
    HandleUserLogout,
    HandleOtpVerification,
    HandleOtpGeneration,
    getHandlesInfoController,
};
