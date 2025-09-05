import express from "express";
import { authenticateToken } from "../utils/security.js";
import { fundWallet, walletCallback } from "../controllers/wallet.controller.js";
import { buyAirtime, fetchWalletBalance } from "../controllers/airtime.controllers.js";
import { transferFunds } from "../controllers/transfer.controllers.js";


const router = express.Router();


router.post('/fund-wallet', authenticateToken, fundWallet)
router.get('/callback', walletCallback)
router.get('/wallet-balance', authenticateToken, fetchWalletBalance);
router.post('/buy-airtime', authenticateToken, buyAirtime);
router.post('/transfer', authenticateToken, transferFunds)



export default router;