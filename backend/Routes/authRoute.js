const { Router } = require("express");
const {
    HandleUserRegister,
    HandleUserLogin,
    HandleUserLogout,
    HandleUserRegisterJee,
} = require("../Controllers/Auth/userController");

const authRouter = Router();

authRouter.post("/register", HandleUserRegisterJee);
authRouter.post("/login", HandleUserLogin);
authRouter.get("/logout", HandleUserLogout);

module.exports = authRouter;
