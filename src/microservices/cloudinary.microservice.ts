import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "../config";

interface CloudinaryResponse {
    url: string;
    id: string;
}

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

export class CloudinaryService {
    static uploadOnCloudinary = async (
        localFilePath: string
    ): Promise<CloudinaryResponse | null> => {
        try {
            if (!localFilePath) return null;

            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto",
            });
            console.log("File uploaded", response.url);
            fs.unlinkSync(localFilePath);

            const result: CloudinaryResponse = {
                url: response.secure_url,
                id: response.public_id,
            };
            return result;
        } catch (error) {
            fs.unlinkSync(localFilePath);
            console.log("Error while uploading to cloudinary");
            return null;
        }
    };

    static deleteFromCloudinary = async (publicId: string): Promise<any | null> => {
        try {
            if (!publicId) return null;
            return await cloudinary.uploader.destroy(publicId, {
                resource_type: "image",
            });
        } catch (error) {
            console.log("Error deleting file", error);
            return null;
        }
    };
}
