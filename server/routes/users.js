import express from 'express'
import { User, validateUser } from '../models/user.js'
import bycrptjs from 'bcryptjs'

const router = express.Router()

router.put('/update/:userId', async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).send('You are not allowed to update this user')
    }
    if (req.body.username.includes(' ')) {
      return res.status(400).send('Username cannot contains spaces')
    }

    const { username, email, password } = req.body
    if (!password) {
      req.body.password = 'dummypass'
    }

    const { error } = validateUser(req.body)
    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, '')
      return res
        .status(400)
        .send(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1))
    }

    //check that the username is not taken
    const hasUsername = await User.findOne({
      username,
      _id: { $ne: req.params.userId },
    })
    if (hasUsername) return res.status(404).send('Username is taken')

    //check that the email is not taken
    const hasEmail = await User.findOne({
      email,
      _id: { $ne: req.params.userId },
    })
    if (hasEmail) return res.status(404).send('Email is taken')

    let hashedPassword
    if (password) {
      hashedPassword = bycrptjs.hashSync(password, 10)
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        },
      },
      { new: true }
    )
    const { password: pass, ...rest } = updatedUser._doc
    res.status(200).send(rest)
  } catch (err) {
    res.status(500).send(err.message)
  }
})

router.delete('/delete/:userId', async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).send('You are not allowed to update this user')
    }
    await User.findByIdAndDelete(req.params.userId)
    res.status(200).send('User has been deleted')
  } catch (err) {
    res.status(500).send(err.message)
  }
})

export default router
