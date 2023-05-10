export const CLIENT_ID = "";

export const CLIENT_SECRET = "";

export const REDIRECT_URI = "http://localhost:4200";

// https://www.googleapis.com/auth/drive.file - See, edit, create, and delete only the specific Google Drive files you use with this app
export const G_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";

export const GOOGLE_OAUTH_ENDPOINT = "https://oauth2.googleapis.com/token";

export const DRIVE_FILE_UPLOAD_MULTIPART_ENDPOINT = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

export const DRIVE_FILE_UPLOAD_RESUMABLE_ENDPOINT = "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable";

export const RESET_ACCESS_TOKEN_INTERVAL_MS = 3360000 // 56 minutes

export const DRIVE_URL_OF_FILE = "https://drive.google.com/file/d/";

export const FILE_SIZE_5_MB = 5 * 1024 * 1024;
