import express from "express";
import { authenticateToken } from "../utils/security.js";
import { fundWallet, walletCallback } from "../controllers/wallet.controller.js";


const router = express.Router();


router.post('/fund', authenticateToken, fundWallet)
router.get('/callback', walletCallback)



export default router;