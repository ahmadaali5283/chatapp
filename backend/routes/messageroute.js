import express from 'express';
import { protectRoute } from '../middlewares/authmiddleware.js';
import { getusersforsidebar, getmessagesbetweenusers, sendmessage }
    from '../controllers/messagecontroller.js';

const router = express.Router();
router.get("/users", protectRoute, getusersforsidebar);
router.get("/:id", protectRoute, getmessagesbetweenusers);
router.post("/send/:id", protectRoute, sendmessage);
export default router;