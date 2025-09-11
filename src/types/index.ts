import { GoogleTokenPayload, AppleTokenPayload, RegisterRequest } from "./auth.types.js";
import { UpdateUserRequest } from "./user.types.js";

interface JWTPayload {
    id: string;
    email: string;
}

export { UpdateUserRequest, JWTPayload, GoogleTokenPayload, AppleTokenPayload, RegisterRequest };
