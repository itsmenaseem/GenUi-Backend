import express from "express"
import { createMessage, createSession, getSessionById, sessions } from "../controllers/session.controller.js"

const router = express.Router()

router.route("/all").get(sessions)
router.route("/create").post(createSession)
router.route("/:sessionId").get(getSessionById)
router.route("/create-message").post(createMessage)


export  default router