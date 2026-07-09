import express from "express";
import {
  checkIn,
  checkOut,
  getEmployeeAttendance,
  getTodayStatus,
  getAllAttendance,
} from "../controllers/attendanceController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkin", protect, checkIn);
router.put("/checkout", protect, checkOut);
router.get("/employee/:employeeId", protect, getEmployeeAttendance);
router.get("/today/:employeeId", protect, getTodayStatus);
router.get("/", protect, adminOnly, getAllAttendance);

export default router;