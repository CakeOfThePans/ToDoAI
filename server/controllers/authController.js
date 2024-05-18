import { User, validateUser } from '../models/user.js'
import { List } from '../models/list.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res) => {
  try {
    const { error } = validateUser(req.body)
    if (error) {
      const errorMessage = error.details[0].message.replace(/"/g, '')
      return res
        .status(400)
        .send(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1))
    }
    if (req.body.username.includes(' ')) {
      return res.status(400).send('Username cannot contains spaces')
    }

    const { username, email, password } = req.body
    //check that the username is not taken
    const hasUsername = await User.findOne({ username })
    if (hasUsername) return res.status(409).send('Username is taken')

    //check that the email is not taken
    const hasEmail = await User.findOne({ email })
    if (hasEmail) return res.status(409).send('Email is taken')

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt)

    let user = new User({
      username,
      email,
      password: hashedPassword,
    })
    user = await user.save()

    let defaultList = new List({
      userId: user._id,
      name: 'General',
      order: 1
    })
    defaultList = await defaultList.save()
    user.defaultList = defaultList._id
    await user.save()

    res.send('Signup successful')
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || email === '') {
      return res.status(400).send('Missing email')
    }
    if (!password || password === '') {
      return res.status(400).send('Missing password')
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).send('Invalid email or password')
    }
    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      return res.status(404).send('Invalid email or password')
    }

    const { password: pass, ...rest } = user._doc
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res
      .cookie('access_token', token, {
        httpOnly: false,
      })
      .send(rest)
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export const signOut = (req, res) => {
  try {
    res.clearCookie('access_token').send('User has been signed out')
  } catch (err) {
    res.status(500).send(err.message)
  }
}
