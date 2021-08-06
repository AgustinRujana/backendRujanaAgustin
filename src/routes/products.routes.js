import express from 'express'
import passport from 'passport'

import { body, validationResult} from 'express-validator'
import * as productService from '../services/product.service.js'

const productsRouter = express.Router();

    productsRouter.route('/').get(productService.getProducts)

    //productsRouter.route('/').get((req, res) => { res.send('Funciona')} )

    productsRouter.route('/').post(        
            passport.authenticate('jwt', {session: false}), //HAY QUE ARREGLAR LA AUTENTICACION
            (req, res, next) => {
                if(req.user.admin === false) { res.status(401).json({ message: 'Not an admin'}) }
                next()
            },
            body('stock').isNumeric().withMessage('This field just allow numbers'),
            body('price').isNumeric().withMessage('This field just allow numbers'),
            body('name').notEmpty().withMessage('This field is required'),
            body('description').notEmpty().withMessage('This field is required'),
            body('category').notEmpty().withMessage('This field is required'),
            body('price').notEmpty().withMessage('This field is required'),
            body('stock').notEmpty().withMessage('This field is required'),
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
                    productService.addProduct(req, res)
                }
            }
        )
    productsRouter.route('/:category').get(productService.getCategorie)

    productsRouter.route('/:productId').patch(
            passport.authenticate('jwt', {session: false}), //HAY QUE ARREGLAR LA AUTENTICACION
            (req, res, next) => {
                if(req.user.admin === false) { res.status(401).json({ message: 'Not an admin'}) }
                next()
            },
            productService.updateOne            
        )

    productsRouter.delete(productService.deleteOne)


export default productsRouter;