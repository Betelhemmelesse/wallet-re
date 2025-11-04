import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // in real world applications you should put the userId or ipadress as your key
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res
        .status(429)
        .json({ message: "too many request, please try again later" });
    }

    next();
  } catch (error) {
    console.log("rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
