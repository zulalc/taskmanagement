"use client";

export interface ViewProps {
  value: string;
  onChange: (color: string) => void;
}

function CustomView({ value, onChange }: ViewProps) {
  const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(value);

  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <input
        type="color"
        value={value || "var(--brand-primary)"}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 p-0 border-none cursor-pointer bg-transparent rounded-md overflow-hidden"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#008170"
        className="w-28 text-sm font-mono text-center px-3 py-2 rounded-md border focus:outline-none focus:ring-2"
        style={
          {
            borderColor:
              !isValidHex && value ? "#ef4444" : "var(--brand-card-bg)",
            "--tw-ring-color": "var(--brand-primary)",
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export default CustomView;
