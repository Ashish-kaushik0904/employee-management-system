import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
  },
  { timestamps: true }
);


// Yeh kya hai?
// Mongoose Hook — save() se pehle automatically run hota hai.
// Password hashing kyun?
// Agar database hack ho jaaye toh plain text password directly milega. Hash hoga toh $2a$10$xyz...
//  aisa dikhega — reverse nahi ho sakta.
// genSalt(10) — 10 rounds of complexity — jitna zyada, utna secure (aur slow)
// isModified("password") — sirf tab hash karo jab password change hua ho — warna update karte 
// waqt dobara hash ho jaayega

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});


// Custom method — login pe use hota hai. User ne jo password diya usse DB ke hash se compare karo. 
// bcrypt.compare internally hash karke match karta hai.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);