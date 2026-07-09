import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";
import sendEmail from "../utils/sendEmail.js";
import { salaryEmail } from "../utils/emailTemplates.js";

// GET /api/salary — admin: sab salary records
export const getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find()
      .populate({
        path: "employeeId",
        select: "name employeeId department",
        populate: { path: "department", select: "name" },
      })
      .sort({ createdAt: -1 });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/salary/employee/:employeeId — employee apni salary history
export const getSalaryByEmployee = async (req, res) => {
  try {
    const salaries = await Salary.find({ employeeId: req.params.employeeId })
      .sort({ createdAt: -1 });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/salary/department/:departmentId — department wise employees
export const getEmployeesByDepartment = async (req, res) => {
  try {
    const employees = await Employee.find({
      department: req.params.departmentId,
    }).select("name employeeId");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/salary — admin salary add kare
export const addSalary = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, payDate } =
      req.body;

    const salary = new Salary({
      employeeId,
      basicSalary: Number(basicSalary),
      allowances: Number(allowances) || 0,
      deductions: Number(deductions) || 0,
      payDate,
    });

    await salary.save(); // pre-save hook total calculate karega

    // Employee ko salary notification
try {
  const emp = await Employee.findById(employeeId);
  if (emp) {
    const template = salaryEmail(emp.name, basicSalary, allowances || 0, deductions || 0, salary.total, payDate);
    await sendEmail({ to: emp.email, ...template });
  }
} catch (err) {
  console.error("Salary email failed:", err.message);
}

    res.status(201).json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/salary/:id
export const deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }
    await Salary.findByIdAndDelete(req.params.id);
    res.json({ message: "Salary record deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};