import { log, randomNumber } from "../utils";

/**
 *
 * @param {Object} page - page instance
 * @param {Boolean} force - should force redirect
 *
 */

async function goHome(page, force = false) {
  if (force) {
    log("Force returning to home page");
    await page.goto("https://instagram.com/");
    await page.waitFor(randomNumber(1500, 5000));
    if ((await viewActivity(page)).error) return { error: true };
    return { error: false };
  }
  log("Returning to home page");
  const home = await page.$('a[href="/"]');
  if (home !== null) {
    await home.click();
  } else {
    log("Couldn't find home button", true);
    return { error: true };
  }
  try {
    await page.waitForNavigation();
  } catch {}
  await page.waitFor(randomNumber(1500, 5000));
  if ((await viewActivity(page)).error) return { error: true };
  return { error: false };
}

export default goHome;
