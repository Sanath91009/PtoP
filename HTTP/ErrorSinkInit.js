const { makeError, coatError } = require("../Helpers/ErrorHandling/MakeError");

function SinkErrorFor(app) {

  app.use((req, res, next) => {
    next(new makeError.NotFound());
  });

  app.use((err, req, res, next) => {
    console.log(err.srvMessage);
    console.log(err.stack);
    // err = coatError(err);
    // res.status(err.code || 500);

    res.send({
      code: err.code,
      message: err.message,
    });
  });
}

module.exports = SinkErrorFor