import * as cartService from '../services/cart.service.js'

export default function cartRoutes(app, passport) {
    app.route('/api/cart')
        .get(            
            //passport.authenticate('jwt', {session: false}), //HAY QUE ARREGLAR LA AUTENTICACION
            cartService.findOne
        )
    app.route('/api/cart/add')
        .post(
            //passport.authenticate('jwt', {session: false}), //HAY QUE ARREGLAR LA AUTENTICACION
            cartService.addProduct 
        )
    app.route('/api/cart/delete')
        .post(
            //passport.authenticate('jwt', {session: false}), //HAY QUE ARREGLAR LA AUTENTICACION
            cartService.deleteProduct 
        )
    app.route('/api/cart/submit')
        .post()
}