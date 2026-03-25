// import "module-alias/register.js";
import "reflect-metadata";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import { connectDB, config } from "@config";

const PORT: number = config.port;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
