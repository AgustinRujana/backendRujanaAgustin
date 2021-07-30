import express from 'express'
import passport from '../middleware/auth.js'
import routes from '../routes/routes.js'
import secureRoute from '../routes/secureRoutes.js'

const router = express.Router()

router.use('/', routes)
router.use('/user', passport.authenticate('jwt', {session: false}), secureRoute)

export default router