


import mongoose from "mongoose";

const tvSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  coded: {
    type: String,
    required: true, 
    default:"gotv-smallie"

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
 price: {
    type: Number,
    required: true,
    min: 500,
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
  tvDetails: {
    type: Object,
    required: false, 
  },
 
});

export default mongoose.model("TVschema", tvSchema);
































