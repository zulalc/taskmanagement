"use client";

interface CustomViewProps {
  value: string;
  onChange: (color: string) => void;
}

function CustomView({ value, onChange }: CustomViewProps) {
  const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(value);

  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <input
        type="color"
        value={value || "#ffffff"}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 p-0 border-none cursor-pointer bg-transparent"
      />{" "}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#ffffff"
        className={`
          w-28 text-sm font-mono text-center
          px-3 py-2 rounded-md border
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${!isValidHex && value ? "border-red-500" : "border-gray-300"}
        `}
      />
    </div>
  );
}

export default CustomView;
