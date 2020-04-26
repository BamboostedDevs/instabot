import { log, randomNumber } from "../utils";

/**
 *
 * @param {Object} page - page instance
 * @param {Object} auth - object containing { username, password }
 *
 */

async function login(page, { username, password }) {
  log("Logging in");
  await page.goto("https://instagram.com/", { timeout: 0 });
  try {
    await page.waitForSelector('input[name="username"]');
  } catch {}

  const usernameInput = await page.$('input[name="username"]');
  const passwordInput = await page.$('input[name="password"]');
  const loginButton = await page.$('button[type="submit"]');

  if (
    usernameInput === null ||
    passwordInput === null ||
    loginButton === null
  ) {
    log("Already logged in");
    return { error: false };
  }

  await usernameInput.type(Array.from(username), {
    delay: randomNumber(100, 500),
  });
  await passwordInput.type(Array.from(password), {
    delay: randomNumber(100, 500),
  });

  await loginButton.click();
  try {
    await page.waitForNavigation();
  } catch {}
  log("Logged in");

  return { error: false };
}

export default login;
