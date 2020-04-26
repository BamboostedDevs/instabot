import { log, randomNumber, doAction } from "../utils";
import config from "../config";
import { areWeBlocked } from ".";
import goHome from "./go_home";

/**
 *
 * @param {Object} page - page instance
 *
 */

async function handleLike(page) {
  log("Handle like");
  const like = await page.$('svg[aria-label="Like"]');
  const likeButton = await page.$(
    "body > div._2dDPU.CkGkG > div.zZYga > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button"
  );
  const user = await page.$(
    "body > div._2dDPU.CkGkG > div.zZYga > div > article > header > div.o-MQd.z8cbW > div.PQo_0.RqtMr > div.e1e1d > a"
  );
  if (like !== null && likeButton !== null && user !== null) {
    await likeButton.click();
    try {
      await page.waitForSelector('svg[aria-label="Unlike"]');
    } catch {
      log("Could't like", true);
      return { error: true };
    }
    if (await areWeBlocked(page)) return { error: true };
    if (!doAction("dont_skip")) {
      const next = await page.$("a.coreSpriteRightPaginationArrow");
      try {
        await next.click();
      } catch {
        log("Cannot click next button while liking", true);
        return { error: true };
      }
      await page.waitFor(randomNumber(1500, 5000));
      const outcome = await handleLike(page);
      if (outcome.error) return { error: true };
      return { error: false };
    }
    await user.click();
    try {
      await page.waitForSelector(
        "#react-root > section > main > div > header > section > div.nZSzR"
      );
    } catch {
      log("Selector", true);
      return { error: true };
    }
    await page.waitFor(randomNumber(1500, 5000));
    const posts = await page.$$('a[href^="/p/"]');
    if (!posts || !Boolean(posts.length)) {
      log("Liked 0 photos due to lack of them");
      return { error: false };
    }
    var likes = randomNumber(0, config.maxLikes - 1);
    await posts[randomNumber(0, posts.length - 1)].click();
    await page.waitFor(randomNumber(1500, 5000));
    for (const post of posts) {
      if (likes <= 0) break;
      try {
        await page.waitForSelector(
          "body > div._2dDPU.CkGkG > div.zZYga > div > article > div.eo2As > div.k_Q0X.NnvRN > a"
        );
      } catch {
        log("Selector", true);
        return { error: true };
      }
      const _like = await page.$('svg[aria-label="Like"]');
      const _likeButton = await page.$(
        "body > div._2dDPU.CkGkG > div.zZYga > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button"
      );
      const next = await page.$("a.coreSpriteRightPaginationArrow");
      if (_like !== null && _likeButton !== null && doAction("like")) {
        try {
          await _likeButton.click();
          await page.waitForSelector('svg[aria-label="Unlike"]');
        } catch {
          log("Couldn't like", true);
        }
        likes -= 1;
        if (await areWeBlocked(page)) return { error: true };
      }
      try {
        await next.click();
      } catch {
        break;
      }
      await page.waitFor(randomNumber(1500, 5000));
    }
    const close = await page.$('svg[aria-label="Close"]');
    if (close !== null) {
      await close.click();
      await page.waitFor(randomNumber(1500, 5000));
    } else {
      log("Couldn't find close button", true);
      return { error: true };
    }
  } else {
    log("Couldn't like this post");
  }
  if ((await goHome(page)).error) return { error: true };
  return { error: false };
}

export default handleLike;
