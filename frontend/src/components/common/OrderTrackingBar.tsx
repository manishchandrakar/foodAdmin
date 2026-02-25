import { trackingSteps } from "@/utils/constant";

interface IOrderTrackingBarProps {
  currentStatus: string;
}

const OrderTrackingBar = ({ currentStatus }: IOrderTrackingBarProps) => {
  const stepIdx = trackingSteps.indexOf(currentStatus);

  if (stepIdx < 0) return null;

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold text-gray-700 mb-3">Order Tracking</p>
      <div className="flex items-center gap-0">
        {trackingSteps.map((step, i) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                  i <= stepIdx
                    ? "bg-themeColor text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {i <= stepIdx ? "✓" : i + 1}
              </div>
              <span
                className={`text-[10px] sm:text-xs mt-1 capitalize ${
                  i <= stepIdx
                    ? "text-themeColor font-medium"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
            {i < trackingSteps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 mt-[-14px] ${
                  i < stepIdx ? "bg-themeColor" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTrackingBar;
