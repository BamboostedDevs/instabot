import { log } from "../utils";

/**
 *
 * @param {Object} page - page instance
 *
 */

async function areWeBlocked(page) {
  await page.waitFor(2500);
  const blocked = await page.$("h3._7UhW9.LjQVu.qyrsm.KV-D4.uL8Hv");
  if (blocked !== null) {
    log("We are blocked", true);
    const report = await page.$("button.aOOlW.bIiDR");
    if (report !== null) await report.click();
    return true;
  }
  return false;
}

export default areWeBlocked;
