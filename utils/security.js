
import jwt from "jsonwebtoken"
import crypto from "crypto"
import helmet from "helmet"
import speakeasy from "speakeasy"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import rateLimit from "express-rate-limit"
import nodemailer from "nodemailer"
import {validationResult, body} from "express-validator"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const RP_NAME = 'WalletApp';
const RP_ID = process.env.RP_ID || 'localhost'; 
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;


//hash password

export async function hashPassword(password) {
    try {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds)
    } catch (error) {
        console.log(error)
        throw new Error("password hashing failed" + error.message)
    }
}




//verify a password

export async function verifyPassword(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword)
    } catch (error) {
        throw new Error("password verification failed" + error.message)
    }
}


///generate 4 digit code

export function generate4DigitCode(){
    try {
        return crypto.randomInt(0, 1000).toString().padStart(4, '0')
    } catch (error) {
        throw new Error('generating 4 digit code failed' + error.message)
    }
}



export async function sendEmailVerificationCode(email, code) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"WalletApp" <${EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email',
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });
  } catch (error) {
    throw new Error('Failed to send verification email: ' + error.message);
  }
}



// Generate three unique username suggestions
export async function generateUsernameSuggestions(fullName, User) {
  try {
    const nameParts = fullName.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    const suggestions = [];
    
    const base1 = nameParts[0] || 'user';
    const base2 = nameParts.length > 1 ? nameParts[0] + nameParts[1][0] : base1;
    const base3 = nameParts.length > 1 ? nameParts.join('') : base1 + generate4DigitCode();

    for (let base of [base1, base2, base3]) {
      let username = base;
      let counter = 0;
      while (await User.findOne({ username })) {
        counter++;
        username = `${base}${counter}`;
      }
      suggestions.push(username);
    }

    return suggestions;
  } catch (error) {
    throw new Error('Username generation failed: ' + error.message);
  }
}

// Generate WebAuthn registration options
export async function generateWebAuthnRegistrationOptions(userId, userEmail, userName) {
  try {
    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: userId,
      userName: userEmail,
      userDisplayName: userName,
      attestationType: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Use device biometrics (e.g., fingerprint)
        userVerification: 'required',
      },
    });
    return options;
  } catch (error) {
    throw new Error('WebAuthn registration options failed: ' + error.message);
  }
}



///
// Input validation for email verification
export const validateEmailVerificationInput = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('code').isLength({ min: 4, max: 4 }).withMessage('Code must be 4 digits'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];



// Verify WebAuthn registration response
export async function verifyWebAuthnRegistration(response, expectedChallenge) {
  try {
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    });
    return verification;
  } catch (error) {
    throw new Error('WebAuthn registration verification failed: ' + error.message);
  }
}

// Generate WebAuthn authentication options
export async function generateWebAuthnAuthenticationOptions() {
  try {
    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      userVerification: 'required',
    });
    return options;
  } catch (error) {
    throw new Error('WebAuthn authentication options failed: ' + error.message);
  }
}

// Verify WebAuthn authentication response
 export async function verifyWebAuthnAuthentication(response, expectedChallenge, authenticator) {
  try {
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      authenticator,
    });
    return verification;
  } catch (error) {
    throw new Error('WebAuthn authentication verification failed: ' + error.message);
  }
}



///generate a jwt token

export function generateJwtToken(userId){
    try {
        return jwt.sign({id: userId}, JWT_SECRET, {expiresIn: "7d"})
    } catch (error) {
        throw new Error("token generation failed" + error.message)
    }
}



// Generate 2FA secret
export function generate2FASecret() {
  try {
    return speakeasy.generateSecret({ name: 'WalletApp' });
  } catch (error) {
    throw new Error('2FA secret generation failed: ' + error.message);
  }
}

// Verify 2FA token
export function verify2FAToken(secret, token) {
  try {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // Allow 30-second window for clock drift
    });
  } catch (error) {
    throw new Error('2FA verification failed: ' + error.message);
  }
}

// Encrypt sensitive data (e.g., private keys)
export function encryptData(data) {
  try {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
  } catch (error) {
    throw new Error('Encryption failed: ' + error.message);
  }
}

// Decrypt sensitive data
export function decryptData(encryptedData, iv) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed: ' + error.message);
  }
}

// Rate limiter for login attempts
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 requests per window
  message: 'Too many login attempts, please try again later.',
});

// Input validation for user registration
export const validateRegisterInput = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must be at least 8 characters, with uppercase, lowercase, number, and special character'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Input validation for transactions
export const validateTransactionInput = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('recipient').notEmpty().withMessage('Recipient address is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Configure Helmet for secure headers
export function configureHelmet(app) {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true }, // 1 year
    noSniff: true,
    xssFilter: true,
  }));
}

// Middleware to authenticate JWT
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Access token required' });

  try {
    const decoded = verifyJwtToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}