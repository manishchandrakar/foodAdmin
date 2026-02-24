const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const isBrowser = typeof window !== "undefined";

export const getStoredAccessToken = (): string | null => {
  if (!isBrowser) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getStoredRefreshToken = (): string | null => {
  if (!isBrowser) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const storeTokens = ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) => {
  if (!isBrowser) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearStoredTokens = () => {
  if (!isBrowser) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
