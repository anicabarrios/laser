import { MinusIcon, PlusIcon } from "./icons";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  const btn =
    "flex size-11 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-edge bg-surface disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="flex items-center">
      <button type="button" aria-label="Decrease quantity" className={btn} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <MinusIcon size={18} />
      </button>
      <span className="min-w-11 text-center text-[17px] font-semibold" aria-live="polite">
        {value}
      </span>
      <button type="button" aria-label="Increase quantity" className={btn} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <PlusIcon size={18} />
      </button>
    </div>
  );
}
