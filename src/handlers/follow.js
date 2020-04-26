import { log, memorize, randomNumber, doAction } from "../utils";
import { areWeBlocked } from ".";
import config from "../config";

/**
 *
 * @param {Object} page - page instance
 *
 */

async function handleFollow(page) {
  log("Handle Follow");
  const posts = await page.$$('a[href^="/p/"]');
  await posts[randomNumber(9, 11)].click();
  await page.waitFor(randomNumber(1500, 5000));

  const follow = await page.$(
    "body > div._2dDPU.CkGkG > div.zZYga > div > article > header > div.o-MQd.z8cbW > div.PQo_0.RqtMr > div.bY2yH > button"
  );
  const user = await page.$(
    "body > div._2dDPU.CkGkG > div.zZYga > div > article > header > div.o-MQd.z8cbW > div.PQo_0.RqtMr > div.e1e1d > a"
  );
  if (user === null) {
    log("Cannot find username selector", true);
    return { error: true };
  }
  const _user = await (await user.getProperty("textContent")).jsonValue();

  if (
    follow !== null &&
    (await (await follow.getProperty("textContent")).jsonValue()) == "Follow" &&
    !config.exceptions.includes(_user) &&
    doAction("dont_skip")
  ) {
    if (doAction("follow")) {
      await follow.click();
      if (await areWeBlocked(page)) return { error: true };
      await memorize(_user);
      log("Followed @" + _user);
    }
  } else {
    const next = await page.$("a.coreSpriteRightPaginationArrow");
    try {
      await next.click();
    } catch {
      log("Cannot click next button while following", true);
      return { error: true };
    }
    await page.waitFor(randomNumber(1500, 5000));
    const outcome = await handleFollow(page);
    if (outcome.error) return { error: true };
  }
  return { error: false };
}

export default handleFollow;
