 const {
     signAccessToken,
 } = require("../../Helpers/Auth/jwtTokenFactory");


async function signAllTokens(userData) {
    return new Promise(async (resolve, reject) => {
        try {
            var accessToken = await signAccessToken(userData);
            resolve({
                accessToken
            });
        } catch (err) {
            reject(err);
        }
    })

}


module.exports = {
    signAllTokens
};