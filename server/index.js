import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { verifyToken } from './middleware/verifyToken.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/users.js'
import todoRouter from './routes/todo.js'
import listRouter from './routes/lists.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: true,
  credentials: true,
}))

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log(err)
  })

app.use('/auth', authRouter)
app.use('/users', verifyToken, userRouter)
app.use('/todos', verifyToken, todoRouter)
app.use('/lists', verifyToken, listRouter)