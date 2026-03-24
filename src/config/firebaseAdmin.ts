import * as admin from 'firebase-admin';
// Ensure "resolveJsonModule": true is in your tsconfig.json
import { config } from "@config";


// Use type assertion to help TS understand the ServiceAccount shape
const cert = admin.credential.cert(config.firebase.serviceAccount as admin.ServiceAccount);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: cert,
    }, config.firebase.appName);
}

export const adminApp = admin.app(config.firebase.appName);
export const auth = adminApp.auth();
export { admin };
