"use client";

type Props = {
  min?: number;
  max?: number;
  step?: number;
  value: { min: number; max: number };
  onChange: (min: number, max: number) => void;
};

const formatPrice = (value: number) =>
  value.toLocaleString("vi-VN");

export default function PriceRangeBar({
  min = 0,
  max = 100_000_000,
  step = 100_000,
  value,
  onChange,
}: Props) {
  const minVal = value.min;
  const maxVal = value.max;

  function handleMinChange(value: number) {
    onChange(Math.min(value, maxVal - step), maxVal);
  }

  function handleMaxChange(value: number) {
    onChange(minVal, Math.max(value, minVal + step));
  }

  const minPercent = (minVal / max) * 100;
  const maxPercent = (maxVal / max) * 100;

  return (
    <div className="space-y-3">
      <div className="relative h-2 rounded-full bg-gray-200">
        {/* Selected range */}
        <div
          className="absolute h-full rounded-full bg-black"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          aria-label="Minimum price"
          className="pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          aria-label="Maximum price"
          className="pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow"
        />
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>{formatPrice(minVal)} đ</span>
        <span>{formatPrice(maxVal)} đ</span>
      </div>
    </div>
  );
}
