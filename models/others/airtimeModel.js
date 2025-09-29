import mongoose from "mongoose";

const airtimeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  provider: {
    type: String,
    required: true,
    enum: ["MTN", "Airtel", "Glo", "9mobile"], 
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  number: {
    type: String,
    required: true,
    match: /^[0-9]{10,15}$/, 
  },
  country: {
    type: String,
    required: true,
    default: "NG",
  },
  payment: {
    type: String,
    required: true,
    enum: ["wallet", "card", "bank"], 
    default: "wallet",
  },
  promo: {
    type: String,
    default: "0",
  },
  ref: {
    type: String,
    required: true,
    unique: true,
  },
  operatorID: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ["airtime", "data_pin"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Airtime", airtimeSchema);