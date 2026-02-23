export const SESSION_COOKIE = "admin_session";

export const ALLOWED_ROLES = ["admin", "subAdmin"] as const;
export const ADMIN_ROLES = ["admin"] as const;

export const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
