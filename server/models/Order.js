
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            ref: "user"
        },

        items: [
            {
                product: {
                    type: String,
                    required: true,
                    ref: "product"
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        address: {
            type: String,
            required: true,
            ref: "address"
        },

        status: {
            type: String,
            default: "Order Placed"
        },

        paymentType: {
            type: String,
            required: true,
            enum: ["COD", "Online"]
        },

        isPaid: {
            type: Boolean,
            required: true,
            default: false
        },

        cashfreeOrderId: {
            type: String,
            default: null,
            index: true
        }
    },
    {
        timestamps: true
    }
);

const Order =
    mongoose.models.order ||
    mongoose.model("order", orderSchema);

export default Order;
