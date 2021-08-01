import mongoose from "mongoose";

const collectionOrders = 'order';

//////////////////////////////////
//            Schemas           //
//////////////////////////////////

const orderSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    items: {
        type: Array,
        required: true
    },
    creationDate: {
        type: Date,
        required: true,
    },
    state: {
        type: Date,
        required: true,
    },
    total: {
        type: Number,
        required: true
    }
})

export const order = mongoose.model(collectionOrders, orderSchema, 'order')
