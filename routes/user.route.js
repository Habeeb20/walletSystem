import express from "express"
import { authenticateToken, loginRateLimiter, validateRegisterInput } from "../utils/security.js"
import { loginWithBiometrics, loginWithPassword, register, registerBiometrics, selectUsername, verifyBiometrics, verifyEmail } from "../controllers/user.controller.js"

const router = express.Router()

router.post('/register', validateRegisterInput, register)
router.post('/select-username', authenticateToken, selectUsername)
router.post('/veryemail', verifyEmail)
router.post('/login', loginRateLimiter, loginWithPassword)
router.post('/biometric-login', loginRateLimiter, loginWithBiometrics)
router.post('/biometric-register', authenticateToken, registerBiometrics)

export default router