import config from "../config";
import { flatten } from "../utils";
import moment from "moment";

/**
 *
 * @param {Object} browser - browser instance
 *
 */

async function getPosts(browser) {
  console.log("Get posts", moment().format("HH:mm:ss"));
  var tags = config.tags;
  var posts = [];
  var timeout = 0;
  while (tags.length > 0) {
    const _posts = await Promise.all(
      tags.splice(0, config.concurrency_limit).map(async (val) => {
        const page = await browser.newPage();
        try {
          await page.goto(`https://instagram.com/explore/tags/${val}`, {
            waitUntil: "load",
            timeout: 0,
          });

          const _posts = await page.$$eval('a[href^="/p/"]', (raw) =>
            raw.map((raw) => raw.href)
          );

          page.close();
          return _posts.splice(9);
        } catch (error) {
          timeout += 1;
          try {
            page.close();
          } catch {}
        }
      })
    );
    posts = posts.concat(_posts);
  }
  timeout > 0 && console.log(`Forwarded ${timeout} times due to timeout.`);
  return flatten(posts);
}

export default getPosts;
