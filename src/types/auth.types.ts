export interface GoogleTokenPayload {
    sub: string;
    email: string;
    email_verified: boolean;
    given_name: string;
    family_name: string;
    picture?: string;
}

export interface AppleTokenPayload {
    sub: string;
    email?: string;
    email_verified?: boolean;
}

export interface RegisterRequest {
    username: string;
    name: string;
}
