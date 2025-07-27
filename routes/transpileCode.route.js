import express from "express"
import { transpilCode } from "../controllers/transpileCode.controller.js"


const router = express.Router()

router.route("/").post(transpilCode)

export default router