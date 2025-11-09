// PFPE design tokens — mapped to your Figma
export const Colors = {
  bg: "#0D1A17",              // app background (deep green)
  surface: "#10221C",         // card background
  surfaceAlt: "#132821",      // alt card / raised
  border: "rgba(255,255,255,0.06)",
  overlay: "rgba(0,0,0,0.35)",

  neon: "#D9FF3F",            // primary accent
  neonDim: "rgba(217,255,63,0.24)",

  text: "#EAF4EF",
  textDim: "rgba(234,244,239,0.72)",
  textMuted: "rgba(234,244,239,0.56)",

  chipBg: "rgba(234,244,239,0.08)",
  chipStroke: "rgba(234,244,239,0.18)",

  success: "#7CF29A",
  info: "#7BD0FF",
  warning: "#FFD36E",
  danger: "#FF8A8A",

  tabIcon: "rgba(234,244,239,0.68)",
  tabIconActive: "#D9FF3F",
  shadow: "#000000",
};
export type ColorKeys = keyof typeof Colors;
