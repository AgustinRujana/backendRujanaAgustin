import express from 'express'
import { body, validationResult} from 'express-validator'
import jwt from 'jsonwebtoken'

import config from '../../config.js'
import passport from '../middleware/auth.js'


const router = express.Router()

router.post('/signup',
    //express-validator es el middleware encargado de validar, es practico pero te queda este choclo
    body('phone').isNumeric().withMessage('This field just allow numbers'),
    body('name').isString().withMessage('This field just allow text'),
    body('email').isEmail().withMessage('Must be an email'),
    body('name').notEmpty().withMessage('This field is required'),
    body('email').notEmpty().withMessage('This field is required'),
    body('phone').notEmpty().withMessage('This field is required'),
    body('password').notEmpty().withMessage('This field is required'),
    body('passwordDup').notEmpty().withMessage('This field is required'),
    // Fin del choclo

    (req, res) => {
    let errors = validationResult(req).errors //Traigo los errores del middleware
    if(errors.length !== 0) {
        let errorMsg = {}

        //Aca estructuramos el objeto que devuelve express-validator en algo que nos sirva
        errors.forEach(e => {
            errorMsg[e.param] = e.msg                               
        })

        res.status(400).json({errors: errorMsg})
    } else {
        //Sino hay errores solo queda chequear la igualdad de las contrasenas
        if (req.body.password !== req.body.passwordDup) { return res.status(400).json({message: 'Passwords need to match'}) }
        passport.authenticate('signup', async(err, user, info) => {
            try {
                if(err){
                    const error = new Error('An error ocurred')
                    return next(error)
                }

                if (!user && info) {
                    return res.status(400).json({ message: info.message })
                }

                res.status(201).json({
                    message: 'Signup successful',
                    user: user
                })

            } catch (error) {
                return next(error)
            }
            
        })(req, res)
    }
})

router.post('/login',
    //express-validator es el middleware encargado de validar, es practico pero te queda este choclo
    body('email').notEmpty().withMessage('This field is required'),
    body('password').notEmpty().withMessage('This field is required'),
    // Fin del choclo

    (req, res) => {
    let errors = validationResult(req).errors //Traigo los errores del middleware
    if(errors.length !== 0) {
        let errorMsg = {}

        //Aca estructuramos el objeto que devuelve express-validator en algo que nos sirva
        errors.forEach(e => {
            errorMsg[e.param] = e.msg                               
        })

        res.status(400).json({errors: errorMsg})
    } else {
        //Sino hay errores solo queda chequear la igualdad de las contrasenas
        passport.authenticate('login', async(err, user, info) => {
            try {
                if(err){
                    const error = new Error('An error ocurred')
                    return error
                }

                if (!user && info) {
                    return res.status(401).json({ message: info.message })
                }

                req.login(user, {session: false}, async (err) => {
                    if (err) return err

                    const body = { _id: user._id, email: user.email }
                    const token = jwt.sign({ user: body }, config.JWT_SECRET_KEY, {expiresIn: config.TOKEN_KEEP_ALIVE})

                    return res.json({ token })
                })

            } catch (error) {
                return error
            }
            
        })(req, res)
    }
})

export default router