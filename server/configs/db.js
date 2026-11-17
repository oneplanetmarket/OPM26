
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB Connected Successfully");
            console.log("Database:", mongoose.connection.name);
        });

        mongoose.connection.on("error", (error) => {
            console.error("MongoDB Connection Error:", error.message);
        });

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env file");
        }

        // Connect using the complete MongoDB URI.
        // Do not append another database name.
        await mongoose.connect(process.env.MONGODB_URI);

    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};

export default connectDB;
