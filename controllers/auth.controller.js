import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyJWT } from "../utils/verifyJwt.js";
import { CustomError } from "../utils/CustomError.js";

export const signup = asyncHandler(async (req, res, next) => {
    if(!req.body)return next(new CustomError("Please provide a body",400))
    const { email, password, name } = req.body
    if (!email || !password || !name) return next(new CustomError("All fields are required", 400))
    const existingUser = await User.findOne({ email })
    if (existingUser) return next(new CustomError("email already in use", 409))
        
    const user = await User.create({ email, password, name })
    const userObj = user.toObject()
    userObj.password = undefined
    userObj.sessions = undefined
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    res.cookie("refresh-token", refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: true,             // ✅ required for cross-site HTTPS
    sameSite: "None",         // ✅ allow cross-site cookie sending
    });

    return res.status(201).json({
        success: true,
        message: "User created",
        accessToken,
        userObj
    })
})

export const login = asyncHandler(async (req, res, next) => {
    if(!req.body)return next(new CustomError("Please provide a body",400))
    const { email, password } = req.body
    if (!email || !password) return next(new CustomError("All fields are required", 400))
    const user = await User.findOne({ email })
    if (!user) return next(new CustomError("Invalid credential", 400))
    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) return next(new CustomError("Invalid credential", 400))
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    const userObj = user.toObject()
    userObj.password = undefined
    userObj.sessions = undefined
    res.cookie("refresh-token", refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: true,             // ✅ required for cross-site HTTPS
    sameSite: "None",         // ✅ allow cross-site cookie sending
    });

    return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        accessToken,
        userObj
    })
})


export const logout = asyncHandler((async (req, res, next) => {
    res.cookie("refresh-token", "", {
         maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: true,             // ✅ required for cross-site HTTPS
        sameSite: "None", 
    })
    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
}))

export const refresh = asyncHandler(async (req, res, next) => {
    const token = req.cookies["refresh-token"]
    if (!token) return next(new CustomError("Missing refresh token", 400))
    try {
        const decode = verifyJWT(token, 2)
        if (!decode || !mongoose.Types.ObjectId.isValid(decode.id)) return next(new CustomError("Invalid token", 400))
        const user = await User.findById(decode.id)
        if (!user) return next(new CustomError("user not found", 404))
        const accessToken = user.generateAccessToken()
        return res.status(200).json({
            success: true,
            message: "Token refreshed",
            accessToken
        })
    } catch (error) {
        return next(new CustomError("unauthorized or malformed token", 401))
    }
})