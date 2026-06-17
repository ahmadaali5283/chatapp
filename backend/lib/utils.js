import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const jwtSecret = process.env.JWT_SECRET || process.env.JWT_KEY;
  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });

  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isProduction,           // HTTPS only in production
    sameSite: isProduction ? "none" : "lax", // "none" required for cross-domain (Railway ↔ Vercel)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
