import { CustomError } from "../utils/CustomError.js";
import { verifyJWT } from "../utils/verifyJwt.js";

function getToken(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }
    return null;
}

export function authMiddleware(req, res, next) {
    const token = getToken(req);

    if (!token) {
        return next(new CustomError("Please provide a valid token", 400));
    }

    const decoded = verifyJWT(token, 1);
    if (!decoded) {
        return next(new CustomError("Invalid token", 400));
    }

    req.user = decoded;
    next();
}
