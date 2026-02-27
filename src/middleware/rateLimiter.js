let ratelimit;
try {
  ratelimit = await import("../config/upstash.js").then(m => m.default);
} catch (error) {
  console.warn("Rate limiter not available:", error.message);
}

const rateLimiter = async (req, res, next) => {
  try {
    // Skip rate limiting if not available
    if (!ratelimit) {
      return next();
    }
    
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
    next(); // Continue even if rate limiting fails
  }
};

export default rateLimiter;
