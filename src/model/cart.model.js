import mongoose from "mongoose";

const collectionCarts = 'cart';

//////////////////////////////////
//            Schemas           //
//////////////////////////////////

const cartDetailSchema = mongoose.Schema({
    street: {
        type: String,
    },
    streetNumber: {
        type: Number,
    },
    postalCode: {
        type: String,
    },
    floor: {
        type: String
    },
    apartment: {
        type: String
    }
})

const cartSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    products: {
        type: Array,
        required: true
    },
    details: cartDetailSchema
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})

export const cart = mongoose.model(collectionCarts, cartSchema, 'cart')
