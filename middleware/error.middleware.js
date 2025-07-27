

export function errorMiddleware(err,req,res,next){
    const message = err.message || "Something went wrong";
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success:false,message
    })
}