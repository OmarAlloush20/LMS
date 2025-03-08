import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import  connectDB  from "./Configs/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

cors({
  origin: process.env.CLIENT_URL,
  methods: ["POST", "PUT", "GET", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Connect to MongoDB
connectDB();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
  console.log(`http://localhost:${PORT} 🚀`);
});
