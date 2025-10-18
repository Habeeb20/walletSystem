import express from "express";
import { authenticateToken } from "../utils/security.js";
import { transferFunds } from "../controllers/transfer.controllers.js";

const router = express.Router();

router.post("/transferfunds", authenticateToken, transferFunds);
export default router;