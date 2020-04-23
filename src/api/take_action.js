import config from "../config";
import { memorize } from "../utils";
import moment from "moment";

/**
 *
 * @param {string} user - username
 * @param {Object} browser - browser instance
 *
 * @return {Object}  - { error: true||false }
 *
 */

async function takeAction(user, browser) {
  console.log("Taking action", moment().format("HH:mm:ss"));
  const page = await browser.newPage();
  try {
    await page.goto(`https://instagram.com/${user}/`, {
      waitUntil: "load",
      timeout: 0,
    });
  } catch (error) {
    console.log("Page load error, forwarding");
    return { error: true };
  }
  try {
    const followButton = await page.$(
      "#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button"
    );
    await followButton.click();
    await memorize(user);
  } catch (error) {
    console.log("Follow error, forwarding");
  }
  try {
    const posts = await page.$$('a[href^="/p/"]');
    var likes = config.likes;
    for (const post of posts) {
      if (likes <= 0) return;
      await post.click();
      await page.waitForSelector(
        "body > div._2dDPU.CkGkG > div.zZYga > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button"
      );
      const likeButton = await page.$(
        "body > div._2dDPU.CkGkG > div.zZYga > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button"
      );
      await likeButton.click();
      likes -= 1;
      const closeButton = await page.$(
        "body > div._2dDPU.CkGkG > div.Igw0E.IwRSH.eGOV_._4EzTm.BI4qX.qJPeX.fm1AK.TxciK.yiMZG > button"
      );
      await page.waitFor(500);
      await closeButton.click();
      await page.waitFor(500);
    }
    await page.close();
    return { error: false };
  } catch (error) {
    console.log("Liking error, forwarding");
  }
  return { error: true };
}

export default takeAction;
