import { erase } from "../utils";
import moment from "moment";

/**
 *
 * @param {string} user - username
 * @param {Object} browser - browser instance
 *
 */

async function unfollow(user, browser) {
  console.log("Unfollowing", moment().format("HH:mm:ss"));
  try {
    const page = await browser.newPage();
    await page.goto(`https://instagram.com/${user}/`, {
      waitUntil: "load",
      timeout: 0,
    });
  } catch (error) {
    console.log(error);
    return;
  }
  try {
    await page.waitForSelector(
      "#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button"
    );
    const unfollowButton = await page.$(
      "#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button"
    );
    await unfollowButton.click();
    await page.waitForSelector(
      "body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_"
    );
    const confirmationButton = await page.$(
      "body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_"
    );
    await confirmationButton.click();
    await erase(user);
  } catch (error) {
    console.log(error);
  }
}

export default unfollow;
