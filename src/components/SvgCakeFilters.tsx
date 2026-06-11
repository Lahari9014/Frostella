import React from "react";

export default function SvgCakeFilters() {
  // Define 15 filters with different selective color modifications
  const filterSpecs = [
    { id: 0, hue: 10, saturate: 1.05 },
    { id: 1, hue: 35, saturate: 1.15 },    // Rosy Pink Blush
    { id: 2, hue: 65, saturate: 1.25 },    // Golden Champagne Peach
    { id: 3, hue: 95, saturate: 1.05 },    // Emerald / Matcha Pistachio Green
    { id: 4, hue: 125, saturate: 1.10 },   // Soft Sage Orchid Mint
    { id: 5, hue: 155, saturate: 1.20 },   // Deep Lavender Iris
    { id: 6, hue: 185, saturate: 1.15 },   // Sky Sapphire Blue Cream
    { id: 7, hue: 215, saturate: 1.25 },   // Rich Royal Violet Indigo
    { id: 8, hue: 245, saturate: 1.20 },   // Magenta Velvet Silk
    { id: 9, hue: 275, saturate: 1.15 },   // Velvet Plum Orchid
    { id: 10, hue: 305, saturate: 1.20 },  // Crimson Rose Cocoa
    { id: 11, hue: 335, saturate: 1.15 },  // Strawberry Coral Creme
    { id: 12, hue: 15, saturate: 1.40 },   // Vivid Velvet Raspberry
    { id: 13, hue: 290, saturate: 1.30 },  // Electric Orchid Shimmer
    { id: 14, hue: 110, saturate: 1.15 }   // Royal Peppermint Dream
  ];

  return (
    <svg 
      width="0" 
      height="0" 
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
      className="absolute pointer-events-none"
    >
      <defs>
        {filterSpecs.map((spec) => (
          <filter id={`cake-filter-${spec.id}`} key={spec.id}>
            {/* Step 1: Extract Luminance of the original to find the bright/neutral background */}
            <feColorMatrix
              type="matrix"
              values="0.2126 0.7152 0.0722 0 0
                      0.2126 0.7152 0.0722 0 0
                      0.2126 0.7152 0.0722 0 0
                      0.2126 0.7152 0.0722 0 0"
              result="luminance"
            />

            {/* Step 2: Set alpha based on luminance.
                We want bright background elements (luminance >= 0.75) to remain completely transparent in the color-shift overlay.
                Below is a lookup table, meaning input levels 0.0-0.5 stay 100% color-shifted, 
                0.6 drops to 0.8, 0.7 drops to 0.1, and 0.8-1.0 (neutral studio backgrounds) drop to 0% color-shifted. */}
            <feComponentTransfer in="luminance" result="cakeMask">
              <feFuncA type="table" tableValues="1 1 1 1 1 1 0.8 0.1 0 0 0" />
            </feComponentTransfer>

            {/* Step 3: Perform Hue Rotate on original image */}
            <feColorMatrix
              type="hueRotate"
              values={spec.hue.toString()}
              in="SourceGraphic"
              result="hueShifted"
            />

            {/* Step 4: Perform Saturation adjustment on the shifted color */}
            <feColorMatrix
              type="saturate"
              values={spec.saturate.toString()}
              in="hueShifted"
              result="colorAdjusted"
            />

            {/* Step 5: Isolate the color shift using the cakeMask.
                This keeps the shifted colors ONLY where the mask is visible (the cake itself),
                leaving the background area transparent. */}
            <feComposite
              operator="in"
              in="colorAdjusted"
              in2="cakeMask"
              result="isolatedCake"
            />

            {/* Step 6: Overlay the color-shifted cake onto the original image.
                This renders the color-shifted cake over the original image, 
                ensuring the gorgeous neutral studio background is 100% preserved. */}
            <feComposite
              operator="over"
              in="isolatedCake"
              in2="SourceGraphic"
            />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
