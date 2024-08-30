import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { BadRequestError } from "./errors/BadRequest.error"

export default (err, req, res, next) => {
    if (err instanceof BadRequestError)
        return res.status(400).send(err.message)
    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025')
            return res.status(404).send("JobId not found")
    }
    console.log(err)
    return res.status(500).send("Internal Server Error")
}