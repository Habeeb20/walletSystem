import express from "express";
import { authenticateToken } from "../utils/security.js";
import { fetchAndUpdateWalletBalance, fetchPaylonyAccounts, fundWallet, handlePaylonyWebhook, manualUpdateWallet, PaylonyWebhook, walletCallback } from "../controllers/wallet.controller.js";
import { buyAirtime, fetchWalletBalance } from "../controllers/airtime.controllers.js";
import { transferFunds } from "../controllers/transfer.controllers.js";


const router = express.Router();


router.post('/fund-wallet', authenticateToken, fundWallet)
router.get('/callback', walletCallback)
router.get('/wallet-balance', authenticateToken, fetchAndUpdateWalletBalance);
router.post('/buy-airtime', authenticateToken, buyAirtime);
router.post('/transfer', authenticateToken, transferFunds)
router.get('/fetch-paylony-accounts', authenticateToken, fetchPaylonyAccounts)
router.get('/fetch-paylony-transactions', authenticateToken, fetchPaylonyAccounts)
router.post('/webhook/paylony', handlePaylonyWebhook);
router.get('/fetch-and-update-balance/:reference/:provider', authenticateToken, fetchAndUpdateWalletBalance);
router.post('/manual-update', manualUpdateWallet);
router.post('/webhook/paylony', PaylonyWebhook);


export default router;





// https://walletsystem-3.onrender.com/api/wallet/webhook/paylony
