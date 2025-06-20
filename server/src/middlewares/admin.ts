import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import "dotenv/config"
import { Admin } from "../db";


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const adminMiddleware = async(req: Request, res: Response, next: NextFunction) => {
	const jwtToken = req.headers.authorization;
    const secret= process.env.SECRET||"";
    if(!jwtToken)
       { res.json({msg:"Invalid session"});
    return}
    const token= jwtToken.split(" ")[1];
    const response= jwt.verify(token,secret)

    const admin= await Admin.findOne({
        _id:response
    })
    if(!admin)
    {
        res.json({msg:"Unauthorized"});
        return
    }

    if(!response){
        res.json({msg:"Invalid session"});
        return
    }
    req.userId= response.toString();
    next()
};

export default adminMiddleware;