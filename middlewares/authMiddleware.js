import jwt from "jsonwebtoken";
import { UsersModel } from "../models/UsersModel.js";

export const checkAuth = async (req, res, next)=>{
    if(
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
    ){
        const err = new Error("Invalid or non-existent token");
        err.status = 400;
        throw err;
    };

    try {
        const token = req.headers.authorization.split(" ")[1];

        const {id} = jwt.verify(token, process.env.SECRET_JWT);
        const user = await UsersModel.findOneById({id})
        req.user = user;
        next();

    } catch (error) {
        const err = new Error("Invalid token");
        err.status = 400;
        throw err;
    }
    
}