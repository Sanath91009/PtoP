const puppeteer = require("puppeteer");
async function startBrowser() {
    let temp;
    try {
        console.log("Opening the browser......");
        temp = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            args: ["--proxy-server='direct://'", "--proxy-bypass-list=*"],
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return temp;
}

module.exports = { startBrowser };
