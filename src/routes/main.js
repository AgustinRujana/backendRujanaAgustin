import express from 'express'
import passport from '../middleware/auth.js'
import routes from '../routes/routes.js'
import secureRoutes from '../routes/secureRoutes.js'

const router = express.Router()

router.use('/', routes)
router.use('/images', secureRoutes)

export default router