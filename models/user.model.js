import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const sessionSubSchema = new mongoose.Schema({
    session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        validate: {
            validator: validator.isStrongPassword,
            message: "Password should be at least 8 characters long with 1 uppercase, 1 lowercase, 1 number, and 1 symbol"
        }
    },
    name: {
        type: String,
        required: [true, "Please provide a name"],
        minlength: [2, "Name must have at least 2 characters"],
        maxlength: [100, "Name must have at most 100 characters"]
    },
    sessions:{
        type: [sessionSubSchema],
        default:[]
    }
}, { timestamps: true });


//pre hook for hashing password
userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next()
        try {
             const hashPassword = await bcryptjs.hash(this.password,10)
             this.password = hashPassword
             return next()
        } catch (error) {
            next(error)
        }
})
//methods for generating accessToken
userSchema.methods.generateAccessToken = function(){
    const payload = {
        email:this.email,
        id:this._id.toString()
    }
    const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{
        expiresIn:"15m"
    })
    return accessToken;
}

//methods for generating refreshToken
userSchema.methods.generateRefreshToken = function(){
    const payload = {
        email:this.email,
        id:this._id.toString()
    }
    const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{
        expiresIn:"21d"
    })
    return refreshToken;
}

//method for comparing password
userSchema.methods.comparePassword = async function(password){
    return await bcryptjs.compare(password,this.password)
}


export const User = mongoose.model("user",userSchema)