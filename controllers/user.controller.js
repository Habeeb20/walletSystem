import User from "../models/user/userModel.js";
import { generateUsernameSuggestions, hashPassword, verifyPassword, generateJwtToken, generateWebAuthnRegistrationOptions, verifyWebAuthnAuthentication, validateEmailVerificationInput, resetPasswordLimiter, generate4DigitCode, sendEmailVerificationCode, validationResetPasswordInput } from "../utils/security.js";
import { createCustomer, getCustomer, createVirtualAccount, createPaylonyVirtualAccount } from "../utils/paystack.js";
import axios from "axios"
import dotenv from "dotenv"

dotenv.config();

const verificationCodes = new Map();

export const register = async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Validate fullName
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      return res.status(400).json({ error: 'Full name is required' });
    }

    // Split fullName into first_name and last_name
    const nameParts = fullName.trim().split(' '); // Split on spaces
    if (!nameParts.length) {
      return res.status(400).json({ error: 'Invalid full name format' });
    }
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Create Paystack customer
    const paystackCustomer = await createCustomer(email, first_name, last_name, phone);


     let virtualAccount = null;
    try {
      virtualAccount = await createVirtualAccount(paystackCustomer.customer_code, email);
    } catch (virtualError) {
      console.warn('Virtual account creation failed, proceeding with registration:', virtualError.message);
    }


    // Proceed with user creation
    const hashedPassword = await hashPassword(password);
    const usernameSuggestions = await generateUsernameSuggestions(fullName, User);
    const emailVerificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      phone,
      emailVerificationCode,
      paystackCustomerId: paystackCustomer.customer_code,
        virtualAccountDetails: virtualAccount ? {
        account_number: virtualAccount.account_number,
        account_name: virtualAccount.account_name,
        bank: virtualAccount.bank.name,
      } : null,
    });

    await user.save();

    const token = generateJwtToken(user._id);
    sendEmailVerificationCode(user.email, user.emailVerificationCode);
    res.json({ token, usernameSuggestions });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: `Registration failed: ${error.message}` });
  }
};








