const jwt = require('jsonwebtoken');

const AT_DURATION = {
    msformat : 1000*60*15,
    AT_SECRET_KEY:"BWEF&*hbiy&(&*)njhinu"
};



//creates and resolves token if token is valid else rejects error
function createToken(payload, secret , options ) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, options, (err, token) => {
            if(err){
                err.srvMessage = "Error in token creation";
                reject(err);
            }
            resolve(token);
        })
    })
}


//creates and resolves token if token is valid else rejects error
function signAccessToken ( userData ) {
    const  payload = {
        username : userData.username,
        email : userData.email_id,
    }
    const secret = AT_DURATION.AT_SECRET_KEY;
    const options = {
        expiresIn : AT_DURATION.msformat,
        issuer : 'hackathon', 
    }

    return createToken(payload, secret, options);

}

//verifies and resolves payload if token is valid else rejects error
function verifyAccessToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, AT_DURATION.AT_SECRET_KEY, (err, payload) => {
            if(err) {
                console.log("some error in verifying token")
                err.code = 404;
                err.srvMessage = "Access Token Not Valid";
                reject(err);
            }
            resolve(payload);
        })
    })
}


module.exports = {
    signAccessToken, 
    verifyAccessToken, 
    AT_DURATION
};