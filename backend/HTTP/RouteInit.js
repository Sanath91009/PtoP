const authRouter = require("../Routes/authRoute");
const eventRouter = require("../Routes/eventsRoute.js");
const initDatabase = require('../DB/init');

function routeInit(app)
{
    initDatabase()
    .then(console.log)
    .catch(console.error);
    app.use('/',authRouter)
    app.use('/events', eventRouter);
}

module.exports = routeInit;