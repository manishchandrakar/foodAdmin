import { toast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
}

export const showSuccessToast = ({ title, description }: ToastOptions) => {
  toast.success(title, { description });
};

export const showErrorToast = ({ title, description }: ToastOptions) => {
  toast.error(title, { description });
};

export const showWarningToast = ({ title, description }: ToastOptions) => {
  toast.warning(title, { description });
};

export const showInfoToast = ({ title, description }: ToastOptions) => {
  toast.info(title, { description });
};
