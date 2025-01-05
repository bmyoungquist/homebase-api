import express from 'express'
import * as dotevnv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import v1 from './routes/v1'
import { errorHandler } from './middleware/error-handler'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import '@/middleware/passport-jwt-strategy'

dotevnv.config()

if (!process.env.PORT) {
	console.log(`Port not specified...`)
}

const PORT = parseInt(process.env.PORT as string, 10)

const app = express()

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(cookieParser())
// app.use(passport.initialize());

// routes
app.use('/v1', v1)

// handle errors (this needs to be last)
app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`)
})
