
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: [String],
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        offerPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        image: {
            type: [String],
            required: true,
            validate: {
                validator: (images) =>
                    Array.isArray(images) && images.length > 0,
                message: "At least one product image is required",
            },
        },

        video: {
            type: String,
            default: "",
        },

        category: {
            type: String,
            required: true,
        },

        inStock: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product =
    mongoose.models.product ||
    mongoose.model("product", productSchema);

export default Product;
