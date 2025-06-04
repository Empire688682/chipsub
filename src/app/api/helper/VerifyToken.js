import jwt from "jsonwebtoken";


export const verifyToken = (req) => {
    try {
        const token = req.cookies.get("UserToken")?.value || "";
        if (!token) {
            return
        }
        const decodedId = jwt.verify(token, process.env.SECRET_KEY);
        return decodedId.userId
    } catch (error) {
        console.log("ERROR:", error);
    }
};