import express from "express";
import authSeller from "../middlewares/authSeller.js";

import {
    addProduct,
    productList,
    productById,
    changeStock,
} from "../controllers/productController.js";

import { upload } from "../configs/multer.js";

const productRouter = express.Router();

productRouter.post(
    "/add",
    authSeller,
    upload.fields([
        { name: "images", maxCount: 4 },
        { name: "video", maxCount: 1 },
    ]),
    addProduct
);

productRouter.get("/list", productList);

productRouter.post("/id", productById);

productRouter.post(
    "/stock",
    authSeller,
    changeStock
);

export default productRouter;