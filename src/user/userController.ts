import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return next(createHttpError(400, "All fields are required"));
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(createHttpError(400, "Invalid email format"));
    }

    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return next(createHttpError(400, "User already exists with this email"));
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign(
            { sub: newUser._id },
            config.jwtsecret as string,
            {
                expiresIn: "7d",
                algorithm: "HS256",
            }
        );

        // Send response
        res.status(201).json({
            accessToken: token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (error) {
        return next(createHttpError(500, "Error while creating user"));
    }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return next(createHttpError(400, "All fields are required"));
    }

    try {
        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return next(createHttpError(404, "User not found"));
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(createHttpError(401, "Invalid credentials"));
        }

        // Generate JWT token
        const token = jwt.sign(
            { sub: user._id },
            config.jwtsecret as string,
            {
                expiresIn: "7d",
                algorithm: "HS256",
            }
        );

        // Send response
        res.json({
            accessToken: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        return next(createHttpError(500, "Error while logging in"));
    }
};

export { createUser, loginUser };