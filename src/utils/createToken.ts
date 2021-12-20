import { Response } from "express"
import jwt from "jsonwebtoken"

export const createToken = (userId: string, tokenVersion: number) => {
  return jwt.sign(
    {
      userId,
      tokenVersion,
    },
    "secret",
    {
      expiresIn: "7d",
    }
  )
}

export const sendToken=( res: Response, token: string )=>{
    return res.cookie("jwt", token ,{
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
}

export const verifyToken=(token : string)=>{
  return jwt.verify(token,"secret")
}
