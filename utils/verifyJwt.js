import jwt from "jsonwebtoken";
import "dotenv/config";

export function verifyJWT(token, type) {
    try {
        let secret;
        if (type === 1) {
            secret = process.env.JWT_ACCESS_SECRET;
        } else if (type === 2) {
            secret = process.env.JWT_REFRESH_SECRET; 
        } else {
            throw new Error("Invalid token type");
        }

        if (!secret) {
            throw new Error("Missing JWT secret in environment");
        }

        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        console.error(error.message)
        return null;
    }
}
