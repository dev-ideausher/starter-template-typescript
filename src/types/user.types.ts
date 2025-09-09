export interface UpdateUserRequest {
    username?: string;
    name?: string;
    avatar?: {
        id: string;
        url: string;
    };
}
