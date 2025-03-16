import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./Configs/db.js";
import authRoutes from "./Routes/auth.routes.js";
import mediaRoutes from "./Routes/instructor.routes.js";
import instructorCourseRoutes from "./Routes/course.routes.js";
import StudentViewCourseRoutes from "./Routes/student.routes.js";
import StudentViewOrderRoutes from "./Routes/orders.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "PUT", "GET", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB
connectDB(MONGO_URI);

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", StudentViewCourseRoutes);
app.use("/student/order", StudentViewOrderRoutes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
  console.log(`http://localhost:${PORT} 🚀`);
});
