import mongoose from "mongoose";

const collectionMessages = 'messages';

//////////////////////////////////
//            Schemas           //
//////////////////////////////////

const messagesSchema = mongoose.Schema({
    UserId: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true
    },
    messagge: {
        type: String,
        required: true,
    }
})

export const messagges = mongoose.model(collectionMessages, messagesSchema, 'messages')
