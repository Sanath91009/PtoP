const { Router } = require("express");
const {
    HandleUserRegister,
    HandleUserLogin,
    HandleUserLogout,
    HandleOtpVerification,
    HandleOtpGeneration
} = require('../Controllers/Auth/userController');


const authRouter = Router();

authRouter.post("/register", HandleUserRegisterJee);
authRouter.post("/login", HandleUserLogin);
authRouter.get("/logout", HandleUserLogout);


authRouter.post('/login/verify', HandleOtpVerification);
authRouter.post('/login/getotp', HandleOtpGeneration);
authRouter.get('/logout/cf',HandleUserLogout);


 
module.exports = authRouter;

