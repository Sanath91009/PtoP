// import { authenticator } from 'otplib';
const {authenticator} = require('otplib');
function generateOtp() {
    const secret = authenticator.generateSecret();
    const token = authenticator.generate(secret);
    return token;
}
module.exports = {
    generateOtp
}