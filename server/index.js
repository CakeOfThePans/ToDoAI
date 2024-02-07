import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import userRouter from './routes/users.js'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log(err)
    })

app.use('/users', userRouter)