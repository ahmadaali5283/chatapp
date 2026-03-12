import express from "express";
import { signup, login, logout, updateprofile, checkAuth } from "../controllers/authcontrollers.js";
import { protectRoute } from "../middlewares/authmiddleware.js";
const router = express.Router()
router.post("/signup", signup)
router.post("/login",login)
router.post("/logout", logout)
router.put("/update-profile", protectRoute, updateprofile)//protect route is a middleware to run
router.get("/check", protectRoute,checkAuth) //check auth is a controller to check if the user is authenticated or not
export default router;