import { Dispatch, SetStateAction } from "react";

interface IQuantitySelectorProps {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  stock: number;
  price: number;
}

const QuantitySelector = ({
  quantity,
  setQuantity,
  stock,
  price,
}: IQuantitySelectorProps) => {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <button
        onClick={() =>
          setQuantity((q: number) => Math.max(1, q - 1))
        }
      >
        −
      </button>

      <span>{quantity}</span>

      <button
        onClick={() =>
          setQuantity((q: number) => Math.min(stock, q + 1))
        }
      >
        +
      </button>

      <span>Total: ₹{(quantity * price).toFixed(0)}</span>
    </div>
  );
};

export default QuantitySelector;