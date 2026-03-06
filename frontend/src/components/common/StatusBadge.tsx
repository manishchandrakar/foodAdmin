import { statusConfig } from "@/utils/constant";

interface IStatusBadgeProps {
  status: string;
}

const StatusBadge = (props: IStatusBadgeProps) => {
  const { status } = props;
  const cfg = statusConfig[status] ?? statusConfig.pending;

  return (
    <span
      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
};

export default StatusBadge;
