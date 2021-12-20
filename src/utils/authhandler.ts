import { UserModel } from "../entities/User"

export const isAuthen = async (userId: string, tokenVersion?: number) => {
  const user = await UserModel.findById(userId)

  if (!user) throw new Error("Not Authenicated")

  if (tokenVersion !== user.tokenVersion) throw new Error("Not Authenicated")
  
  return user
}
