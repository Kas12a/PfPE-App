// src/theme/ThemeProvider.tsx
import React, { PropsWithChildren, useMemo } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { Colors } from "./colors";

type ThemeContextType = {
  scheme: ColorSchemeName;
  colors: typeof Colors["dark"];
};

export const ThemeContext = React.createContext<ThemeContextType>({
  scheme: "dark",
  colors: Colors.dark,
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const scheme = (Appearance.getColorScheme() ?? "dark") as ColorSchemeName;

  const value = useMemo(
    () => ({
      scheme,
      colors: scheme === "light" ? Colors.light : Colors.dark,
    }),
    [scheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
