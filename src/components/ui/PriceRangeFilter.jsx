import React, { useState, useEffect } from "react";
import { Range } from "react-range";

// Constants (You can adjust these or import from constants file)
export const STEP = 10;
export const MIN_GAP = 100;
export const PERCENT_SCALE = 100;

const PriceRangeFilter = ({ priceRange, setPriceRange, min = 0, max = 10000 }) => {
  // Fix cases where min == max (prevents slider collapse)
  const fixedMin = min === max ? max - MIN_GAP : min;
  const fixedMax = max;

  // Local slider state
  const [values, setValues] = useState([
    Math.max(fixedMin, priceRange[0] || fixedMin),
    Math.min(fixedMax, priceRange[1] || fixedMax),
  ]);

  // Sync when external priceRange changes
  useEffect(() => {
    let [pMin, pMax] = priceRange;

    pMin = Math.max(fixedMin, pMin || fixedMin);
    pMax = Math.min(fixedMax, pMax || fixedMax);

    if (pMax - pMin < MIN_GAP) {
      pMin = Math.max(fixedMin, pMax - MIN_GAP);
      pMax = Math.min(fixedMax, pMin + MIN_GAP);
    }

    setValues([pMin, pMax]);
  }, [priceRange, fixedMin, fixedMax]);

  // Update slider
  const handleChange = (newValues) => {
    let [newMin, newMax] = newValues;

    newMin = Math.max(fixedMin, newMin);
    newMax = Math.min(fixedMax, newMax);

    if (newMax - newMin < MIN_GAP) {
      if (newMin !== values[0]) {
        newMin = Math.max(fixedMin, newMax - MIN_GAP);
      } else {
        newMax = Math.min(fixedMax, newMin + MIN_GAP);
      }
    }

    const updatedValues = [newMin, newMax];
    setValues(updatedValues);
    setPriceRange(updatedValues);
  };

  return (
    <div className="w-full px-2 py-4">
      {/* Top labels */}
      <div className="flex justify-between mb-3">
        <span className="font-medium">₹{values[0]}</span>
        <span className="font-medium">₹{values[1]}</span>
      </div>

      {/* Slider */}
      <Range
        values={values}
        step={STEP}
        min={fixedMin}
        max={fixedMax}
        onChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-2 w-full bg-gray-200 rounded-full relative"
          >
            {/* Active range highlight */}
            <div
              className="absolute h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{
                left: `${((values[0] - fixedMin) / (fixedMax - fixedMin)) * PERCENT_SCALE}%`,
                right: `${
                  PERCENT_SCALE -
                  ((values[1] - fixedMin) / (fixedMax - fixedMin)) *
                    PERCENT_SCALE
                }%`,
              }}
            />
            {children}
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            className={`h-5 w-5 rounded-full shadow-md transition-transform ${
              isDragged ? "bg-blue-600 scale-110" : "bg-blue-500"
            }`}
            style={{ ...props.style, outline: "none" }}
          />
        )}
      />
    </div>
  );
};

export default PriceRangeFilter;
