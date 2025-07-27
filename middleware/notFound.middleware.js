
export function notFoundMiddleware(req,res,next){
    return res.status(404).json({
        success:false,
        messgae:"Resource not found "
    })
}