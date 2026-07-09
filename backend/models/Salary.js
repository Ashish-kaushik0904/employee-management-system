import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
    },
    allowances: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
    },
    payDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Total automatically calculate karo before save
salarySchema.pre("save", function () {
  this.total = this.basicSalary + this.allowances - this.deductions;
});

export default mongoose.model("Salary", salarySchema);