import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import CustomButton from "@/components/custom/CustomButton";

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  entityName?: string;
}

export const DeleteModal = ({
  open,
  onOpenChange,
  onConfirm,
  entityName = "Item",
}: DeleteModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-sm">
      <DialogHeader className="border-b border-lightGray pb-3">
        <DialogTitle className="text-base font-semibold text-slateGray">
          Delete {entityName}
        </DialogTitle>
      </DialogHeader>
      <p className="text-sm text-gray-500 py-2">
        Are you sure you want to delete this {entityName.toLowerCase()}? This action cannot be undone.
      </p>
      <DialogFooter className="border-t border-lightGray pt-3">
        <CustomButton variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </CustomButton>
        <CustomButton variant="danger" onClick={onConfirm}>
          Delete
        </CustomButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
