import express from "express";
import jobController from "./src/controller/job.controller"
import bodyParser from "body-parser";
import errorHandler from "./src/exception/error.handler";
import cors from "cors";

const app = express()
const port = process.env.PORT || 8080
app.use(cors())
app.use(bodyParser.json())
app.use('/jobs', jobController)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})