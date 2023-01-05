const authRouter = require("../Routes/authRoute");
const eventRouter = require("../Routes/eventsRoute.js");
const middleware = require("../middleware");
const initDatabase = require("../DB/init");
const roomRouter = require("../Routes/roomRoute");

function routeInit(app) {
    initDatabase().then(console.log).catch(console.error);
    app.use(middleware.verify);
    app.use("/", authRouter);
    app.use("/", eventRouter);
    app.use("/room", roomRouter);
}

module.exports = routeInit;
