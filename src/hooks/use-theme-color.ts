import { Colors } from '../../src/theme/colors';

type ColorToken = keyof typeof Colors;

export function useThemeColor(token: ColorToken) {
  return Colors[token];
}

// Convenience getters (map to closest tokens)
export const useBg = () => useThemeColor('background');
export const useText = () => useThemeColor('text');
export const usePrimary = () => useThemeColor('brand');
