import type { Request , Response, NextFunction } from "express"
import createHttpError from "http-errors";

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
    //process
    //response
    res.json({ message: "User Registered" });
};



export {createUser} ;