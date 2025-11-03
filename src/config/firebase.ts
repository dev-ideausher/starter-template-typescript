import admin from "firebase-admin";

import config from "./config.js";

const serviceAccount = {
    projectId: config.firebase.projectId,
    privateKey: config.firebase.privateKey.replace(/\\n/g, "\n"),
    clientEmail: config.firebase.clientEmail,
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const firestore = admin.firestore();
export const auth = admin.auth();

export default admin;
