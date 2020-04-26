import fs from "fs";
import moment from "moment";
import config from "../config";

const scrollToPosition = {
  top: (window) => {
    window.scrollTo(0, 0);
    return true;
  },
  bottom: (window) => {
    const { height } = getDocumentDimensions();

    window.scrollTo(0, height);
    return true;
  },
};

/**
 *
 * @param {Number} ms - how long to scroll in [ms]
 * @param {Object} page - page instance
 *
 */
async function scrollWithoutPurpose(ms, page) {
  log("Scrolling without purpose");
  const end = Date.now() + ms;
  while (end > Date.now()) {
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * Math.random());
    });
    await page.waitFor(randomNumber(750, 5000));
  }
}

/**
 *
 * @param {Number} times - how many times to scroll
 * @param {Object} window - window object
 * @param {string} [direction=bottom] - direction
 *
 * @return {boolean}
 *
 */

const scrollPageTimes = async ({ times = 0, window, direction = "bottom" }) => {
  if (!times || times < 1) {
    return true;
  }

  await new Array(times).fill(0).reduce(async (prev) => {
    await prev;
    scrollToPosition[direction](window);
    await waitFor(2000);
  }, Promise.resolve());

  return true;
};

/**
 *
 * @param {Array.<Array>} arr - array of arrays
 *
 * @return {Array} - flattened array
 *
 */

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, []);
}

/**
 *
 * @param {Number} ms - time to sleep in [ms]
 *
 */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 *
 * @param {string} user - username
 *
 */

async function memorize(user) {
  var _users = { [user]: Date.now() };
  await fs.readFile("tmp/history.json", "utf8", async (err, jsonString) => {
    if (err) {
      log("Error reading file", true);
      return;
    }
    try {
      const users = JSON.parse(jsonString);
      _users = { ...users, ..._users };
      await fs.writeFile("tmp/history.json", JSON.stringify(_users), (err) => {
        if (err) log("Error writing file", true);
      });
    } catch (err) {
      log("Error parsing JSON", true);
    }
  });
}

/**
 *
 * @param {string} user - username
 *
 */

async function erase(user) {
  await fs.readFile("tmp/history.json", "utf8", async (err, jsonString) => {
    if (err) {
      log("Error reading file", true);
      return;
    }
    try {
      const users = JSON.parse(jsonString);
      users.hasOwnProperty(user)
        ? delete users[user]
        : log("User does not exist", true);
      await fs.writeFile("tmp/history.json", JSON.stringify(users), (err) => {
        if (err) log("Error writing file", true);
      });
    } catch (err) {
      log("Error parsing JSON", true);
    }
  });
}

/**
 *
 * @return {(Object|false)} - history or false (when error)
 *
 */

async function getHistory() {
  try {
    const jsonString = await fs.promises.readFile("tmp/errors.json", "utf8");
    const users = await JSON.parse(jsonString);
    if (!users) throw "Error loading file";
    return users;
  } catch {
    log("Error loading history", true);
  }
  return false;
}

/**
 *
 * @param {Number} min - minimum of range
 * @param {Number} max - maximum of range
 *
 * @return {number} - random number in range
 *
 */

const randomNumber = (min, max) =>
  Math.round(Math.random() * (max - min) + min);

/**
 *
 * @param {string} message - message of log
 * @param {Boolean} [error=false] - error presence
 *
 */

function log(message, error = false) {
  console.log(!error, moment().format("HH:mm:ss"), message);
  if (error) {
    fs.readFile("tmp/errors.json", "utf8", async (err, jsonString) => {
      if (err) {
        log("Error reading file", true);
        return;
      }
      try {
        var errors = JSON.parse(jsonString);
        if (errors.hasOwnProperty(message))
          errors[message].push(moment().format("HH:mm:ss DD.MM"));
        else {
          errors = {
            ...errors,
            ...{ [message]: [moment().format("HH:mm:ss DD.MM")] },
          };
        }
        await fs.writeFile("tmp/errors.json", JSON.stringify(errors), (err) => {
          if (err) log("Error writing file", true);
        });
      } catch (err) {
        console.log(err);
        log("Error parsing JSON", true);
      }
    });
  }
}

async function secure(promise) {
  const response = await promise;
  if (response.error) return false;
  return true;
}

function doAction(key) {
  var random = Math.random();
  if (random < config.probability[key]) {
    return true;
  } else {
    return false;
  }
}

export {
  scrollPageTimes,
  flatten,
  sleep,
  memorize,
  erase,
  randomNumber,
  getHistory,
  log,
  secure,
  doAction,
  scrollWithoutPurpose,
};
