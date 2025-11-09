import { colors, ColorToken } from '../../src/theme/colors';

export function useThemeColor(token: ColorToken) {
  return colors[token];
}

// Convenience getters
export const useBg = () => useThemeColor('bg');
export const useText = () => useThemeColor('text');
export const usePrimary = () => useThemeColor('primary');
