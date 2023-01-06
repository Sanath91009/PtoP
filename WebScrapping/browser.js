const puppeteer = require("puppeteer");
async function startBrowser() {
    let temp;
    try {
        console.log("Opening the browser......");
        temp = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            executablePath: process.env.CHROMIUM_PATH,
            args: ["--no-sandbox"],
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return temp;
}

module.exports = { startBrowser };
