const makeError = require("http-errors");
function coatError(err) {
  
  if(err.status)
    return err;
  if (err.code===401)
    return new makeError("User with this credintials already exists");
  return new makeError.InternalServerError();
}

module.exports = { makeError, coatError };