import express from "express"
import  { authenticateToken } from "../utils/security.js"
import { buyAirtime, fetchWalletBalance, buyDataPin } from "../controllers/airtime.controllers.js"


const router = express.Router()

router.get('/wallet-balance', authenticateToken, fetchWalletBalance)
router.post('/buy-airtime', authenticateToken, buyAirtime)
router.post('/buy-data-pin', authenticateToken, buyDataPin)

export default router