import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import type { User } from "./userTypes.js";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    //Get info
    const { name, email, password } = req.body;
    //validation
    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }
    // db call
    try {
        const user = await userModel.findOne(email);
        if (user) {
            const error = createHttpError(400, "User already exists");
            return next(error);
        }
    } catch (error) {
        return next(createHttpError(500, "Error while getting user"));
    }
    //password ->hash
    const hashpassword = await bcrypt.hash(password, 10);
    let newUser : User;
    try {
         newUser = await userModel.create({
            name,
            email,
            password: hashpassword,
        });
    } catch (error) {
        return next(createHttpError(500, "Error while getting user"));
    }
    // generate token jwt
    let token;
    try {
         token = jwt.sign({ sub: newUser._id }, config.jwtsecret as string, {
            expiresIn: "7d",
            algorithm: "HS256",
        });
    } catch (error) {
        return next(createHttpError(500, "Error while signing jwt token"));        
    }
    res.json({ accessToken: token });

    //process
    //response
    res.json({ message: "User Registered" });
};

//login
const loginUser = async(req: Request, res: Response, next: NextFunction)=> {
    const {email , password} =req.body;

    if(!email || !password ){
        return next(createHttpError(400, "all fields are required "));
    }
    let user;
    try {
         user = await userModel.findOne({email});
        if(!user){
            return next(createHttpError(404,"User not found"));
        }
    } catch (error) {
        return next (createHttpError(500,"error while finding user"));
    }

    const isMatch = bcrypt.compare(password, user.password);
    
    if(!isMatch){
        return next(createHttpError(400,"Username or Pasword incorrect"));
    }

    const token = jwt.sign({ sub: user._id }, config.jwtsecret as string, {
            expiresIn: "7d",
            algorithm: "HS256",
        });

    res.json({message: "ok"});
};

export { createUser, loginUser };
