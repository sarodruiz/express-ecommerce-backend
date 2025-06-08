import User from '../models/user.model';
import { Request, Response } from 'express';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        const token = generateToken(newUser._id.toString());

        await res.status(201).json({ message: 'User registered successfully', token, user: { id: newUser._id, email: newUser.email } });
    } catch (error) {
        await res.status(500).json({ message: `Error creating user` });
    }
};


export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken(user._id.toString());

        res.status(200).json({ token, user: { id: user._id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Error logging in user" });
    }
}
