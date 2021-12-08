import express from "express"
import { server } from "./createServer"
import mongoose from "mongoose"
import { config } from "dotenv"

config()

const startServer = async () => {
    try{
        const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@${process.env.ENDPOINT_DB}/${process.env.NAME_DB}?retryWrites=true&w=majority`

        await mongoose.connect(uri)
      
      
        const PORT: number = 5000 || process.env.PORT
        const app = express()
      
        const _server = await server()
        await _server.start()
        _server.applyMiddleware({ app })
      
        app.listen(PORT, () => {
          console.log(
            `🚀 Server ready at http://localhost:${PORT}${_server.graphqlPath}`
          )
        })    
    }
    catch(e){
        console.log(e)
    }
}

startServer()
