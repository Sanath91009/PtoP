const jwt = require("jsonwebtoken");
const { getUser } = require("./DB/models/User");
const tokenSecret = process.env.AT_SECRET_KEY;

exports.verify = async (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, tokenSecret, async (err, value) => {
            if (err) {
                res.status(500).json({ error: "failed to authenticate token" });
                next(err);
            } else if (!value.username) {
                value["auth"] = false;
            } else {
                const res = await getUser(value.username);
                if (res) {
                    value["auth"] = true;
                    if (res.admin == true) {
                        value["admin"] = true;
                    } else {
                        value["admin"] = false;
                    }
                } else {
                    value["auth"] = false;
                    value["admin"] = false;
                }
            }
            req.user = value;
            req.err = err;
            next();
        });
    } else next();
};
