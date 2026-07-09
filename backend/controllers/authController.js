import User from "../models/User.js";
import Employee from "../models/Employee.js";
import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN — pehle User check karo, phir Employee
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Pehle Admin/User table mein dhundho
    let user = await User.findOne({ email });
    let userType = "user";

    // Nahi mila toh Employee table mein dhundho
    if (!user) {
      user = await Employee.findOne({ email })
        .populate("department", "name");
      userType = "employee";
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Password match karo
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...(userType === "employee" && {
        employeeId: user.employeeId,
        department: user.department,
        image: user.image,
      }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  res.json(req.user);
};