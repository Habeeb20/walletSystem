import mongoose from "mongoose"
import dotenv from "dotenv"


dotenv.config()

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,  })
            console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
       
    }
}

export default connectDB;