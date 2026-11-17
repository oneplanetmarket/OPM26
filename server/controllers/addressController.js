
import Address from "../models/Address.js";

// ==========================================
// ADD ADDRESS
// POST /api/address/add
// ==========================================

export const addAddress = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;
        const { address } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Please Login."
            });
        }

        if (!address || typeof address !== "object") {
            return res.status(400).json({
                success: false,
                message: "Address details are required"
            });
        }

        const {
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            zipcode,
            country,
            phone
        } = address;

        // Validate required fields.
        const requiredFields = {
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            zipcode,
            country,
            phone
        };

        for (const [field, value] of Object.entries(requiredFields)) {
            if (
                value === undefined ||
                value === null ||
                String(value).trim() === ""
            ) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        // Validate email.
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        // Validate phone.
        const cleanPhone = String(phone).replace(/\D/g, "");

        if (!/^\d{10}$/.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 10-digit phone number"
            });
        }

        // Validate PIN code.
        const cleanZipcode = String(zipcode).trim();

        if (!/^\d{4,10}$/.test(cleanZipcode)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid postal code"
            });
        }

        const newAddress = await Address.create({
            userId: String(userId),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            street: street.trim(),
            city: city.trim(),
            state: state.trim(),
            zipcode: Number(cleanZipcode),
            country: country.trim(),
            phone: cleanPhone
        });

        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            address: newAddress
        });

    } catch (error) {
        console.error("ADD ADDRESS ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Unable to add address"
        });
    }
};

// ==========================================
// GET USER ADDRESSES
// GET /api/address/get
// ==========================================

export const getAddress = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Please Login."
            });
        }

        const addresses = await Address.find({
            userId: String(userId)
        }).sort({ _id: -1 });

        return res.status(200).json({
            success: true,
            addresses
        });

    } catch (error) {
        console.error("GET ADDRESS ERROR:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Unable to fetch addresses"
        });
    }
};
