import multer, { StorageEngine } from "multer";
import { v4 as uuidv4 } from "uuid";
import config from "../config/config";

const storage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = config.nodeEnv === "vercel" ? "/tmp" : "./temp";
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + uuidv4());
    },
});

export const upload = multer({ storage });
