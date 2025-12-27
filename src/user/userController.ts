import type { Request , Response, NextFunction } from "express"
import createHttpError from "http-errors";
import userModel from "./userModel.js";
import  bcrypt from 'bcrypt';

const createUser = async (
    req:Request,
    res:Response, 
    next:NextFunction
)=>{
    //Get info
    const {name, email ,password}= req.body;
    //validation
    if(!name || !email || !password){
        const error = createHttpError(400,"All fields are required");
        return next(error);
    };
    // db call
    const user = await userModel.findOne((email));
    if (user){
        const error = createHttpError(400,"User already exists");
        return next(error);
    }
    //password ->hash
    const hashpassword =  await bcrypt.hash(password,10);
    
    //process
    //response
    res.json({ message: "User Registered" });
};



export {createUser} ;