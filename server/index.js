import './config/config.js'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'

import { verifyToken } from './middleware/verifyToken.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/users.js'
import todoRouter from './routes/todos.js'
import listRouter from './routes/lists.js'
import aiRouter from './routes/ai.js'

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


app.use('/api/auth', authRouter)
app.use('/api/users', verifyToken, userRouter)
app.use('/api/todos', verifyToken, todoRouter)
app.use('/api/lists', verifyToken, listRouter)
app.use('/api/ai', verifyToken, aiRouter)

//serve static file from frontend
const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'))
})