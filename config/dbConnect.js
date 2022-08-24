import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config()


export const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        //                                            set color (library 'colors')
        console.log(`Mongo connected ${conn.connection.host}`.cyan.bgGreen)
    } catch (error) {
        console.log(`Cannot connect to mongodb ! Error: ${error}`)
    }
};