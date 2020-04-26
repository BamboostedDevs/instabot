import { log, randomNumber } from "../utils";

/**
 *
 * @param {Object} page - page instance
 *
 */

async function handleNotificationsPopup(page) {
  log("Checking for notifications popup");
  const dismiss = await page.$(
    "body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.HoLwm"
  );
  if (dismiss !== null) {
    await dismiss.click();
    log("Dismissed notifications popup");
  }
  await page.waitFor(randomNumber(1500, 5000));
  return { error: false };
}

export default handleNotificationsPopup;
