export interface Avatar {
    id: string;
    url: string;
}

export interface CompleteProfileData {
    name: string;
    username: string;
    avatarLocalPath?: string;
    favoriteChurch?: string;
    bio?: string;
}

export interface EditProfileData {
    name?: string;
    username?: string;
    avatarLocalPath?: string;
    favoriteChurch?: string;
    bio?: string;
}
