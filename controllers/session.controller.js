import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/CustomError.js";
import mongoose from "mongoose";


export const sessions = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return next(new CustomError("Please login first", 400));

    return res.status(200).json({
        success: true,
        message: "Retrieved all sessions",
        sessions: user.sessions,
    });
});

export const createSession = asyncHandler(async (req, res, next) => {
    const { title } = req.body;
    if (!title || typeof title !== "string" || title.trim() === "") {
        return next(new CustomError("Please provide a valid title", 400));
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return next(new CustomError("Login first", 400));

    const session = await Session.create({ chats: [] });

    const sessionMetaData = {
        title: title.trim(),
        session_id: session._id,
    };

    user.sessions.push(sessionMetaData);
    await user.save();

    return res.status(201).json({
        success: true,
        message: "Session created",
        session: sessionMetaData,
    });
});


export const getSessionById = asyncHandler(async (req, res, next) => {
    const { sessionId } = req.params;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
        return next(new CustomError("Please provide a valid session ID", 400));
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return next(new CustomError("Unauthorized", 403));

    const isCorrectUser = user.sessions.find((session) => session.session_id.toString() === sessionId);
    if (!isCorrectUser) return next(new CustomError("Session not found", 404));

    const session = await Session.findById(sessionId);
    if (!session) return next(new CustomError("Session not found", 404));

    return res.status(200).json({
        success: true,
        session,
    });
});

export const createMessage = asyncHandler(async (req, res, next) => {
    const { message, session_id } = req.body;

    if (!message ||!Array.isArray(message) ||message.length === 0 ||!session_id) {
        return next(new CustomError("Please provide valid message and session_id", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(session_id)) {
        return next(new CustomError("Invalid session ID format", 400));
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) return next(new CustomError("Unauthorized", 403));

    const isCorrectUser = user.sessions.find(
        (session) => session.session_id.toString() === session_id
    );
    if (!isCorrectUser) return next(new CustomError("Session not found", 404));

    const session = await Session.findById(session_id);
    if (!session) return next(new CustomError("Session not found", 404));

    session.chats.push(...message);
    await session.save();

    return res.status(201).json({
        success: true,
        message: "Message(s) created successfully!",
    });
});
