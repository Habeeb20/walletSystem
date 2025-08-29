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
  emailVerificationCode: { type: String }, 
  biometricKeyId: { type: String },
  paystackCustomerId: { type: String },
  wallet: {
    balance: { type: Number, default: 0 },
    transactions: [{
      type: { type: String, enum: ['credit', 'debit', 'bill_payment'] },
      amount: Number,
      provider: { type: String, default: 'Paystack' },
      reference: String,
      status: { type: String, enum: ['pending', 'success', 'failed'] },
      createdAt: { type: Date, default: Date.now }
    }]
  } 

});


export default mongoose.model("User", userSchema)
