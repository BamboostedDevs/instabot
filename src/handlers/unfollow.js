import { log, erase, randomNumber } from "../utils";
import { areWeBlocked, goHome } from ".";

/**
 *
 * @param {Object} page - page instance
 * @param {string} user - username of the target
 *
 */

async function handleUnfollow(page, user) {
  log("Unfollowing @" + user);

  const search = await page.$('input[placeholder="Search"]');
  if (search === null) {
    log("Outdated scrapping - search", true);
    return { error: true };
  }
  await search.type(Array.from("@" + user), { delay: 200 });
  await page.waitFor(randomNumber(1500, 5000));

  try {
    await page.waitForSelector("div.fuqBx");
  } catch {
    log("Cannot use search", true);
    return { error: true };
  }

  const _user = await page.$('a[href="/' + user + '/"]');
  try {
    await _user.click();
    try {
      await page.waitForNavigation();
    } catch {}
  } catch {
    log("Cannot navigate to user @" + user, true);
    return { error: true };
  }
  await page.waitFor(randomNumber(1500, 5000));
  try {
    await page.waitForSelector(
      "#react-root > section > main > div > header > section > div.nZSzR"
    );
  } catch {
    log("Selector", true);
  }

  const unfollow = await page.$('span[aria-label="Following"]');

  if (unfollow === null) {
    log("User already unfollowed, or an error in scrapping occured", true);
    return { error: false };
  }

  const unfollowButton = await page.$(
    "#react-root > section > main > div > header > section > div.nZSzR > div.Igw0E.IwRSH.eGOV_._4EzTm > span > span.vBF20._1OSdk > button"
  );

  if (unfollowButton === null) {
    log("An error in scrapping occured - unfollow", true);
    return { error: true };
  }

  await unfollowButton.click();
  if (await areWeBlocked(page)) return { error: true };

  const unfollowConfirmation = await page.$(
    "body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_"
  );
  if (unfollowConfirmation === null) {
    log("No confirmation in unfollowing", true);
    return { error: true };
  }
  await unfollowConfirmation.click();
  if (await areWeBlocked(page)) return { error: true };

  await erase(user);

  if ((await goHome(page)).error) return { error: true };
  return { error: false };
}

export default handleUnfollow;
