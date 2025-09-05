import express from "express"
import { authenticateToken, loginRateLimiter, resetPasswordLimiter, validateRegisterInput } from "../utils/security.js"
import { checkVirtualAccount, createPaylonyUserVirtualAccount, createUserVirtualAccount,  fetchDashboard, getCustomerDetails, initiateResetPassword, loginWithBiometrics, loginWithPassword, register, registerBiometrics, resetPassword, selectUsername, verifyBiometrics, verifyEmail } from "../controllers/user.controller.js"

const router = express.Router()

router.post('/register', validateRegisterInput, register)
router.post('/select-username', authenticateToken, selectUsername)
router.post('/verifyemail', verifyEmail)
router.post('/login', loginRateLimiter, loginWithPassword)
router.get("/dashboard", authenticateToken, fetchDashboard)
router.post('/biometric-login', loginRateLimiter, loginWithBiometrics)
router.post('/biometric-register', authenticateToken, registerBiometrics)
router.post('/reset-password/initiate', resetPasswordLimiter, initiateResetPassword)
router.post('/reset-password', resetPassword)
router.get('/customer', authenticateToken, getCustomerDetails)
router.post('/create-virtual-account', authenticateToken, createUserVirtualAccount)
router.post('/create-paylony-virtual-account', authenticateToken,  createPaylonyUserVirtualAccount)
router.get('/check-virtual-account', authenticateToken, checkVirtualAccount);


export default router