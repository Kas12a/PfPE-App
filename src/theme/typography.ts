// src/theme/typography.ts
import type { TextStyle } from "react-native";
export type FontStyle = TextStyle;

const Type = {
  h1: { fontSize: 32, lineHeight: 38, fontWeight: "700" } as FontStyle,
  h2: { fontSize: 24, lineHeight: 30, fontWeight: "700" } as FontStyle,
  h3: { fontSize: 20, lineHeight: 26, fontWeight: "700" } as FontStyle,
  title: { fontSize: 18, lineHeight: 24, fontWeight: "600" } as FontStyle,
  subtitle: { fontSize: 16, lineHeight: 22, fontWeight: "500" } as FontStyle,
  body: { fontSize: 16, lineHeight: 22, fontWeight: "400" } as FontStyle,
  body2: { fontSize: 14, lineHeight: 20, fontWeight: "400" } as FontStyle,
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "400" } as FontStyle,
  button: { fontSize: 16, lineHeight: 20, fontWeight: "600" } as FontStyle,
};

export { Type };
export default Type;
