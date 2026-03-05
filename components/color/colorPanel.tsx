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
          <div
            key={tab}
            className="relative h-7 w-16 flex justify-center items-center"
          >
            <Button
              variant={"outline"}
              type="button"
              onClick={() => setSelectedTab(tab)}
              className={`text-xs transition-colors ${
                selectedTab === tab
                  ? "text-zinc-100 bg-zinc-600"
                  : "text-zinc-800"
              }`}
            >
              {tab}
            </Button>
          </div>
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
