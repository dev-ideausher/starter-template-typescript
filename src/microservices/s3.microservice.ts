import fs from "fs/promises";
import path from "path";

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import { ApiError } from "@utils";
import { config } from "@config";

interface S3Response {
    url: string;
    key: string;
}

const s3 = new S3Client({
    region: config.aws.s3.region,
    credentials: {
        accessKeyId: config.aws.s3.accessKeyId,
        secretAccessKey: config.aws.s3.secretAccessKey,
    },
});

function generateKey(folder: string, fileName: string, visibility: boolean): string {
    return `${visibility ? "private" : "public"}/${folder}/${fileName}`;
}

export class S3Service {
    static uploadOnS3 = async (
        localFilePath: string,
        folder: string,
        visibility: boolean = false
    ): Promise<S3Response | null> => {
        try {
            if (!localFilePath) return null;

            const fileContent = await fs.readFile(localFilePath);
            const fileName = path.basename(localFilePath);
            const bucket = config.aws.s3.bucket;

            const key = generateKey(folder, fileName, visibility);

            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: fileContent,
            });

            await s3.send(command);

            await fs.unlink(localFilePath);

            const result: S3Response = {
                url: `https://${bucket}.s3.${config.aws.s3.region}.amazonaws.com/${key}`,
                key,
            };

            console.log("File uploaded", result.url);
            return result;
        } catch (error) {
            if (localFilePath) await fs.unlink(localFilePath);
            console.error("Error while uploading to S3", error);
            throw new ApiError(500, "Failed to upload file to S3");
        }
    };

    static deleteFromS3 = async (key: string): Promise<{ success: boolean }> => {
        try {
            if (!key) return { success: false };

            const bucket = config.aws.s3.bucket;

            const command = new DeleteObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            await s3.send(command);

            console.log("File deleted", key);
            return { success: true };
        } catch (error) {
            console.error("Error while deleting from S3", error);
            return { success: false };
        }
    };
}
