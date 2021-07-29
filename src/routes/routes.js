import express from 'express'
import passport from '../middleware/auth.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post(
    '/signup',
    passport.authenticate('signup', {session : false}),
    async (req, res, next) => {
        res.json({
            message: 'Signup successful',
            user: req.user
        })
    }
)

router.get(
    '/signup', (req, res) => {
        res.send('Working')
    }
) //THIS WORKS

router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate('login', async(err, user, info) => {
            try {
                if(err){
                    const error = new Error('An error ocurred')
                    return next(error)
                }

                if (!user && info) {
                    return res.status(401).json({ message: info.message})
                }
            } catch (error) {
                
            }
        })
    }
)

export default router