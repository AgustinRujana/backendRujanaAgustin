import mongoose from "mongoose";

const collectionCarts = 'cart';

//////////////////////////////////
//            Schemas           //
//////////////////////////////////

const cartDetailSchema = mongoose.Schema({
    street: {
        type: String,
        required: true
    },
    streetNumber: {
        type: Number,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    floor: {
        type: String
    },
    apartment: {
        type: String
    }
})

const cartSchema = mongoose.Schema({
    UserId: {
        type: String,
        required: true,
        unique: true
    },
    products: {
        type: Array,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
    },
    updateDate: {
        type: Date,
        required: true,
    },
    details: cartDetailSchema

})

export const cart = mongoose.model(collectionCarts, cartSchema, 'cart')
