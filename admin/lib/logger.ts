import { LogLevel } from "@/types/commonTypes";

// Browser-safe logger
const isDev = process.env.NODE_ENV !== "production";


const formatMessage = (level: LogLevel, message: string) => {
  const timestamp = new Date().toISOString();
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
};

export const logger = {
  debug: (message: string) => {
    if (isDev) {
      console.debug(formatMessage("debug", message));
    }
  },

  info: (message: string) => {
    console.info(formatMessage("info", message));
  },

  warn: (message: string) => {
    console.warn(formatMessage("warn", message));
  },

  error: (message: string) => {
    console.error(formatMessage("error", message));
  },
};
