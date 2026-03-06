interface IFilterPillsProps {
  options: { label: string; value: string }[];
  activeValue: string;
  onChange: (value: string) => void;
}

const FilterPills = (props: IFilterPillsProps) => {
  const { options, activeValue, onChange } = props;
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {options.map((option) => (
        <button
          key={option.value}
          className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border capitalize ${
            activeValue === option.value
              ? "bg-themeColor text-white border-themeColor"
              : "bg-white text-gray-600 border-gray-200 hover:border-themeColor hover:text-themeColor"
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterPills;
