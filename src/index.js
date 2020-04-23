import puppeteer from "puppeteer";
import config from "./config";
import moment from "moment";
import schedule from "node-schedule";
import { randomNumber, getHistory } from "./utils";
import { login, unfollow, getUsers, takeAction } from "./api";

(async () => {
  console.log("Start", moment().format("HH:mm:ss"));
  const browser = await puppeteer.launch({ headless: config.headless,executablePath: 'chromium-browser' });
  await login(config.auth, browser);
  console.log("Logged in", moment().format("HH:mm:ss"));
  var j = false;
  var users = await getUsers(browser);
  users = [...new Set(users)];
  console.log(`Got ${users.length} users`, moment().format("HH:mm:ss"));
  var history = await getHistory();

  var main = schedule.scheduleJob(`1 * * * *`, function () {
    console.log("Task - main", moment().format("HH:mm:ss"));
    j && j.cancel();
    async function follow() {
      console.log("Follow", moment().format("HH:mm:ss"));
      await takeAction(users[0], browser);
      users.splice(0, 1);
    }
    async function _unfollow(_history) {
      console.log("Unfollow", moment().format("HH:mm:ss"));
      if (
        moment().diff(Number(history[_history[0]]), "hours") >=
        config.keep_follow
      ) {
        await unfollow(_history[0], browser);
        delete history[_history[0]];
      }
    }
    if (config.hours.follow.includes(Number(moment().format("HH")))) {
      console.log("Schedule Follow", moment().format("HH:mm:ss"));
      j = schedule.scheduleJob(
        `${randomNumber(0, 59)} * * * * *`,
        async function () {
          console.log("Task - follow", moment().format("HH:mm:ss"));
          if (users.length > 0) await follow();
          else {
            users = await getUsers(browser);
            users = [...new Set(users)];
            console.log(
              `Got ${users.length} users`,
              moment().format("HH:mm:ss")
            );
            await follow();
          }
        }
      );
    } else {
      console.log("Schedule unfollow", moment().format("HH:mm:ss"));
      j = schedule.scheduleJob(
        `${randomNumber(0, 59)} * * * * *`,
        async function () {
          console.log("Task - unfollow", moment().format("HH:mm:ss"));
          var _history = Object.keys(history);
          if (_history.length > 0) await _unfollow(_history);
          else {
            history = await getHistory();
            await _unfollow(Object.keys(history));
          }
        }
      );
    }
  });
})();
