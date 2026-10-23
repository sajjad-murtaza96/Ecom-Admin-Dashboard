import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface QuantitySelectorProps {
  quantity: number;
  productName: string;
  max: number;
  min?: number;
  disabled?: boolean;
  onChange: (quantity: number) => void;
  children?: React.ReactNode;
}

export const QuantitySelector = ({
  quantity,
  productName,
  max,
  min = 1,
  disabled = false,
  onChange,
  children,
}: QuantitySelectorProps) => (
  <div className="inline-flex h-10 items-center rounded-md border border-gray-300">
    <button
      type="button"
      aria-label={`Decrease quantity of ${productName}`}
      title="Decrease quantity"
      disabled={disabled || quantity <= min}
      onClick={() => onChange(quantity - 1)}
      className="flex h-full w-10 items-center justify-center hover:bg-gray-100 disabled:opacity-40"
    >
      <MinusIcon aria-hidden="true" className="h-4 w-4" />
    </button>
    <output
      aria-label={`Quantity of ${productName}`}
      className="flex h-full w-16 min-w-0 items-center justify-center border-x border-gray-300 bg-white text-sm"
    >
      {quantity}
    </output>
    <button
      type="button"
      aria-label={`Increase quantity of ${productName}`}
      title="Increase quantity"
      disabled={disabled || quantity >= max}
      onClick={() => onChange(quantity + 1)}
      className="flex h-full w-10 items-center justify-center hover:bg-gray-100 disabled:opacity-40"
    >
      <PlusIcon aria-hidden="true" className="h-4 w-4" />
    </button>
    {children}
  </div>
);
