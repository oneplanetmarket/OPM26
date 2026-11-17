
import multer from "multer";
import os from "os";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, os.tmpdir());
    },

    filename: (req, file, cb) => {
        const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        cb(
            null,
            uniqueName + path.extname(file.originalname).toLowerCase()
        );
    },
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "images") {
        const allowedImages = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/avif",
        ];

        if (allowedImages.includes(file.mimetype)) {
            return cb(null, true);
        }

        return cb(new Error("Only JPG, PNG, WEBP, GIF and AVIF images are allowed."));
    }

    if (file.fieldname === "video") {
        const allowedVideos = [
            "video/mp4",
            "video/quicktime",
            "video/webm",
        ];

        if (allowedVideos.includes(file.mimetype)) {
            return cb(null, true);
        }

        return cb(new Error("Only MP4, MOV and WEBM videos are allowed."));
    }

    return cb(new Error("Unexpected file field."));
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024,
        files: 5,
    },
});
