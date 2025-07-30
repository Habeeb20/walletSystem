import express from "express"
import { authenticateToken, loginRateLimiter, resetPasswordLimiter, validateRegisterInput } from "../utils/security.js"
import { initiateResetPassword, loginWithBiometrics, loginWithPassword, register, registerBiometrics, resetPassword, selectUsername, verifyBiometrics, verifyEmail } from "../controllers/user.controller.js"

const router = express.Router()

router.post('/register', validateRegisterInput, register)
router.post('/select-username', authenticateToken, selectUsername)
router.post('/veryemail', verifyEmail)
router.post('/login', loginRateLimiter, loginWithPassword)
router.post('/biometric-login', loginRateLimiter, loginWithBiometrics)
router.post('/biometric-register', authenticateToken, registerBiometrics)
router.post('/reset-password/initiate', resetPasswordLimiter, initiateResetPassword)
router.post('/reset-password', resetPassword)

export default router