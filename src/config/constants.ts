export const userTypes = {
    ALL: "All",
    ADMIN: "Admin",
    CLIENT: "Client",
};

export const S3Folders = {
    profilePics: "profilePics",
};

const imgTypeToExtension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/jpg": "jpg",
    "image/svg": "svg",
    "image/svg+xml": "svg+xml",
};

const docTypeToExtension = {
    "text/plain": "txt",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.ms-excel": "xls",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
};

const imageTypes = Object.keys(imgTypeToExtension);
const docTypes = Object.keys(docTypeToExtension);
export const fileTypes = [...imageTypes, ...docTypes];
