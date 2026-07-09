import User from "../models/User.js";
import Employee from "../models/Employee.js";
import bcryptjs from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import { passwordChangedEmail } from "../utils/emailTemplates.js";

// PUT /api/settings/change-password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, userType, userId } = req.body;

    // userType ke basis pe User ya Employee find karo
    let user;
    if (userType === "admin") {
      user = await User.findById(userId);
    } else {
      user = await Employee.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Old password verify karo
    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // New password hash karo
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(newPassword, salt);
    await user.save();

    // Security alert email
    try {
      const template = passwordChangedEmail(user.name);
      await sendEmail({ to: user.email, ...template });
    } catch (err) {
      console.error("Password change email failed:", err.message);
    }

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};