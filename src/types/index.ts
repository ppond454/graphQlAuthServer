import { Response, Request } from "express";

export enum RoleOptions {
  client = "CLIENT",
  item = "ITEM_EDITOR",
  admin = "ADMIN",
  super = "SUPER_ADMIN",
}

export interface AppContext {
  req: AppRequest
  res: Response
}

export interface AppRequest extends Request {
  userId ? : string 
  tokenVersion? : number
}