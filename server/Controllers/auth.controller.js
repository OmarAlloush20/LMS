import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  const isUserAlreadyExist = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      success: false,
      message: "User Name or User Email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    userName,
    userEmail,
    role,
    password: hashPassword,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
};

export { registerUser };