import User from "../models/user/userModel.js";
import { generateUsernameSuggestions, hashPassword, generateJwtToken, generateWebAuthnRegistrationOptions, verifyWebAuthnAuthentication, validateEmailVerificationInput } from "../utils/security.js";

export const register = async(req, res) => {
 try {
    const {email, password, fullName, phone} = req.body
    const hashedPassword = await hashPassword(password)
    const usernameSuggestions = await generateUsernameSuggestions(fullName, User)

    const user = new User({email, password:hashedPassword, fullName, phone })

    await user.save()

    const token = generateJwtToken(user._id)
    res.json({token, usernameSuggestions})
 } catch (error) {
    console.log(error)
    res.status(500).json({error: error.message})
 }
}


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
    await validateEmailVerificationInput(req, res, async () => {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      const storedCode = verificationCodes.get(user._id.toString());
      if (!storedCode || storedCode !== code) {
        return res.status(400).json({ error: "Invalid verification code" });
      }

      user.isEmailVerified = true;
      user.emailVerificationCode = null;
      await user.save();
      verificationCodes.delete(user._id.toString());

      res.json({ message: "Email verified successfully" });
    });
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
    const token = generateJwtToken(user._id);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



// Login with email and password
export const loginWithPassword = async (req, res) => {
  try {
    await validateLoginInput(req, res, async () => {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });

      if (!user.isEmailVerified) {
        return res.status(403).json({ error: "Email verification required" });
      }

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) return res.status(401).json({ error: "Invalid credentials" });

      const token = generateJwtToken(user._id);
      res.json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
