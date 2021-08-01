import userRoutes from "./user.js"
import imagesRoutes from "./images.js"
import productsRoutes from "./products.js"
import cartRoutes from "./cart.js"
import orderRoutes from "./order.js"

export default function mainRoutes(app, passport) {
    userRoutes(app, passport)
    imagesRoutes(app, passport)
    productsRoutes(app, passport)
    cartRoutes(app, passport)
    orderRoutes(app, passport)
}
