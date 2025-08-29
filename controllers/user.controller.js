import User from "../models/user/userModel.js";
import { generateUsernameSuggestions, hashPassword, verifyPassword, generateJwtToken, generateWebAuthnRegistrationOptions, verifyWebAuthnAuthentication, validateEmailVerificationInput, resetPasswordLimiter, generate4DigitCode, sendEmailVerificationCode, validationResetPasswordInput } from "../utils/security.js";
import { createCustomer, getCustomer } from "../utils/paystack.js";



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
      paystackCustomerId: paystackCustomer.customer_code // Use customer_code
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
      if (!user) return res.status(404).json({ error: "User not found" });

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


export const dashboard = async (req, res) => {
  try {
  
    const userId = req.user.id; 
    const user = await User.findById(userId).select('-password -emailVerificationCode'); 

    if (!user) return res.status(404).json({ error: "User not found" });


    res.json({
      message: "Welcome to your dashboard",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const initiateResetPassword = async(req, res) => {
  try {
    const {email} = req.body
    await resetPasswordLimiter(req,res, async() => {
      const user = await User.findOne({email});
      if(!user) return res.status(404).json({message: "user's email not found"})


    const resetCode = generate4DigitCode()
    user.emailVerificationCode = resetCode;
    await user.save()
    await sendEmailVerificationCode(email, resetCode)

    verificationCodes.set(user._id.toString(), resetCode)
    res.json({message: "password reset code sent to email"})
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"an error occurred "})
  }
}



export const resetPassword = async(req, res) => {
  try {
    await validationResetPasswordInput(req, res, async() => {
      const {email, code, newPassword} = req.body;
      const user = await User.findOne({email})
      if(!user) return res.status(404).json({message:"user not found"})
      
      const storedCode = verificationCodes.get(user._id,toString())
      if(!storedCode || storedCode !== code) return res.status(404).json({message:"reset code is not valid"})

      user.password = await hashPassword(newPassword);
      user.emailVerificationCode = null;
      await user.save();
      verificationCodes.delete(user._id.toString())

      res.json({message: 'password reset successfully'})
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error.message})
  }
}






export const getCustomerDetails = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select('paystackCustomerId');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.paystackCustomerId) {
      return res.status(400).json({ error: 'No Paystack customer associated with this user' });
    }

    const customer = await getCustomer(user.paystackCustomerId);
    const { first_name, last_name, email, phone } = customer;
    res.json({ first_name, last_name, email, phone });
  } catch (error) {
    console.error('Get customer details error:', error);
    res.status(500).json({ error: `Failed to fetch customer details: ${error.message}` });
  }
};


























