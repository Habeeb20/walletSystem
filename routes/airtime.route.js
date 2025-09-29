import express from "express";
import { authenticateToken } from "../utils/security.js";
import { buyAirtime, fetchWalletBalance, buyDataPin } from "../controllers/airtime.controllers.js";
import { buyData } from "../controllers/data.controllers.js";

const router = express.Router();

// Wallet balance endpoint
router.get('/wallet-balance', authenticateToken, fetchWalletBalance);

// Airtime purchase endpoints
router.post('/buy-airtime', authenticateToken, buyAirtime);
router.post('/buy-data-pin', authenticateToken, buyDataPin);

// Data purchase endpoint
router.post('/buy-data', authenticateToken, buyData);

export default router;