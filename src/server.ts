// import "module-alias/register.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import { connectDB } from "@config";

dotenv.config();

const PORT: number = parseInt(process.env.PORT || "8000", 10);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const initializeServer = async (): Promise<void> => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on Port: ${PORT}`);
        });

        const tempDir: string = path.join(__dirname, "../", "temp");
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
            console.log("Folder created succesfully");
        }
    } catch (error) {
        console.error("Failed to start server!!", error);
    }
};

initializeServer();
