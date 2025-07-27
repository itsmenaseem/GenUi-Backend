import mongoose from "mongoose"



const sessionSchema = new mongoose.Schema({
    chats: []
}, { timestamps: true });


export const Session = mongoose.model("session", sessionSchema)