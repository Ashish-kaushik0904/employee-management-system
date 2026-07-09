import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeProfile,
} from "../controllers/employeeController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Admin routes
router.get("/", protect, getEmployees);
router.post("/", protect, adminOnly, upload.single("image"), createEmployee);
router.put("/:id", protect, adminOnly, upload.single("image"), updateEmployee);
router.delete("/:id", protect, adminOnly, deleteEmployee);

// Employee + Admin dono dekh sakte hain
router.get("/profile/:id", protect, getEmployeeProfile);
router.get("/:id", protect, getEmployeeById);

export default router;