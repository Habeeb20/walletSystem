import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String },
  username: { type: String, unique: true, sparse: true },
  twoFactorSecret: String,
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationCode: { type: String }, // Store 4-digit code
  biometricKeyId: { type: String }, // For mobile biometric key
});


export default mongoose.model("User", userSchema)
