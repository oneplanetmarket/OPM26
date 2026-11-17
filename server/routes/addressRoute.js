
import express from "express";

import authUser from "../middlewares/authUser.js";

import {
    addAddress,
    getAddress
} from "../controllers/addressController.js";

const addressRouter = express.Router();

// Add new address
addressRouter.post("/add", authUser, addAddress);

// Get logged-in user's addresses
addressRouter.get("/get", authUser, getAddress);

export default addressRouter;
