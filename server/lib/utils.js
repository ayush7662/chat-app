import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET || "default_jwt_secret_key");
    return token;
}
