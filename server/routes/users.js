import express from 'express'
import { User, validateUser } from '../models/user.js' 
import bycrptjs from 'bcryptjs'

const router = express.Router()

router.post('/sign-up', async (req, res) => {
    try{
        const { error } = validateUser(req.body)
        if (error) return res.status(400).send(error.details[0].message)

         //check that the username is not taken
        const hasUsername = await User.findOne({ username: req.body.username})
        if(hasUsername) return res.status(404).send('Username is taken')

        //check that the email is not taken
        const hasEmail = await User.findOne({ email: req.body.email})
        if(hasEmail) return res.status(404).send('Email is taken')
        
        const hashedPassword = bycrptjs.hashSync(req.body.password, 10)

        let user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
    
        user = await user.save()
        res.send(user)
    } 
    catch (err){
        res.status(500).send(err.message)
    }
    


})

export default router