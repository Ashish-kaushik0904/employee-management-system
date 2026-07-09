import Leave from "../models/Leave.js";
import sendEmail from "../utils/sendEmail.js";
import { leaveAppliedEmail, leaveStatusEmail } from "../utils/emailTemplates.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";

// GET /api/leaves — admin: sab leaves
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: "employeeId",
        select: "name employeeId department image",
        populate: { path: "department", select: "name" },
      })
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/leaves/employee/:employeeId — employee apni leaves
export const getLeavesByEmployee = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.params.employeeId })
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/leaves/:id — single leave detail
export const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate({
        path: "employeeId",
        select: "name employeeId image department",
        populate: { path: "department", select: "name" },
      });
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/leaves — employee leave apply kare
export const applyLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, fromDate, toDate, description } = req.body;

    const leave = await Leave.create({
      employeeId,
      leaveType,
      fromDate,
      toDate,
      description,
    });

    // Admin ko notify karo
try {
  const emp = await Employee.findById(employeeId);
  const admin = await User.findOne({ role: "admin" });
  if (admin && emp) {
    const template = leaveAppliedEmail(emp.name, leaveType, fromDate, toDate, description);
    await sendEmail({ to: admin.email, ...template });
  }
} catch (err) {
  console.error("Leave apply email failed:", err.message);
}

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/leaves/:id/status — admin approve/reject kare
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    leave.status = status;
    await leave.save();

    // Employee ko notify karo
try {
  const emp = await Employee.findById(leave.employeeId);
  if (emp) {
    const template = leaveStatusEmail(emp.name, leave.leaveType, status, leave.fromDate, leave.toDate);
    await sendEmail({ to: emp.email, ...template });
  }
} catch (err) {
  console.error("Leave status email failed:", err.message);
}

    res.json({ message: `Leave ${status} successfully`, leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/leaves/:id — leave delete
export const deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    await Leave.findByIdAndDelete(req.params.id);
    res.json({ message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};