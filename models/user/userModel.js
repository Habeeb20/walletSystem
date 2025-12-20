import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role:{type:String, default: "user"},
  phone: { type: String },
  username: { type: String, unique: true, sparse: true },
  twoFactorSecret: String,
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationCode: { type: String }, 
  biometricKeyId: { type: String },
  paystackCustomerId: { type: String },
wallet: { balance: Number, transactions: Array },
    transactions: [
      {
        type: { type: String, enum: ['credit', 'debit'] },
        amount: Number,
        provider: String,
        reference: String,
        status: { type: String, enum: ['pending', 'success', 'failed'] },
        details: mongoose.Schema.Types.Mixed,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  
  virtualAccountDetails: {
  account_number: { type: String },
  account_name: { type: String },
  bank: { type: String },
},
paylonyVirtualAccountDetails: {
    account_number: { type: String },
    account_name: { type: String },
    bank_name: { type: String },
    provider: { type: String,  },
    domain: { type: String,  },
    reference: { type: String,  },
    assignment: { type: String, },
    status: { type: String,  },
    mandate: { reference: String, status: String, createdAt: Date },

  },

});


export default mongoose.model("User", userSchema)




