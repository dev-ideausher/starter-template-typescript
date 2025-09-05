import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import config from "../config/config";

interface S3Response {
    url: string;
    id: string;
}

const s3 = new S3Client({
    region: config.aws.s3.region,
    credentials: {
        accessKeyId: config.aws.s3.accessKeyId,
        secretAccessKey: config.aws.s3.secretAccessKey,
    },
});

export class S3Service {
    static uploadOnS3 = async (localFilePath: string): Promise<S3Response | null> => {
        try {
            if (!localFilePath) return null;

            const fileContent = fs.readFileSync(localFilePath);
            const fileName = path.basename(localFilePath);
            const bucket = config.aws.s3.bucket;

            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: fileName,
                Body: fileContent,
            });

            await s3.send(command);

            fs.unlinkSync(localFilePath);

            const result: S3Response = {
                url: `https://${bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`,
                id: fileName,
            };

            console.log("File uploaded", result.url);
            return result;
        } catch (error) {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
            console.log("Error while uploading to S3", error);
            return null;
        }
    };

    static deleteFromS3 = async (id: string): Promise<any | null> => {
        try {
            if (!id) return null;

            const bucket = config.aws.s3.bucket;

            const command = new DeleteObjectCommand({
                Bucket: bucket,
                Key: id,
            });

            await s3.send(command);

            console.log("File deleted", id);
            return { result: "ok", id };
        } catch (error) {
            console.log("Error deleting file from S3", error);
            return null;
        }
    };
}
