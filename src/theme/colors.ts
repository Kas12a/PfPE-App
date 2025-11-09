// Unified color tokens for the app. Components expect a named `Colors`
// export with `dark`/`light` schemes and a flat `colors` alias.

import { space } from "./spacing";
import { Type } from "./typography";

export const ColorSchemes = {
  dark: {
    // Core
    background: "#0C1C1A",
    surface: "#132423",
    surfaceAlt: "#0F1E1C",
    card: "rgba(255,255,255,0.06)",
    cardAlt: "rgba(255,255,255,0.04)",
    cardElevated: "rgba(255,255,255,0.09)",
    cardBorder: "rgba(255,255,255,0.12)",
    border: "rgba(255,255,255,0.08)",

    // Text
    text: "#E8F0EC",
    textDim: "rgba(232,240,236,0.7)",
    textMuted: "rgba(232,240,236,0.6)",
    subtext: "#9FB3AE",

    // Accents / Brand
    brand: "#D9FF3F",
    accent: "#D9FF3F",
    neon: "#D9FF3F",
    neonDim: "rgba(217,255,63,0.24)",
    badge: "rgba(217,255,63,0.15)",
    limeYellow: "#D9FF3F",
    grey10: "rgba(255,255,255,0.08)",
    grey30: "rgba(255,255,255,0.3)",

    // UI bits
    chipBg: "rgba(255,255,255,0.08)",
    chipStroke: "rgba(255,255,255,0.16)",

    // Tabs
    tabIconActive: "#D9FF3F",
    tabIcon: "#9BB3AE",

    // Optional accent blocks for impact cells (kept for demos)
    cardGreen: "rgba(69, 130, 90, 0.35)",
    cardBlue: "rgba(50, 120, 170, 0.35)",
    cardYellow: "rgba(180, 140, 30, 0.35)",
    cardPurple: "rgba(90, 70, 140, 0.35)",
  },
  light: {
    // Core
    background: "#F7FAF8",
    surface: "#FFFFFF",
    surfaceAlt: "#F1F5F3",
    card: "#FFFFFF",
    cardAlt: "#F3F6F4",
    cardElevated: "#FFFFFF",
    cardBorder: "rgba(0,0,0,0.08)",
    border: "rgba(0,0,0,0.08)",

    // Text
    text: "#0C1C1A",
    textDim: "rgba(12,28,26,0.7)",
    textMuted: "rgba(12,28,26,0.6)",
    subtext: "#4B5754",

    // Accents / Brand
    brand: "#7CB305",
    accent: "#7CB305",
    neon: "#7CB305",
    neonDim: "rgba(124,179,5,0.25)",
    badge: "rgba(124,179,5,0.15)",
    limeYellow: "#7CB305",
    grey10: "rgba(0,0,0,0.06)",
    grey30: "rgba(0,0,0,0.3)",

    // UI bits
    chipBg: "rgba(0,0,0,0.04)",
    chipStroke: "rgba(0,0,0,0.08)",

    // Tabs
    tabIconActive: "#7CB305",
    tabIcon: "#7A8A86",

    // Optional accent blocks for impact cells (kept for demos)
    cardGreen: "rgba(69, 130, 90, 0.25)",
    cardBlue: "rgba(50, 120, 170, 0.25)",
    cardYellow: "rgba(180, 140, 30, 0.25)",
    cardPurple: "rgba(90, 70, 140, 0.25)",
  },
} as const;

// Flat tokens for convenience: most components import `Colors` as a flat set.
export const Colors = ColorSchemes.dark;
// alias used in some screens
export const colors = Colors;
export type AppColors = typeof Colors;

export const radii = {
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999,
};

export { space };
export const type = Type;

export default ColorSchemes;
