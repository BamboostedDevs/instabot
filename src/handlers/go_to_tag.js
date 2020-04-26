import { log, randomNumber, doAction, scrollWithoutPurpose } from "../utils";
import viewActivity from "./view_activity";

/**
 *
 * @param {Object} page - page instance
 * @param {string} tag - hashtag to mess with
 *
 */

async function goToTag(page, tag) {
  log("Going to #" + tag);
  const search = await page.$('input[placeholder="Search"]');
  if (search === null) {
    log("Outdated scrapping - search", true);
    return { error: true };
  }
  await search.type(Array.from("#" + tag), { delay: randomNumber(100, 600) });
  await page.waitFor(randomNumber(1500, 5000));

  try {
    await page.waitForSelector("div.fuqBx");
  } catch {
    log("Cannot use search", true);
    return { error: true };
  }

  const _tag = await page.$('a[href="/explore/tags/' + tag + '/"]');
  try {
    await _tag.click();
    try {
      await page.waitForNavigation();
    } catch {}
  } catch {
    log("Cannot navigate to tag #" + tag, true);
    return { error: true };
  }
  await page.waitFor(randomNumber(1500, 5000));
  try {
    await page.waitForSelector(
      "#react-root > section > main > header > div.WSpok > div.f7QXd.HfISj > div.Igw0E.rBNOH.CcYR1.ybXk5._4EzTm._22l1 > h1"
    );
  } catch {
    log("Selector", true);
    return { error: true };
  }
  if ((await viewActivity(page)).error) return { error: true };
  if (doAction("scroll")) {
    await scrollWithoutPurpose(randomNumber(10000, 30000), page);
  }

  return { error: false };
}

export default goToTag;
