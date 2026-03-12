import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: '7d' });
  res.cookie("jwt", token, {
    httpOnly: true, // prevents access from JS in browser
    secure: process.env.NODE_ENV !== "development", // use HTTPS in production
    sameSite: "strict", // prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
