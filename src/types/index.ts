import { GoogleTokenPayload, AppleTokenPayload, RegisterRequest } from "./auth.types";
import { UpdateUserRequest } from "./user.types";

interface JWTPayload {
    id: string;
    email: string;
}

export { UpdateUserRequest, JWTPayload, GoogleTokenPayload, AppleTokenPayload, RegisterRequest };
