import puppeteer from "puppeteer";
import moment from "moment";
import config from "./config";
import {
  secure,
  log,
  getHistory,
  randomNumber,
  doAction,
  scrollWithoutPurpose,
} from "./utils";
import {
  handleNotificationsPopup,
  handleFollow,
  handleLike,
  goToTag,
  login,
  handleUnfollow,
  goHome,
} from "./handlers";

async function takeAction(page) {
  while (true) {
    while (config.unfollow_hours.includes(Number(moment().format("HH")))) {
      const history = await getHistory();
      console.log(history);
      const toUnfollow = Object.keys(history).filter(
        (val) =>
          moment().diff(history[val], "hours") >= config.keep_follow && val
      );
      for (const user of toUnfollow) {
        if (doAction("unfollow")) await secure(handleUnfollow(page, user));
        await page.waitFor(randomNumber(1500, 5000));
      }
      await page.waitFor(randomNumber(1500, 5000));
    }
    while (!config.unfollow_hours.includes(Number(moment().format("HH")))) {
      !(
        (await secure(
          goToTag(page, config.tags[randomNumber(0, config.tags.length - 1)])
        )) &&
        (await secure(handleFollow(page))) &&
        (await secure(handleLike(page)))
      ) && (await goHome(page, true));
      if (doAction("scroll_home")) {
        await goHome(page);
        await scrollWithoutPurpose(randomNumber(10000, 30000), page);
      }
    }
  }
}

(async () => {
  log("Start");
  const browser = await puppeteer.launch({
    userDataDir: "tmp/user-data-dir",
    args: ["--no-sandbox"],
    headless: config.headless,
    // executablePath: "chromium-browser",
  });
  const page = await browser.newPage();
  (await secure(login(page, config.auth))) &&
    (await secure(handleNotificationsPopup(page))) &&
    (await takeAction(page));
})();
