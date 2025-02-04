import express, { NextFunction, Request, Response } from 'express'
import { HttpError } from 'http-errors'
import logger from './config/logger'

const app = express()

app.get('/', (req, res) => {
    // const err = createHttpError(401, 'You cannot access this route')
    // next(err)
    // throw err
    res.send('Welcome to Auth service')
})

// global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message)
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        error: {
            type: err.name,
            message: err.message,
            path: '',
            location: '',
        },
    })
})

export default app
