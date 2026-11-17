
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import mongoose from "mongoose";

import Product from "../models/Product.js";

// ==========================================
// REMOVE TEMPORARY MULTER FILES
// ==========================================

const removeTempFiles = async (files = []) => {
    await Promise.all(
        files.map(async (file) => {
            if (!file?.path) return;

            try {
                await fs.unlink(file.path);
            } catch (error) {
                if (error.code !== "ENOENT") {
                    console.warn(
                        "Temporary file cleanup error:",
                        error.message
                    );
                }
            }
        })
    );
};

// ==========================================
// REMOVE CLOUDINARY FILES
// ==========================================

const removeCloudinaryFiles = async (assets = []) => {
    await Promise.all(
        assets.map(async (asset) => {
            try {
                await cloudinary.uploader.destroy(
                    asset.public_id,
                    {
                        resource_type: asset.resource_type,
                    }
                );
            } catch (error) {
                console.error(
                    "Cloudinary cleanup error:",
                    error.message
                );
            }
        })
    );
};

// ==========================================
// ADD PRODUCT
// POST /api/product/add
// ==========================================

export const addProduct = async (req, res) => {
    const uploadedFiles = [
        ...(req.files?.images || []),
        ...(req.files?.video || []),
    ];

    const cloudinaryAssets = [];

    try {
        // Check product data
        if (!req.body.productData) {
            return res.status(400).json({
                success: false,
                message: "Product information is required.",
            });
        }

        let productData;

        try {
            productData = JSON.parse(req.body.productData);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid product information.",
            });
        }

        if (
            !productData ||
            typeof productData !== "object" ||
            Array.isArray(productData)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid product information.",
            });
        }

        const {
            name,
            description,
            price,
            offerPrice,
            category,
            inStock,
        } = productData;

        const images = req.files?.images || [];
        const videoFile = req.files?.video?.[0];

        // Validate images
        if (images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one product image.",
            });
        }

        if (images.length > 4) {
            return res.status(400).json({
                success: false,
                message: "Maximum 4 product images are allowed.",
            });
        }

        // Validate name and category
        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof category !== "string" ||
            !category.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Product name and category are required.",
            });
        }

        // Validate description
        const descriptions = Array.isArray(description)
            ? description
            : typeof description === "string"
                ? [description]
                : [];

        if (
            descriptions.length === 0 ||
            descriptions.some(
                (item) =>
                    typeof item !== "string" ||
                    !item.trim()
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid product descriptions are required.",
            });
        }

        // Validate prices
        if (
            price === "" ||
            price === null ||
            price === undefined ||
            offerPrice === "" ||
            offerPrice === null ||
            offerPrice === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Product price and offer price are required.",
            });
        }

        const parsedPrice = Number(price);
        const parsedOfferPrice = Number(offerPrice);

        if (
            !Number.isFinite(parsedPrice) ||
            !Number.isFinite(parsedOfferPrice) ||
            parsedPrice < 0 ||
            parsedOfferPrice < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid product prices.",
            });
        }

        // ======================================
        // UPLOAD IMAGES TO CLOUDINARY
        // Sequential uploads allow reliable cleanup
        // ======================================

        const imageResults = [];

        for (const file of images) {
            const result = await cloudinary.uploader.upload(
                file.path,
                {
                    resource_type: "image",
                    folder: "one-planet-market/products",
                }
            );

            cloudinaryAssets.push({
                public_id: result.public_id,
                resource_type: "image",
            });

            imageResults.push(result.secure_url);
        }

        // ======================================
        // UPLOAD OPTIONAL VIDEO
        // ======================================

        let videoUrl = "";

        if (videoFile) {
            const videoResult = await cloudinary.uploader.upload(
                videoFile.path,
                {
                    resource_type: "video",
                    folder: "one-planet-market/product-videos",
                }
            );

            cloudinaryAssets.push({
                public_id: videoResult.public_id,
                resource_type: "video",
            });

            videoUrl = videoResult.secure_url;
        }

        // ======================================
        // SAVE PRODUCT IN MONGODB
        // ======================================

        const product = await Product.create({
            name: name.trim(),

            description: descriptions.map(
                (item) => item.trim()
            ),

            price: parsedPrice,
            offerPrice: parsedOfferPrice,

            category: category.trim(),

            image: imageResults,
            video: videoUrl,

            inStock:
                typeof inStock === "boolean"
                    ? inStock
                    : true,
        });

        return res.status(201).json({
            success: true,
            message: "Product added successfully.",
            product,
        });

    } catch (error) {
        console.error("ADD PRODUCT ERROR:", error);

        // Clean up uploaded Cloudinary assets if saving fails
        await removeCloudinaryFiles(cloudinaryAssets);

        return res.status(500).json({
            success: false,
            message: "Unable to add product.",
            error: error.message,
        });

    } finally {
        // Always clean up temporary local files
        await removeTempFiles(uploadedFiles);
    }
};

// ==========================================
// GET ALL PRODUCTS
// GET /api/product/list
// ==========================================

export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length,
            products,
        });

    } catch (error) {
        console.error("PRODUCT LIST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch products.",
        });
    }
};

// ==========================================
// GET SINGLE PRODUCT
// POST /api/product/id
// ==========================================

export const productById = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Valid product ID is required.",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });

    } catch (error) {
        console.error("PRODUCT BY ID ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch product.",
        });
    }
};

// ==========================================
// UPDATE PRODUCT STOCK
// POST /api/product/stock
// ==========================================

export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;

        if (
            !id ||
            !mongoose.isValidObjectId(id) ||
            typeof inStock !== "boolean"
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid product ID and stock status are required.",
            });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { $set: { inStock } },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Stock updated successfully.",
            product,
        });

    } catch (error) {
        console.error("CHANGE STOCK ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update product stock.",
        });
    }
};
