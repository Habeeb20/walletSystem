import express from "express"
import { authenticateToken } from "../utils/security.js"
import { buyElectricity } from "../controllers/electricity.controller.js"



const electricityRouter = express.Router()


electricityRouter.post("/buy-electricity", authenticateToken, buyElectricity)


export default electricityRouter