// Select username (requires email verification)
export const selectUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.isEmailVerified) {
      return res.status(403).json({ error: "Email verification required" });
    }

    const suggestions = await generateUsernameSuggestions(user.fullName, User);
    if (!suggestions.includes(username)) {
      return res.status(400).json({ error: "Invalid username selection" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already taken" });

    user.username = username;
    await user.save();
    return res.status(200).json({ message: "Username set successfully", username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Register mobile biometric
export const registerBiometrics = async (req, res) => {
  try {
    const { publicKey } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.isEmailVerified) {
      return res.status(403).json({ error: "Email verification required" });
    }

    user.biometricKeyId = publicKey;
    await user.save();
    res.json({ message: "Biometric registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      if(code !== user.emailVerificationCode){
          console.log("the code is not correct")
         return res.status(400).json({ error: "Invalid verification code" });
      }

    
      user.isEmailVerified = true;
      user.emailVerificationCode = null;
      await user.save();
      verificationCodes.delete(user._id.toString());

      res.json({ message: "Email verified successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};




export  const verifyBiometrics = async(req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if(!user) return res.status(404).json({message: "user not found"})

        const verification = await verifyWebAuthnAuthentication(req.body, challenges.get(user._id.toString()))
        if (!verification.verified) return res.status(400).json({ error: 'Registration failed' });

    user.authenticators.push({
      credentialID: Buffer.from(verification.registrationInfo.credentialID),
      credentialPublicKey: Buffer.from(verification.registrationInfo.credentialPublicKey),
      counter: verification.registrationInfo.counter,
    });
    await user.save();
    challenges.delete(user._id.toString());
    res.json({ message: 'Biometric registration successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}





// Login with mobile biometric
export const loginWithBiometrics = async (req, res) => {
  try {
    const { email, signature } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.biometricKeyId) {
      return res.status(400).json({ error: "No biometric key registered" });
    }

    // Simplified signature verification (use a proper library like node-forge in production)
    // Assume signature is valid for this example
    const token = generateJwtToken(user._id, user.email);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



// Login with email and password
export const loginWithPassword = async (req, res) => {
  try {
 
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        console.log("user not found")
        return res.status(404).json({ error: "User not found" });
      } 

      if (!user.isEmailVerified) {
        return res.status(403).json({ error: "Email verification required" });
      }

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) return res.status(401).json({ error: "Invalid credentials" });

      const token = generateJwtToken(user._id, user.email);
      res.json({ token });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



export const fetchDashboard = async (req, res) => {
 
  try {
    const user = await User.findOne({ _id: req.user.id }).select(
      'fullName wallet virtualAccountDetails'
    );
    if (!user) return res.status(404).json({ error: 'User not found' });

    const walletBalance = user.wallet?.balance || 0;
    const virtualBalance = user.virtualAccountDetails?.balance || 0; 
    const totalBalance = walletBalance + virtualBalance;
    const income = user.wallet?.transactions
      ?.filter((t) => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0) || 0;
    const expenses = user.wallet?.transactions
      ?.filter((t) => t.type === 'debit')
      ?.reduce((sum, t) => sum + t.amount, 0) || 0;

    res.json({
      success: true,
      data: {
        user: {
          fullName: user.fullName,
          wallet: {
            balance: walletBalance,
            transactions: user.wallet?.transactions || [],
          },
          virtualAccountDetails: user.virtualAccountDetails || null,
        },
        totalBalance,
        income,
        expenses,
      },
    });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch dashboard: ${error.message}` });
  }
};




export const initiateResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If the email exists, a reset code has been sent.' });
    }

    const resetCode = generate4DigitCode();
    user.emailVerificationCode = resetCode;
    await user.save();

    // Store temporarily (expires in 10 mins – you can add TTL with Redis)
    verificationCodes.set(user._id.toString(), {
      code: resetCode,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await sendEmailVerificationCode(email, resetCode); // your existing function

    res.json({ message: 'Reset code sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const stored = verificationCodes.get(user._id.toString());
    if (!stored || stored.code !== code || Date.now() > stored.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    user.password = await hashPassword(newPassword);
    user.emailVerificationCode = null;
    await user.save();

    verificationCodes.delete(user._id.toString());

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};







export const getCustomerDetails = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select(
      'paystackCustomerId first_name last_name email phone virtualAccountDetails wallet paylonyVirtualAccountDetails'
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.paystackCustomerId) {
      return res.status(400).json({ error: 'No Paystack customer associated with this user' });
    }

  
    const paystackCustomer = await getCustomer(user.paystackCustomerId);

 
    const responseData = {
      first_name: paystackCustomer.first_name || user.first_name,
      last_name: paystackCustomer.last_name || user.last_name,
      email: paystackCustomer.email || user.email,
      phone: paystackCustomer.phone || user.phone,
      virtualAccountDetails: user.virtualAccountDetails || {},
      wallet: user.wallet || {},
      paylonyVirtualAccountDetails: user.paylonyVirtualAccountDetails || {},
    };

    res.json({ data: responseData }); 
  } catch (error) {
    console.error('Get customer details error:', error);
    res.status(500).json({ error: `Failed to fetch customer details: ${error.message}` });
  }
};


export const createUserVirtualAccount = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user?.email }).select('paystackCustomerId email');
    console.log('Found user:', user);
    if (!user || !user.paystackCustomerId) {
      return res.status(400).json({ error: 'No customer account found' });
    }

    const virtualAccount = await createVirtualAccount(user.paystackCustomerId, user.email);
    user.virtualAccountDetails = {
      account_number: virtualAccount.account_number,
      account_name: virtualAccount.account_name,
      bank: virtualAccount.bank.name,
    };
    await user.save();

    res.json({ message: 'Virtual account created', details: user.virtualAccountDetails });
  } catch (error) {
    console.error('Create virtual account error:', error);
    res.status(500).json({ error: `Failed to create virtual account: ${error.message}` });
  }
};












export const createPaylonyUserVirtualAccount = async (req, res) => {
  const { customerId, firstname, lastname, address, gender, email, phone, dob } = req.body;

  try {
    console.log('Received Request to Create Paylony Account:', req.body);
   
    const paylonyResponse = await axios.post(
      "https://api.paylony.com/api/v1/create_account",
      {
        customer_id: customerId,
        firstname,
        lastname,
        address,
        gender,
        email,
        phone,
        dob,
        currency: 'NGN',
        provider: 'netbank'
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYLONY_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Paylony API Raw Response:', paylonyResponse.data); 
    console.log('Paylony API Status:', paylonyResponse.status); //

    const { data: accountData } = paylonyResponse.data;
    if (!accountData || !accountData.account_number || !accountData.account_name || !accountData.bank_name) {
      throw new Error('Invalid response from Paylony API for account creation');
    }

    const user = await User.findOne({ email: req.user.email });
    if (user) {
      user.paylonyVirtualAccountDetails = { 
        account_number: accountData.account_number,
        account_name: accountData.account_name,
        bank: accountData.bank_name,
      };
      await user.save();
      console.log('User Saved with Paylony Details:', user.paylonyVirtualAccountDetails);
    } else {
      throw new Error('User not found');
    }

    res.json({ success: true, virtual_account: user.paylonyVirtualAccountDetails });
  } catch (error) {
    console.error('Paylony virtual account creation error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.message || 'Failed to create virtual account. Please check your credentials or contact support.' });
  }
};

export const checkVirtualAccount = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const hasVirtualAccount = !!user.virtualAccountDetails;
    console.log('Virtual account exists:', hasVirtualAccount);
    res.json({ success: true, exists: hasVirtualAccount, virtualAccountDetails: hasVirtualAccount ? user.virtualAccountDetails : null, });
  } catch (error) {
    res.status(500).json({ error: `Failed to check virtual account: ${error.message}` });
  }
};













































