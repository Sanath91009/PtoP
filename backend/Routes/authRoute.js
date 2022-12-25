const {Router} = require('express');
const { 
    HandleUserRegister,
    HandleUserLogin,
    HandleUserLogout,
    HandleOtpVerification,
    HandleOtpGeneration
} = require('../Controllers/Auth/userController');

const authRouter = Router();


authRouter.post('/register/cf',HandleUserRegister);
authRouter.post('/login/cf', HandleUserLogin);
authRouter.post('/login/verify', HandleOtpVerification);
authRouter.post('/login/getotp', HandleOtpGeneration);
authRouter.get('/logout/cf',HandleUserLogout);

// authRouter.post('/register/jee',HandleUserRegisterJee);
// authRouter.post('/login/jee',HandleUserLogin);
// authRouter.get('/logout/jee',HandleUserLogout);
 
module.exports = authRouter;