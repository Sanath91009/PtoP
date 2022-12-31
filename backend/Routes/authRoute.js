const { Router } = require("express");
const {
    HandleUserLogin,
    HandleUserLogout,
    HandleOtpVerification,
    HandleOtpGeneration,
    getHandlesInfoController,
    authenticateCodeforcesContoller,
    AuthenticateCodechefController,
} = require("../Controllers/Auth/userController");

const authRouter = Router();

authRouter.post("/login", HandleUserLogin);
authRouter.get("/logout", HandleUserLogout);
authRouter.get("/checkUserCodeChef", AuthenticateCodechefController);
authRouter.post("/register/verifyOtp", HandleOtpVerification);
authRouter.post("/register/generateOtp", HandleOtpGeneration);
authRouter.get("/getHandlesInfo", getHandlesInfoController);
authRouter.post("/auth/codeforces", authenticateCodeforcesContoller);
module.exports = authRouter;
