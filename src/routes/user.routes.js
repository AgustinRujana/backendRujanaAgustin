import jwt from 'jsonwebtoken'
import express from 'express'
import passport from 'passport'

import config from '../../config.js'

const userRouter = express.Router()

userRouter.route('/signup').post(
    (req, res) => {
        //Sino hay errores solo queda chequear la igualdad de las contrasenas
        if (req.body.password !== req.body.passwordDup) { return res.status(400).json({message: 'Passwords need to match'}) }
        else {
            passport.authenticate('signup', async(err, user, info) => {
                try {
                    if(err){
                        return res.status(500).json(err)
                    }

                    if (!user && info) {
                        return res.status(400).json({ message: info.message })
                    }

                    res.status(201).json({
                        message: 'Signup successful',
                        user: user
                    })

                } catch (err) {
                    return res.status(500).json(err)
                }   
            })(req, res)
        }
    }
)

userRouter.route('/login').post(
    (req, res) => {
        //Sino hay errores solo queda chequear la igualdad de las contrasenas
        passport.authenticate('login', async(err, user, info) => {
            try {
                if(err){
                    console.log('Primer error')
                    return res.status(500).json(err)
                }

                if (!user && info) {
                    return res.status(401).json({ message: info.message })
                }

                req.logIn(user, {session: false}, async (err) => {
                    if (err) return res.status(500).json(err)

                    const body = { _id: user._id, email: user.email }
                    const token = jwt.sign({ user: body }, config.JWT_SECRET_KEY, {expiresIn: config.TOKEN_KEEP_ALIVE})

                    return res.json({ token })
                })

            } catch (err) {
                console.log('Segundo error')
                return res.status(500).json(err)
            }
            
        })(req, res)
    }
)

export default userRouter;
