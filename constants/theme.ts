// constants/theme.ts
export const colors = {
  bg:        '#0E1D1B', // app dark background
  surface:   '#142725',
  card:      '#0F2220',
  text:      '#E7F0ED',
  subtext:   '#B7C4C0',
  primary:   '#D8F04C', // lime highlight
  success:   '#4ED27A',
  warning:   '#F5C84B',
  danger:    '#FF6B6B',
  border:    'rgba(255,255,255,0.08)',
  muted:     'rgba(231,240,237,0.6)',

  // tab bar
  tabBg:     '#0C1A18',
  tabActive: '#D8F04C',
  tabInactive: '#9BB3AE',
};

export type ColorToken = keyof typeof colors;
