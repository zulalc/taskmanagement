import { Button } from "../ui/button";
import { ViewProps } from "./customView";

const colors = [
  "#FF0000",
  "#00FFFF",
  "#00008B",
  "#800080",
  "#FFFF00",
  "#00FF00",
  "#008000",
  "#808000",
  "#FF00FF",
  "#FFC0CB",
  "#808080",
  "#FFA500",
  "#A52A2A",
  "#800000",
  "#7FFFD4",
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
