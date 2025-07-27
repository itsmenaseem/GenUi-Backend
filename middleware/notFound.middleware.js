import { CustomError } from "../utils/customError.js";


export function notFoundMiddleware(req,res,next){
    return next(new CustomError("resource not found"))
}