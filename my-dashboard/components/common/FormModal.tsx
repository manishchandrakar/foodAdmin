import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import CustomButton from "@/components/custom/CustomButton";
import { cn } from "@/utils/utils";

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSubmit: React.FormEventHandler<HTMLFormElement> | (() => void);
  isSubmitting?: boolean;
  submitLabel?: string;
  children: React.ReactNode;
  asForm?: boolean;
  className?: string;
}

export const FormModal = ({
  open,
  onOpenChange,
  title,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save",
  children,
  asForm = false,
  className,
}: FormModalProps) => {
  const footer = (
    <DialogFooter>
      <CustomButton variant="outline" type="button" onClick={() => onOpenChange(false)}>
        Cancel
      </CustomButton>
      <CustomButton
        type={asForm ? "submit" : "button"}
        isDisabled={isSubmitting}
        isLoading={isSubmitting}
        text={submitLabel}
        onClick={!asForm ? (onSubmit as () => void) : undefined}
      />
    </DialogFooter>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-lg flex flex-col max-h-[90vh]", className)}>
        <DialogHeader className="shrink-0 border-b border-lightGray pb-3">
          <DialogTitle className="text-base font-semibold text-slateGray">{title}</DialogTitle>
        </DialogHeader>

        {asForm ? (
          <form
            onSubmit={onSubmit as React.FormEventHandler<HTMLFormElement>}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto grid gap-4 py-4 pr-1">
              {children}
            </div>
            <div className="shrink-0 pt-3 border-t border-lightGray">{footer}</div>
          </form>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto grid gap-4 py-4 pr-1 min-h-0">
              {children}
            </div>
            <div className="shrink-0 pt-3 border-t border-lightGray">{footer}</div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
