import jwt from "jsonwebtoken";
import User from "../models/users.js";
export const protectRoute = async (req, res, next) => {
  try {
    // ✅ Step 1: Get the token from cookies
    const token = req.cookies.jwt;
    // ✅ Step 2: Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    // ✅ Step 3: Verify the token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // ✅ Step 4: Find user by ID (decoded from token)
      const user = await User.findById(decoded.userId).select("-password");
      //password woont be sent or selected
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // ✅ Step 5: Attach user to request and continue
    req.user = user;//attach a user data which can be used furhter
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
