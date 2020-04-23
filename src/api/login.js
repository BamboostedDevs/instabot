import moment from "moment";

/**
 *
 * @param {Object} auth - object containing { username, password }
 * @param {Object} browser - browser instance
 *
 */

async function login({ username, password }, browser) {
  console.log("Logging in", moment().format("HH:mm:ss"));
  const page = await browser.newPage();
  await page.goto("https://instagram.com/accounts/login");
  await page.waitForSelector('input[name="username"]');

  const usernameInput = await page.$('input[name="username"]');
  const passwordInput = await page.$('input[name="password"]');

  await usernameInput.type(Array.from(username), { delay: 100 });
  await passwordInput.type(Array.from(password), { delay: 100 });

  const loginButton = await page.$('button[type="submit"]');
  await loginButton.click();
  await page.waitFor(2000);
}

export default login;
