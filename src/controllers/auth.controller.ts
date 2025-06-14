import User from "../models/user.model";
import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    const token = generateToken(newUser._id.toString(), newUser.role);

    res.status(201).json({
      message: "User registered successfully",
      data: {
        id: newUser._id,
        email: newUser.email,
        token: token
      }
    });
  } catch (error) {
    res.status(500).json({ message: `Error creating user` });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      message: "User logged in successfully",
      data: {
        id: user._id,
        email: user.email,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user" });
  }
};
