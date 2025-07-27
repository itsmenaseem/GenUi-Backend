import mongoose from "mongoose";
import "dotenv/config"

export async function connectTODB(){
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log("connected to databse at host : ",connect.connection.host);
    } catch (error) {
        console.error("failed to connect dabase: ",error.message);
        process.exit(1)
    }
}