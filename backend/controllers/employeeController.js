import Employee from "../models/Employee.js";
import path from "path";
import sendEmail from "../utils/sendEmail.js";
import { welcomeEmail } from "../utils/emailTemplates.js";

// GET /api/employees — sab employees (populated department)
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("department", "name")
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/employees/:id — ek employee
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("department", "name")
      .select("-password");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/employees — naya employee banao
export const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      email,
      password,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      phone,
      role,
    } = req.body;

    // Email already exists?
    const emailExists = await Employee.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // EmployeeId already exists?
    const idExists = await Employee.findOne({ employeeId });
    if (idExists) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    // Image path — agar upload hua toh
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const employee = await Employee.create({
      employeeId,
      name,
      email,
      password,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      phone,
      role,
      image,
    });

    // Password hide karke return karo
    const created = await Employee.findById(employee._id)
      .populate("department", "name")
      .select("-password");

    // Welcome email bhejo
    try {
      const template = welcomeEmail(employee.name, employee.email, req.body.password);
      await sendEmail({ to: employee.email, ...template });
    } catch (err) {
      console.error("Welcome email failed:", err.message);
    }

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/employees/:id — update employee
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Agar naya image upload hua toh update karo
    if (req.file) {
      req.body.image = `/uploads/${req.file.filename}`;
    }

    // Password change ho raha hai toh hash karo
    if (req.body.password) {
      const bcryptjs = await import("bcryptjs");
      const salt = await bcryptjs.default.genSalt(10);
      req.body.password = await bcryptjs.default.hash(req.body.password, salt);
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("department", "name")
      .select("-password");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/employees/profile/:id — employee apna profile dekhe
export const getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("department", "name")
      .select("-password");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};