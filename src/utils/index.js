import fs from "fs";

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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 *
 * @param {string} user - username
 *
 */

async function memorize(user) {
  var _users = { [user]: Date.now() };
  await fs.readFile("src/history.json", "utf8", async (err, jsonString) => {
    if (err) {
      console.log("Error reading file", err);
      return;
    }
    try {
      const users = JSON.parse(jsonString);
      _users = { ...users, ..._users };
      await fs.writeFile("src/history.json", JSON.stringify(_users), (err) => {
        if (err) console.log("Error writing file", err);
      });
    } catch (err) {
      console.log("Error parsing JSON:", err);
    }
  });
}

/**
 *
 * @param {string} user - username
 *
 */

async function erase(user) {
  await fs.readFile("src/history.json", "utf8", async (err, jsonString) => {
    if (err) {
      console.log("Error reading file", err);
      return;
    }
    try {
      const users = JSON.parse(jsonString);
      users.hasOwnProperty(user)
        ? delete users[user]
        : console.log("User does not exist");
      await fs.writeFile("src/history.json", JSON.stringify(users), (err) => {
        if (err) console.log("Error writing file", err);
      });
    } catch (err) {
      console.log("Error parsing JSON:", err);
    }
  });
}

/**
 *
 * @return {(Object|false)} - history or false (when error)
 *
 */

async function getHistory() {
  await fs.readFile("src/history.json", "utf8", async (err, jsonString) => {
    if (err) {
      console.log("Error reading file", err);
      return false;
    }
    try {
      const users = JSON.parse(jsonString);
      return users;
    } catch (error) {
      console.log(error);
    }
    return false;
  });
}

/**
 *
 * @param {Number} min - minimum of range
 * @param {Number} max - maximum of range
 *
 * @return {number} - random number in range
 *
 */

function randomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

export {
  scrollPageTimes,
  flatten,
  sleep,
  memorize,
  erase,
  randomNumber,
  getHistory,
};
