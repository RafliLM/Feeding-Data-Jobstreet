import express from "express";
import jobController from "./src/controller/job.controller"
import bodyParser from "body-parser";
import errorHandler from "./src/exception/error.handler";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express()
const port = process.env.PORT || 8080
app.use(cors())
app.use(bodyParser.json())
app.use('/jobs', jobController)
app.use(errorHandler)

const specs = swaggerJsdoc({
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Feeding data Jobstreet Express API with Swagger",
        version: "1.0.0",
        description:
          "This is a simple CRUD API application made with ExpressJS + Prisma and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
      },
      servers: [
        {
          url: `http://localhost:${port}`,
        },
      ],
    },
    apis: ["./src/controller/job.controller.ts"],
})

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs))

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})