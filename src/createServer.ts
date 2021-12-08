import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"

import { AuthResolvers } from "./resolvers/AuthResolvers"

export const server = async () => {
  const schema = await buildSchema({
    resolvers: [AuthResolvers],
    emitSchemaFile: { path: "./src/schema.graphql" },
    validate: false,
  })

  return new ApolloServer({
    schema,
    context: ({ req, res }) => {
      return { req, res }
    },
  })
}
