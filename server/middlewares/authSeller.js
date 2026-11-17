
import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
    try {
        const { sellerToken } = req.cookies || {};

        if (!sellerToken) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Please login as seller.",
            });
        }

        const tokenDecode = jwt.verify(
            sellerToken,
            process.env.JWT_SECRET
        );

        if (tokenDecode.email !== process.env.SELLER_EMAIL) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized.",
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired seller session.",
        });
    }
};

export default authSeller;
