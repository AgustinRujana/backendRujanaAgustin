import mongoose from "mongoose";

const connectToDatabase = async (databaseUrl) => {
    try {
        await mongoose.connect(databaseUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Mongo DB connected')
    }
    catch(error) {
        console.log('Error to connect to MongoDB')
    }
}

export default connectToDatabase