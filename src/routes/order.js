export default function orderRoutes(app, passport) {
    app.route('/api/orders')
        .get()
    app.route('/api/orders/:orderId')
        .get()
    app.route('/api/orders/complete')
        .post()
}