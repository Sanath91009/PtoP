const axios = require("axios");
const { JSDOM } = require("jsdom");
async function checkUser(handle, fullName) {
    console.log("hello : ", browser);
    const endpoint = `https://www.codechef.com/users/${handle}`;
    const temp1 = Date.now();
    await page.goto(endpoint);
    const fullNameInSite = await page.evaluate(() => {
        return document.querySelector(".h2-style").innerHTML;
    });
    console.log("temp : ", temp1 - Date.now());
    if (fullNameInSite == fullName) return true;
    return false;
}

async function getUserRating(handle) {
    const endpoint = `https://www.codechef.com/users/${handle}`;
    await page.goto(endpoint);
    const rating = await page.evaluate(() => {
        return document.querySelector(".rating-number").innerHTML;
    });
    return rating;
}

async function getUserResult(contestID, handle) {
    const endpoint = `https://www.codechef.com/rankings/${contestID}?itemsPerPage=100&order=asc&page=1&search=${handle}&sortBy=rank`;
    try {
        const tick = Date.now();
        console.log("enpoint : ", endpoint);
        await page.goto(endpoint, {
            waitUntil: "networkidle0",
        });
        const values_part1 = await page.$$eval(
            "div[class^='_scored-problems']",
            (tags) => {
                return tags.map((tag) => {
                    if (tag.innerHTML != "-") {
                        return tag.querySelector(`a`).innerHTML;
                    }
                    return tag.innerHTML;
                });
            }
        );
        if (values_part1.length == 0) return null;
        const buttons = await page.$$("button[class*='_scroll__button']");
        console.log(buttons[1]);
        await buttons[1].evaluate((b) => b.click());
        const values_part2 = await page.$$eval(
            "div[class^='_scored-problems']",
            (tags) => {
                return tags.map((tag) => {
                    if (tag.innerHTML != "-") {
                        return tag.querySelector(`a`).innerHTML;
                    }
                    return tag.innerHTML;
                });
            }
        );
        const result = values_part1.concat(values_part2);
        console.log("time taken : ", Date.now() - tick);
        return result;
    } catch (err) {
        console.log("error : ", err, "error");
        return null;
    }
}

module.exports = { checkUser, getUserResult, getUserRating };
