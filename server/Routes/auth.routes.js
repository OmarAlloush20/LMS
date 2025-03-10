import express from "express";
import { registerUser, loginUser } from "../Controllers/auth.controller.js";
import { authenticate } from "../MiddleWares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticate, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user",
    data: {
      user: user,
    },
  });
});

export default router;
