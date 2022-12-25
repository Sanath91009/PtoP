const { Router } = require("express");
const {
    HandleUserLogin,
    HandleUserLogout,
    HandleOtpVerification,
    HandleOtpGeneration,
    getHandlesInfoController,
} = require("../Controllers/Auth/userController");

const authRouter = Router();

authRouter.post("/login", HandleUserLogin);
authRouter.get("/logout", HandleUserLogout);

authRouter.post("/register/verifyOtp", HandleOtpVerification);
authRouter.post("/register/generateOtp", HandleOtpGeneration);
authRouter.get("/getHandlesInfo", getHandlesInfoController);

module.exports = authRouter;
