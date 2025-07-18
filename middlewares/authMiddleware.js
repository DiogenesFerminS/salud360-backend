import jwt from "jsonwebtoken";
import { UsersModel } from "../models/UsersModel.js";

export const checkAuth = async (req, res, next)=>{

    const {TokenSalud360} = req.cookies;

    if(!TokenSalud360){
        const err = new Error("Invalid or non-existent token")
        err.status = 401;
        throw err;
    }

    try {
        const {id} = jwt.verify(TokenSalud360, process.env.SECRET_JWT)
        const user = await UsersModel.findOneById({id});
        req.user = user;
        next();
    } catch (error) {
        const err = new Error("Invalid token");
        err.status = 400;
        throw err;
    };
    
}