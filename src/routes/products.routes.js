import express from 'express'
import passport from 'passport'

import * as productService from '../services/product.service.js'

const productsRouter = express.Router();

productsRouter.route('/').get(productService.getProducts)

productsRouter.route('/').post(        
    passport.authenticate('jwt', {session: false}),
    (req, res, next) => {
        if(req.user.admin === false) { res.status(401).json({ message: 'Not an admin'}) }
        next()
    },
    (req, res) => {
        productService.addProduct(req, res)
    }
)

productsRouter.route('/:category').get(productService.getCategorie)

productsRouter.route('/:productId').patch(
        passport.authenticate('jwt', {session: false}),
        (req, res, next) => {
            if(req.user.admin === false) { res.status(401).json({ message: 'Not an admin'}) }
            next()
        },
        productService.updateOne            
    )

productsRouter.route('/:productId').delete(productService.deleteOne)


export default productsRouter;