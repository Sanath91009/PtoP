const express = require("express");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

function ServerInit(conf) {
    const app = express();
    app.use(cors({ credentials: true, origin: true }));
    app.use(xss());
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(morgan("combined"));

    app.use((req, res, next) => {
        res.setHeader("X-Powered-By", "Java Spring");
        next();
    });

    app.enable("trust proxy");
    app.use(express.json({ extended: true }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    console.log(
        conf.primaryInfo.isDevMode
            ? "Configured in Dev Mode"
            : "Configure in Production Mode"
    );
    // app.set('port', process.env.PORT || 5000);
    // console.log("++++++++++++++++" + app.get('port'));
    app.set("port", conf.primaryInfo.serverPort);
    const server = app.listen(app.get("port"), () => {
        console.log(
            `Server is listening on Port ${conf.primaryInfo.serverPort}`
        );
    });
    app.use(express.static("../../frontend/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
    app.use("/", (req, res, next) => {
        console.log(req.method);
        console.log(req.url);
        next();
    });
    return { app: app, server: server };
}

module.exports = ServerInit;
