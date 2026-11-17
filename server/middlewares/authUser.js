
import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Please Login."
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from environment variables.");

            return res.status(500).json({
                success: false,
                message: "Server authentication configuration error."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid Authentication Token"
            });
        }

        req.user = {
            id: decoded.id
        };

        req.userId = decoded.id;

        // Keep compatibility with controllers using req.body.userId.
        req.body = req.body || {};
        req.body.userId = decoded.id;

        next();

    } catch (error) {
        console.error("AUTH ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired login session"
        });
    }
};

export default authUser;
