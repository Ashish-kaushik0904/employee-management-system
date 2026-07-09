import express from "express";
import {
  getAllSalaries,
  getSalaryByEmployee,
  getEmployeesByDepartment,
  addSalary,
  deleteSalary,
} from "../controllers/salaryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllSalaries);
router.get("/employee/:employeeId", protect, getSalaryByEmployee);
router.get("/department/:departmentId", protect, adminOnly, getEmployeesByDepartment);
router.post("/", protect, adminOnly, addSalary);
router.delete("/:id", protect, adminOnly, deleteSalary);

export default router;