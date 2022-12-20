require("dotenv").config();

class ConfClass {
  constructor(conf) {
    this.conf = conf;
  }
  getString() {
    return this.conf;
  }
  getNumber() {
    return Number(this.conf);
  }
  getBoolean() {
    return this.conf === "true";
  }
}
function getConf(key) {
  if (typeof process.env[key] === "undefined") {
    console.log(`Environment variable ${key} is not set.`);
    return undefined;
  }
  return new ConfClass(String(process.env[key]));
}

const Conf = {
  primaryInfo: {
    isDevMode: !((getConf("NODE_ENV")?.getString() || "") === "production"),
    forWeb: getConf("IS_WEB")?.getBoolean() || false,
    serverPort: process.env.PORT || 1337,
  },
  connectivity: {
    redisPort: getConf("REDIS_PORT")?.getNumber() || 6379,
    redisHost: getConf("REDIS_HOST")?.getString() || "localhost",
  },
};

module.exports  = Conf;
