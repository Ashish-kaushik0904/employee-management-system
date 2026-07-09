import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: String, // "2026-06-30" format — easy to query by day
      required: true,
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    workingHours: {
      type: Number, // hours, decimal — e.g. 8.5
      default: 0,
    },
    status: {
      type: String,
      enum: ["present", "late", "absent"],
      default: "present",
    },
  },
  { timestamps: true }
);

// Ek employee ka ek din mein sirf ek hi attendance record ho
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);