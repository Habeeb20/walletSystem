import express from "express"
import { authenticateToken } from "../utils/security.js"
import { tvSubscription } from "../controllers/tv.controller.js"

const tvSubRoute = express.Router()

tvSubRoute.post("/buy-tv-subscription", authenticateToken, tvSubscription )



export default tvSubRoute