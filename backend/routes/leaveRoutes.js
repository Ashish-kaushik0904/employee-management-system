import express from "express";
import {
  getAllLeaves,
  getLeavesByEmployee,
  getLeaveById,
  applyLeave,
  updateLeaveStatus,
  deleteLeave,
} from "../controllers/leaveController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllLeaves);
router.get("/employee/:employeeId", protect, getLeavesByEmployee);
router.get("/:id", protect, getLeaveById);
router.post("/", protect, applyLeave);
router.put("/:id/status", protect, adminOnly, updateLeaveStatus);
router.delete("/:id", protect, deleteLeave);

export default router;