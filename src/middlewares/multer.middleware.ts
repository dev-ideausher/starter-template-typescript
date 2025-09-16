import multer, { FileFilterCallback, StorageEngine } from "multer";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
import { ApiError } from "@utils";
import { fileTypes, config } from "@config";

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (fileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        console.log(file);
        cb(new ApiError(httpStatus.BAD_REQUEST, "Invalid file or data"));
    }
};

const storage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = config.nodeEnv === "vercel" ? "/tmp" : "./temp";
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + "-" + uuidv4());
    },
});

export const upload = multer({ storage, fileFilter });
