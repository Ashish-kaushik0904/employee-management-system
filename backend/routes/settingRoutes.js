import express from "express";
import { changePassword } from "../controllers/settingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/change-password", protect, changePassword);

export default router;