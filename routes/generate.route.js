import express from "express"
import multer from "multer";
import { generateCode } from "../controllers/generateCode.controller.js";
const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() });
router.route("/").post(upload.single("image"),generateCode)

export default router;