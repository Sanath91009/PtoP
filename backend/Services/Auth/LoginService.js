// const {
//   KVSet,KVGet
// } = require("../../DB/KVStore");
const {
  verifyRefreshToken
} = require("./../../Helpers/Auth/jwtTokenFactory");
const {
  signAllTokens
} = require("./TokenService");
const {
  AT_DURATION
} = require('../../Helpers/Auth/jwtTokenFactory');
const {
  getUser
} = require('../../DB/models/User');

// //if already logged in resolves payload else rejects
function checkIfLogin(refreshToken) {
  return new Promise((resolve, reject) => {
    verifyAccessToken(refreshToken)
      .then(async (payload) => {
           resolve(refereshToken);
         })
      .catch((err) => {
        reject(err);
      });
  });
}


//if login is successful it sets the cookie and resolves the payload(user data) else rejects the error
function performLogin(res,username, password) {
  return new Promise(async (resolve, reject) => {
    console.log(username);
    const data = await getUser(username);
    if (data !== null && password === data.password) {
          try {
            const token = await signAllTokens(data);
            res.cookie('__AT__', token, {
              maxAge: AT_DURATION.msformat,
              httpOnly: true,
              sameSite: 'strict'
            })
            resolve(token);

          } catch (err) {
            reject(err);
          }
        } else {
          var err = new Error("Invalid Credentials");
          err.code = 401;
          err.srvMessage = err.message;
          reject(err);
        }
      })
     
  }

//add the refresh token to redis
function performLogout(accessToken, userData) {
  res.clearCookie('__AT__');
}

module.exports = {
  checkIfLogin,
  performLogin,
  performLogout
};