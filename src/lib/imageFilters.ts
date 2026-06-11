import React from "react";

/**
 * Generates a unique, professional visual color-isolation filter style 
 * for cake images based on their names. This maps cake images to one of 
 * 15 custom SVG filters that shift only the saturated cake frosting colors, 
 * completely preserving the pristine, neutral studio backgrounds.
 */
export function getUniqueCakeStyle(cakeName: string): React.CSSProperties {
  if (!cakeName) return {};

  const normalized = cakeName.toLowerCase().trim();
  const originalPastelCakes = [
    "belgian chocolate cupcake assortment",
    "rose queen strawberry cupcakes",
    "alphonso mango saffron cupcakes",
    "royal butterscotch praline cupcakes"
  ];

  if (originalPastelCakes.includes(normalized)) {
    return {}; // Keep original pastel colors without color shifts
  }

  let hash = 0;
  for (let i = 0; i < cakeName.length; i++) {
    hash = cakeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % 15;

  // Use the corresponding SVG color-isolated filter template
  return { filter: `url(#cake-filter-${index})` };
}
