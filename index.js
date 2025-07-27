import express from "express";
import cors from "cors";
import transpileRoutes from "./routes/transpileCode.route.js"
import generativeRoutes from "./routes/generate.route.js"
import authRoutes from "./routes/auth.route.js"
import sessionRoute from "./routes/session.route.js"
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { connectTODB } from "./config/db.config.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import "dotenv/config"


const app = express();
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

//routes
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/generate-code",authMiddleware,generativeRoutes)
app.use("/api/v1/transpile-code",authMiddleware,transpileRoutes)
app.use("/api/v1/session",authMiddleware,sessionRoute)

//middleware
app.use(notFoundMiddleware)
app.use(errorMiddleware)
const PORT = process.env.PORT || 4000;
async function runServer(){
  try {
      await connectTODB()
      app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("failed to run server");
    process.exit(1)
  }
}
runServer()
