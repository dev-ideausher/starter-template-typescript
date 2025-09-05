import nodemailer from "nodemailer";
import config from "./config";

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: parseInt(config.email.port),
    secure: false,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

export default transporter;
