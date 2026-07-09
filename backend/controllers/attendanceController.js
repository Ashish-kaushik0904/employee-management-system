import Attendance from "../models/Attendance.js";

// Helper — aaj ki date string banao
const getTodayString = () => {
  return new Date().toISOString().split("T")[0]; // "2026-06-30"
};

// POST /api/attendance/checkin — employee check-in kare
export const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = getTodayString();

    const existing = await Attendance.findOne({ employeeId, date: today });
    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const now = new Date();
    // 10:00 AM ke baad check-in toh "late"
    const lateThreshold = new Date();
    lateThreshold.setHours(10, 0, 0, 0);
    const status = now > lateThreshold ? "late" : "present";

    const attendance = await Attendance.create({
      employeeId,
      date: today,
      checkIn: now,
      status,
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/attendance/checkout — employee check-out kare
export const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = getTodayString();

    const attendance = await Attendance.findOne({ employeeId, date: today });
    if (!attendance) {
      return res.status(404).json({ message: "No check-in found for today" });
    }
    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const now = new Date();
    attendance.checkOut = now;

    // Working hours calculate karo
    const diffMs = now - attendance.checkIn;
    attendance.workingHours = Number((diffMs / (1000 * 60 * 60)).toFixed(2));

    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/attendance/employee/:employeeId — employee apni attendance dekhe
export const getEmployeeAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ employeeId: req.params.employeeId })
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/attendance/today/:employeeId — employee ka aaj ka status
export const getTodayStatus = async (req, res) => {
  try {
    const today = getTodayString();
    const attendance = await Attendance.findOne({
      employeeId: req.params.employeeId,
      date: today,
    });
    res.json(attendance || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/attendance — admin: sab employees ki attendance (date filter ke saath)
export const getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const filter = date ? { date } : {};

    const attendance = await Attendance.find(filter)
      .populate({
        path: "employeeId",
        select: "name employeeId department image",
        populate: { path: "department", select: "name" },
      })
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};