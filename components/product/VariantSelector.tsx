"use client";

import { ProductVariant } from "@/types/product";

type Props = {
  variants: ProductVariant[];
  selectedColor: string;
  selectedSize: string;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
};

function uniqueValues(
  items: ProductVariant[],
  key: keyof ProductVariant
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    const value = String(item[key]);

    if (
      value &&
      value !== "null" &&
      value !== "undefined" &&
      !seen.has(value)
    ) {
      seen.add(value);
      result.push(value);
    }
  }

  return result;
}

export default function VariantSelector({
  variants,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: Props) {
  const colors = uniqueValues(variants, "color");

  const sizes = uniqueValues(
    variants.filter(
      (v) => String(v.color) === selectedColor
    ),
    "size"
  ).sort((a, b) => {
    const na = Number(a);
    const nb = Number(b);

    return Number.isNaN(na) || Number.isNaN(nb)
      ? a.localeCompare(b)
      : na - nb;
  });

  return (
    <div className="space-y-4">
      {colors.length > 0 && (
        <div>
          <h3 className="mb-2 font-semibold">
            Color:{" "}
            <span className="font-normal">
              {selectedColor}
            </span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`rounded border px-4 py-2 text-sm transition ${
                  selectedColor === color
                    ? "border-black bg-black text-white"
                    : "border-gray-300 hover:border-black"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <h3 className="mb-2 font-semibold">
            Size:{" "}
            <span className="font-normal">
              {selectedSize}
            </span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const variant = variants.find(
                (v) =>
                  String(v.color) === selectedColor &&
                  String(v.size) === size
              );

              const disabled =
                !variant ||
                variant.stockQuantity <= 0;

              return (
                <button
                  key={size}
                  disabled={disabled}
                  onClick={() => onSizeChange(size)}
                  className={`rounded border px-4 py-2 text-sm transition ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : disabled
                        ? "cursor-not-allowed border-gray-200 text-gray-300 line-through"
                        : "border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}