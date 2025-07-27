import express from "express"
import { login, logout, refresh, signup } from "../controllers/auth.controller.js"

const router = express.Router()

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/refresh").get(refresh)

export default router