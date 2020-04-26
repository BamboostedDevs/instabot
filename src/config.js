import dotenv from "dotenv";
dotenv.config();

const config = {
  auth: {
    username: process.env.INSTAGRAM_USERNAME,
    password: process.env.INSTAGRAM_PASSWORD,
  },
  tags: [
    "fff",
    "lfl",
    "ootd",
    "love",
    "fashion",
    "beautiful",
    "animal",
    "friends",
    "summer",
    "holiday",
    "selfie",
    "style",
    "photography",
  ],
  unfollow_hours: [5],
  exceptions: [],
  maxLikes: 4,
  keep_follow: 42,
  headless: false,
  probability: {
    unfollow: 0.4,
    dont_skip: 0.2,
    follow: 0.1,
    like: 0.5,
    scroll: 0.75,
    scroll_home: 0.2,
  },
};

export default config;
