
import express from "express";
import mongoose from "mongoose";
import ProducerApplication from "../models/ProducerApplication.js";
import authSeller from "../middlewares/authSeller.js";

const router = express.Router();

const allowedStatuses = ["pending", "approved", "rejected"];

// 1. Submit producer application (Public)
router.post("/submit", async (req, res) => {
    try {
        const applicationData = req.body;

        if (!applicationData || Object.keys(applicationData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Application data is required",
            });
        }

        const application = new ProducerApplication(applicationData);
        await application.save();

        return res.status(201).json({
            success: true,
            message: "Producer application submitted successfully",
            application,
        });

    } catch (error) {
        console.error("Producer application submission error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to submit producer application",
        });
    }
});


// 2. Get all producer applications (Seller only)
router.get("/applications", authSeller, async (req, res) => {
    try {
        const applications = await ProducerApplication
            .find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications,
        });

    } catch (error) {
        console.error("Fetch producer applications error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch producer applications",
        });
    }
});


// 3. Update producer application status (Seller only)
router.patch("/status/:id", authSeller, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application ID",
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Use pending, approved, or rejected",
            });
        }

        const application = await ProducerApplication.findByIdAndUpdate(
            id,
            { $set: { status } },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Producer application not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Producer application status updated successfully",
            application,
        });

    } catch (error) {
        console.error("Update producer application status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update producer application status",
        });
    }
});

export default router;
