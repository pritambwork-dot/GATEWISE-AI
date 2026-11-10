export const Colors = {
  background: '#F4F8F5',
  surface: '#FFFFFF',
  surfaceSecondary: '#EDF4EF',
  lightGreen: '#DDF0E2',
  mint: '#C7E7D8',
  primary: '#23865D',
  deep: '#176346',
  teal: '#3A9B8B',
  textPrimary: '#1E2D26',
  textSecondary: '#65756C',
  textMuted: '#95A39A',
  border: '#E2EBE4',
  success: '#26865E',
  warning: '#CF983E',
  error: '#C85B57',
} as const;

export const Typography = {
  title: { fontSize: 24, fontWeight: '700' as const, color: Colors.textPrimary },
  subtitle: { fontSize: 18, fontWeight: '600' as const, color: Colors.textPrimary },
  body: { fontSize: 15, fontWeight: '500' as const, color: Colors.textPrimary },
  caption: { fontSize: 13, fontWeight: '400' as const, color: Colors.textSecondary },
  badge: { fontSize: 11, fontWeight: '600' as const },
  mono: { fontSize: 12, fontFamily: 'monospace' },
};
