import {
  GatewiseColors,
  GatewiseTypography,
  GatewiseSpacing,
  GatewiseBorderRadius,
  GatewiseThresholds,
  GatewiseRole,
  VerificationOutcome,
  GuardDecisionAction,
} from '@gatewise/design-tokens';

export const Colors = {
  // Daylight Institutional Backgrounds
  background: GatewiseColors.background.main, // #F4F8F5
  surface: GatewiseColors.background.surface, // #FFFFFF
  surfaceSecondary: GatewiseColors.background.secondary, // #EDF4EF

  // Brand Greens & Accents
  primary: GatewiseColors.brand.primary, // #23865D
  deep: GatewiseColors.brand.deep, // #176346
  lightGreen: GatewiseColors.brand.lightGreen, // #DDF0E2
  mint: GatewiseColors.brand.mint, // #C7E7D8
  teal: GatewiseColors.brand.teal, // #3A9B8B
  softBlue: GatewiseColors.brand.softBlue, // #A8CBE0

  // Text Shades
  textPrimary: GatewiseColors.text.primary, // #1E2D26
  textSecondary: GatewiseColors.text.secondary, // #65756C
  textMuted: GatewiseColors.text.muted, // #95A39A

  // Borders
  borderSubtle: GatewiseColors.border.subtle, // #E2EBE4
  borderMedium: GatewiseColors.border.medium, // #C8D9CD
  borderStrong: GatewiseColors.border.strong, // #8FA998
  border: GatewiseColors.border.subtle,

  // Status Indicators
  success: GatewiseColors.status.success, // #26865E
  warning: GatewiseColors.status.warning, // #CF983E
  error: GatewiseColors.status.error, // #C85B57
  info: GatewiseColors.status.info, // #3A9B8B

  // Additional UI states
  cardHighlight: '#F0F7F2',
  overlay: 'rgba(23, 99, 70, 0.4)',
  divider: '#E5ECE7',
  inputBackground: '#F7FAF8',
} as const;

export const Spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  // Minimum touch target 48dp for accessibility
  minTouchTarget: 48,
} as const;

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export const Typography = {
  titleLarge: {
    fontSize: GatewiseTypography.fontSize['2xl'],
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    lineHeight: 30,
  },
  titleMedium: {
    fontSize: GatewiseTypography.fontSize.xl,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    lineHeight: 26,
  },
  titleSmall: {
    fontSize: GatewiseTypography.fontSize.lg,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  headline: {
    fontSize: GatewiseTypography.fontSize.base,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  body: {
    fontSize: GatewiseTypography.fontSize.base,
    fontWeight: '400' as const,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: GatewiseTypography.fontSize.base,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  caption: {
    fontSize: GatewiseTypography.fontSize.sm,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  captionBold: {
    fontSize: GatewiseTypography.fontSize.sm,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  badge: {
    fontSize: GatewiseTypography.fontSize.xs,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  mono: {
    fontSize: GatewiseTypography.fontSize.sm,
    fontFamily: 'monospace',
    color: Colors.textSecondary,
  },
  monoBold: {
    fontSize: GatewiseTypography.fontSize.sm,
    fontFamily: 'monospace',
    fontWeight: '700' as const,
    color: Colors.deep,
  },
} as const;

export const Shadows = {
  subtle: {
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  modal: {
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export {
  GatewiseThresholds,
  GatewiseRole,
  VerificationOutcome,
  GuardDecisionAction,
};
