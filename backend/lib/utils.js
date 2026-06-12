import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_KEY;
  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });
  res.cookie("jwt", token, {
    httpOnly: true, // prevents access from JS in browser
    secure: process.env.NODE_ENV === "production", // only use HTTPS in production
    sameSite: "lax", // prevents CSRF attacks but allows cross-port on localhost
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
