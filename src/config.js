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
  hours: {
    follow: [3, 4, 5, 11, 12, 13, 14, 17, 18, 19, 21, 22, 23],
    unfollow: [0, 1, 2, 6, 7, 8, 9, 10, 15, 16, 20],
  },
  exceptions: [],
  likes: 4,
  keep_follow: 48,
  concurrency_limit: 25,
  headless: true,
};

export default config;
