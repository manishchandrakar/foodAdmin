import { FiArrowRight } from "react-icons/fi";

interface ISectionHeaderProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  onLinkClick?: () => void;
  center?: boolean;
}

const SectionHeader = (props: ISectionHeaderProps) => {
  const { title, subtitle, linkText, onLinkClick, center } = props;
  return (
    <div className={`flex items-center justify-between mb-6 sm:mb-8 ${center ? "flex-col text-center" : ""}`}>
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-gray-500 text-xs sm:text-sm mt-1">{subtitle}</p>}
      </div>
      {linkText && onLinkClick && (
        <button
          className="text-themeColor text-sm font-medium flex items-center gap-1 hover:underline"
          onClick={onLinkClick}
        >
          {linkText} <FiArrowRight size={15} />
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
