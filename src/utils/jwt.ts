import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
    console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`); // Debugging line to check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
