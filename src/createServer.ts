import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"

import { verifyToken } from "./utils/createToken"
import { AuthResolvers } from "./resolvers/AuthResolvers"
import { AppContext } from "./types"

export const server = async () => {
  const schema = await buildSchema({
    resolvers: [AuthResolvers],
    emitSchemaFile: { path: "./src/schema.graphql" },
    validate: false,
  })

  return new ApolloServer({
    schema,
    context: ({ req, res }: AppContext) => {
      const token = req.cookies["jwt"]
      if (token) {
        try {
          const decodeToken =
            (verifyToken(token) as {
              userId: string
              tokenVersion: number
              iat: number
              exp: number
            }) || null

          if (decodeToken) {
            req.userId = decodeToken.userId
            req.tokenVersion = decodeToken.tokenVersion
          }
        } catch (e) {
          req.userId = undefined
          req.tokenVersion = undefined
        }
      }
      return { req, res }
    },
  })
}
