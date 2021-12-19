import express from "express"
import { server } from "./createServer"
import mongoose from "mongoose"
import { config } from "dotenv"

config()

const startServer = async () => {
  try {
    const uri = process.env.URI_MONGO
    const cors = {
      credentials: true,
      origin: 'https://studio.apollographql.com'
  }
    if (typeof uri === "string") {
      await mongoose.connect(uri)
    } else {
      throw new Error("please set the mongo uri")
    }

    const PORT: number = 5000 || process.env.PORT
    const app = express()

    const _server = await server()
    await _server.start()
    _server.applyMiddleware({ app ,cors })

    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${_server.graphqlPath}`
      )
    })
  } catch (e) {
    console.log(e)
  }
}

startServer()
