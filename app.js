import express from "express"

import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./db.js";
import jwt from "jsonwebtoken"
import { configureHelmet } from "./utils/security.js";
import router from "./routes/user.route.js";
import walletrouter from "./routes/wallet.route.js";


connectDB()


///**********   ROUTES   ******** */



dotenv.config();

const app = express();

configureHelmet(app)








// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(morgan("dev"));






// Routes
app.get("/", (req, res) => {
  res.send("this backend is listening on port....");
});


app.use("/api/auth", router)
app.use("/api/wallet", walletrouter)
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
































