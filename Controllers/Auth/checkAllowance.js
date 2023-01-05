const {
    verifyAccessToken,
    AT_DURATION
} = require("../../Helpers/Auth/jwtTokenFactory");
const {
    signAllTokens
} = require("../../Services/Auth/TokenService");


function checkAllowance(req, res, next) {
    console.log("cookies");
    console.log(req.cookies);
    if (req.cookies === undefined) {
        // checking if there is no cookie
        var err = new Error("Not Authorized");
        err.code = 401;
        err.srvMessage = "No Cookies found";
        return next(err);
    } else if (
        // checking if there is no refresh token
        req.cookies.__AT__ === undefined ||
        req.cookies.__AT__ === "" ||
        req.cookies.__AT__ === null
    ) {
        var err = new Error("Login Again");
        err.code = 401;
        err.srvMessage = "Some Cookies not found";
        return next(err);
        
    }
    verifyAccessToken(req.cookies.__AT__)
        .then((data) => {
           req.userData = data;
           next();
        })
        .catch((err) => {
            console.log(err);
            next(err);
        })
}

module.exports = checkAllowance