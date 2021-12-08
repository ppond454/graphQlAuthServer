import { Arg, Mutation, Query, Resolver , Ctx } from "type-graphql"
import {hash} from "bcryptjs"
import {Request ,Response} from "express"

import { User, UserModel } from "../entities/User"
import { validateEmail, validatePassword, validateUsername } from "../utils/validate"

@Resolver()
export class AuthResolvers {
  @Query(() => [User], { nullable: "items" }) // [User]!
  async users(): Promise<User[] | null> {
    try {
      return UserModel.find()
    } catch (e) {
      throw e
    }
  }

  @Mutation(() => User)
  async signUp(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res } : {req: Request; res: Response}
  ) {
    try {
      // Validation 
      if (!username) 
        throw new Error("Username is required")

      const isUsernameValid = validateUsername(username)

      if (!isUsernameValid)
        throw new Error("Username must be between 5-40 charecters")

      const isEmailValid = validateEmail(email)
      
      if(!isEmailValid)
        throw new Error("Email is invalid")

      if(!password)
        throw new Error("Password is required")

      const isPwdValid = validatePassword(password)

      if(!isPwdValid)
        throw new Error("Password must be between 6-16 charecters")

      const hashedPassword = await hash(password , 10) // hash password


      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
      })

      await newUser.save()

      //create token and send to the client

      res.cookie("jwt" ,"test" , {httpOnly: true})

      return newUser

    } catch (e) {
      throw e
    }
  }
}
