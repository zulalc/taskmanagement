import { Button } from "../ui/button";

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

interface PresetViewProps {
  value: string;
  onChange: (color: string) => void;
}

function PresetView({ value, onChange }: PresetViewProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 justify-center mt-4 gap-2">
      {colors.map((color) => (
        <Button
          variant={"ghost"}
          type="button"
          key={color}
          onClick={() => onChange(color)}
          className="relative flex justify-center items-center"
        >
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: color }}
          />

          {value === color && (
            <div className="absolute w-7 h-7 ring-2 ring-zinc-900 rounded-full" />
          )}
        </Button>
      ))}
    </div>
  );
}

export default PresetView;
