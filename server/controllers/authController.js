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
		if (hasUsername) return res.status(400).send('Username is taken')

		//check that the email is not taken
		const hasEmail = await User.findOne({ email })
		if (hasEmail) return res.status(400).send('Email is taken')

		const salt = bcrypt.genSaltSync(10)
		const hashedPassword = bcrypt.hashSync(password, salt)

		let user = new User({
			username,
			email,
			password: hashedPassword,
		})
		user = await user.save()

		let defaultList = new List({
			userId: user._id,
			name: 'Inbox',
			order: 1,
			color: '#039BE5', //default color
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
		const { emailOrUsername, password } = req.body
		if (!emailOrUsername || emailOrUsername === '') {
			return res.status(400).send('Missing email or username')
		}
		if (!password || password === '') {
			return res.status(400).send('Missing password')
		}

		const user = await User.findOne({
			$or: [{ email: emailOrUsername }, { username: emailOrUsername }],
		})
		if (!user) {
			return res.status(404).send('Invalid email, username or password')
		}
		const validPassword = bcrypt.compareSync(password, user.password)
		if (!validPassword) {
			return res.status(404).send('Invalid email, username or password')
		}

		const { password: pass, ...rest } = user._doc
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
		res.send({ ...rest, token })
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export const signOut = (req, res) => {
	try {
		res.send('User has been signed out')
	} catch (err) {
		res.status(500).send(err.message)
	}
}
