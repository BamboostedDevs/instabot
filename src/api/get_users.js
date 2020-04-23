import config from "../config";
import moment from "moment";
import getPosts from "./get_posts";

/**
 *
 * @param {Array.<string>} posts - list of posts (urls) to extract users from
 * @param {Object} browser - browser instance
 *
 */

async function getUsers(browser) {
  console.log("Get users", moment().format("HH:mm:ss"));
  var posts = await getPosts(browser);
  console.log(`Got ${posts.length} posts`, moment().format("HH:mm:ss"));
  var users = [];
  var timeout = 0;
  while (posts.length > 0) {
    const _users = await Promise.all(
      posts.splice(0, config.concurrency_limit).map(async (val) => {
        const page = await browser.newPage();
        try {
          await page.goto(val, {
            waitUntil: "load",
            timeout: 0,
          });
          await page.waitForSelector(
            "#react-root > section > main > div > div > article > header > div.o-MQd.z8cbW > div.PQo_0.RqtMr > div.e1e1d > a"
          );
          if (
            (await page.$(
              "#react-root > section > main > div > div > article > header > div.o-MQd.z8cbW > div.PQo_0.RqtMr > div.bY2yH > button"
            )) !== null
          ) {
            var user = await page.$eval(
              "#react-root > section > main > div > div > article > header > div.o-MQd.z8cbW > div.PQo_0.RqtMr > div.e1e1d > a",
              (raw) => raw.textContent
            );
            if (!config.exceptions.includes(user)) {
              page.close();
              return user;
            }
          }
          page.close();
        } catch (error) {
          timeout += 1;
          try {
            page.close();
          } catch {}
        }
      })
    );
    users = users.concat(_users);
  }
  timeout > 0 && console.log(`Forwarded ${timeout} times due to timeout.`);
  return users;
}

export default getUsers;
