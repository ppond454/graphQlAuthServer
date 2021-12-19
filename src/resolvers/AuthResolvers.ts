import { Arg, Mutation, Query, Resolver, Ctx } from "type-graphql"
import { hash, compare } from "bcryptjs"

import { User, UserModel } from "../entities/User"
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils/validate"
import { createToken, sendToken } from "../utils/createToken"
import { AppContext } from "../types"

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

  @Mutation(() => User, { nullable: true })
  async signUp(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: AppContext
  ): Promise<User | null> {
    try {
      // Validation
      if (!username) throw new Error("Username is required")
      if (!password) throw new Error("Password is required")
      if (!email) throw new Error("Email is required")

      const user = await UserModel.findOne({ email })
      if (user) throw new Error("this email is already in used")

      const isUsernameValid = validateUsername(username)

      if (!isUsernameValid)
        throw new Error("Username must be between 5-40 charecters")

      const isEmailValid = validateEmail(email)

      if (!isEmailValid) throw new Error("Email is invalid")

      const isPwdValid = validatePassword(password)

      if (!isPwdValid)
        throw new Error("Password must be between 6-16 charecters")

      const hashedPassword = await hash(password, 10) // hash password

      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
      })

      await newUser.save()

      //create token and send to the client

      const token = createToken(newUser.id, newUser.tokenVersion)

      sendToken(res, token)

      return newUser
    } catch (e) {
      throw e
    }
  }

  @Mutation(() => User, { nullable: true })
  async signIn(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: AppContext
  ): Promise<User | null> {
    try {
      // Validation
      if (!password) throw new Error("Password is required")
      if (!email) throw new Error("Email is required")

      const user = await UserModel.findOne({ email })
      if (!user) throw new Error("Email on found")

      const checkPassword = await compare(password, user.password)
      if (!checkPassword) throw new Error("Email or password is invalid")

      //create token and send to the client

      const token = createToken(user.id, user.tokenVersion)

      sendToken(res, token)

      return user
    } catch (e) {
      throw e
    }
  }
}
