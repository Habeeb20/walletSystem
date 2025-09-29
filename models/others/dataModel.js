import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coded: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: false, 
    enum: ["MTN", "Airtel", "Glo", "9mobile"], 
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
  reseller_price: {
    type: Number,
    required: true,
    min: 0,
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
  dataPlanDetails: {
    type: Object,
    required: false, 
  },
});

export default mongoose.model("Data", dataSchema);