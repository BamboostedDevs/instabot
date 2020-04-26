import { log, randomNumber } from "../utils";

/**
 *
 * @param {Object} page - page instance
 *
 */

async function viewActivity(page) {
  log("Checking for notifications");
  const freshActivity = await page.$(".H9zXO");
  if (freshActivity !== null) {
    const activity = await page.$('a[href="/accounts/activity/"]');
    try {
      await activity.click();
    } catch {
      log("Cannot click activity", true);
      return { error: true };
    }
    await page.waitFor(randomNumber(1500, 5000));
    const _activity = await page.$('a[href="/accounts/activity/"]');
    try {
      await _activity.click();
    } catch {
      log("Cannot click activity", true);
      return { error: true };
    }
  } else {
    log("No fresh activity");
  }
  await page.waitFor(randomNumber(1500, 5000));
  return { error: false };
}

export default viewActivity;
