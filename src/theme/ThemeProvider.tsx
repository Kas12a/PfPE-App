// src/theme/ThemeProvider.tsx
import React, { PropsWithChildren, useMemo } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { ColorSchemes } from "./colors";

type ThemeContextType = {
  scheme: ColorSchemeName;
  colors: Readonly<Record<string, string>>;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  scheme: "dark",
  colors: ColorSchemes.dark,
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const scheme = (Appearance.getColorScheme() ?? "dark") as ColorSchemeName;

  const value = useMemo(
    () => ({
      scheme,
      colors: scheme === "light" ? ColorSchemes.light : ColorSchemes.dark,
    }),
    [scheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
