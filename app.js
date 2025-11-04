import express from "express"

import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./db.js";
import jwt from "jsonwebtoken"
import { configureHelmet } from "./utils/security.js";
import router from "./routes/user.route.js";
import airtimerouter from "./routes/airtime.route.js";
import walletrouter from "./routes/wallet.route.js";
import electricityRouter from "./routes/electricty.route.js";
import tvSubRoute from "./routes/tv.route.js";
import transferRouter from "./routes/transferRoute.js"

connectDB()


///**********   ROUTES   ******** */



dotenv.config();

const app = express();

configureHelmet(app)

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});





// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: ["http://localhost:5173", "https://wallet.taskflow.com.ng", ] ,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(morgan("dev"));






// Routes
app.get("/", (req, res) => {
  res.send("wallet backend is listening on port....");
});


app.use("/api/auth", router)
app.use("/api/wallet", walletrouter)
app.use("/api/airtime", airtimerouter)
app.use("/api/electricty", electricityRouter)
app.use("/api/tv", tvSubRoute)
app.use("/api/transfer", transferRouter)
// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ status: false, message: "Internal server error" });
});





// Start server
const port = process.env.PORT || 8080;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

})
































