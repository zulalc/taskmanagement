"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import PresetView from "./presetView";
import CustomView from "./customView";

interface ColorPanelProps {
  value: string;
  onChange: (color: string) => void;
}

function ColorPanel({ value, onChange }: ColorPanelProps) {
  const [selectedTab, setSelectedTab] = useState("Preset");

  return (
    <>
      <div className="flex gap-3">
        {["Preset", "Custom"].map((tab) => (
          <Button
            key={tab}
            variant="outline"
            type="button"
            onClick={() => setSelectedTab(tab)}
            className="text-xs h-7 px-4 transition-colors cursor-pointer"
            style={
              selectedTab === tab
                ? {
                    background: "var(--brand-primary)",
                    color: "white",
                    borderColor: "var(--brand-primary)",
                  }
                : {
                    color: "var(--brand-dark)",
                    borderColor: "var(--brand-card-bg)",
                  }
            }
          >
            {tab}
          </Button>
        ))}
      </div>

      {selectedTab === "Preset" && (
        <PresetView value={value} onChange={onChange} />
      )}
      {selectedTab === "Custom" && (
        <CustomView value={value} onChange={onChange} />
      )}
    </>
  );
}

export default ColorPanel;
