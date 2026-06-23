import { Button } from "../ui/button";
import { ViewProps } from "./customView";

const colors = [
  "#FFFFFF",
  "#F5F5F5",
  "#D1D5DB",
  "#000000",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#14B8A6",
  "#06B6D4",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#A16207",
];

function PresetView({ value, onChange }: ViewProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 justify-center mt-4 gap-1">
      {colors.map((color) => (
        <Button
          variant="ghost"
          type="button"
          key={color}
          onClick={() => onChange(color)}
          className="relative flex justify-center items-center h-9 w-9 p-0 cursor-pointer hover:bg-transparent"
        >
          <div
            className="w-6 h-6 rounded-full ring-1 ring-black/5"
            style={{ backgroundColor: color }}
          />
          {value === color && (
            <div
              className="absolute w-8 h-8 rounded-full ring-2"
              style={
                {
                  "--tw-ring-color": "var(--brand-dark)",
                } as React.CSSProperties
              }
            />
          )}
        </Button>
      ))}
    </div>
  );
}

export default PresetView;
