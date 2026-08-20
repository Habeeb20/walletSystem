import express from "express";
import { authenticateToken } from "../utils/security.js";
import { transferFunds, verifyAccount } from "../controllers/transfer.controllers.js";

const router = express.Router();

router.post("/transferfunds", authenticateToken, transferFunds);
router.post("/verify-account", authenticateToken, verifyAccount)


export default router;


