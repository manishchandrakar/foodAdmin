import { ReactNode } from "react";
import CustomButton from "@/components/custom/CustomButton";

interface IEmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = (props: IEmptyStateProps) => {
  const { icon, title, description, actionLabel, onAction } = props;
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
      <div className="mx-auto mb-4">{icon}</div>
      <p className="text-gray-500 font-medium">{title}</p>
      {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
      {actionLabel && onAction && (
        <CustomButton text={actionLabel} className="mt-4" onPress={onAction} />
      )}
    </div>
  );
};

export default EmptyState;
