import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
    min: 0,
  },
 account_number: {
    type: String,
    required: true,
    match: /^[0-9]{10,15}$/, 
  },
   narration : {
    type: String,
    required: true,

  },

 bank_code: {
    type: String,
    required: true,
    default: "0",
  },
  ref: {
    type: String,
    required: true,
    unique: true,
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

export default mongoose.model("Transfer", transferSchema);