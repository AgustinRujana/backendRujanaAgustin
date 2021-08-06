import express from 'express'
import passport from 'passport'

import userRoutes from "./user.routes.js"
import imagesRoutes from "./images.routes.js"
import productsRoutes from "./products.routes.js"
import cartRoutes from "./cart.routes.js"
import orderRoutes from "./order.routes.js"

const router = express.Router()

router.use('/products', productsRoutes)
router.use('/user', userRoutes)
router.use('/image', imagesRoutes)
router.use('/cart', passport.authenticate('jwt', {session: false}), cartRoutes)
router.use('/orders',passport.authenticate('jwt', {session: false}), orderRoutes)

export default router
