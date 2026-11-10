/**
 * GATEWISE AI — Shared Institutional Design Tokens
 * Source of Truth for Web (Tailwind/Next.js) & Mobile (React Native/Expo)
 */

export const GatewiseColors = {
  background: {
    main: '#F4F8F5',
    surface: '#FFFFFF',
    secondary: '#EDF4EF',
  },
  brand: {
    lightGreen: '#DDF0E2',
    mint: '#C7E7D8',
    primary: '#23865D',
    deep: '#176346',
    teal: '#3A9B8B',
    softBlue: '#A8CBE0',
  },
  text: {
    primary: '#1E2D26',
    secondary: '#65756C',
    muted: '#95A39A',
  },
  border: {
    subtle: '#E2EBE4',
    medium: '#C8D9CD',
    strong: '#8FA998',
  },
  status: {
    success: '#26865E',
    warning: '#CF983E',
    error: '#C85B57',
    info: '#3A9B8B',
  },
} as const;

export const GatewiseTypography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'monospace',
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: 1.15,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;

export const GatewiseSpacing = {
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
} as const;

export const GatewiseBorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

export const GatewiseShadows = {
  sm: '0 1px 2px 0 rgba(30, 45, 38, 0.05)',
  base: '0 1px 3px 0 rgba(30, 45, 38, 0.1), 0 1px 2px -1px rgba(30, 45, 38, 0.1)',
  md: '0 4px 6px -1px rgba(30, 45, 38, 0.08), 0 2px 4px -2px rgba(30, 45, 38, 0.08)',
  lg: '0 10px 15px -3px rgba(30, 45, 38, 0.08), 0 4px 6px -4px rgba(30, 45, 38, 0.08)',
  xl: '0 20px 25px -5px rgba(30, 45, 38, 0.08), 0 8px 10px -6px rgba(30, 45, 38, 0.08)',
} as const;

export const GatewiseMotion = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
  stepperIntervalMs: 280,
} as const;

export const GatewiseElevation = {
  base: 0,
  card: 1,
  header: 2,
  modal: 10,
  tooltip: 20,
} as const;

export const GatewiseThresholds = {
  faceMatchAutoAdmit: 0.90, // 90% and above is confident match
  faceMatchCandidate: 0.70, // 70% to 89% requires physical ID review
  faceMatchUnknown: 0.70,   // Below 70% is unknown person
  minBlurScore: 60.0,       // Laplacian variance threshold
} as const;

export const GatewiseRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  SECURITY_GUARD: 'SECURITY_GUARD',
} as const;

export const VerificationOutcome = {
  VERIFIED_AUTHORIZED: 'VERIFIED_AUTHORIZED',
  IDENTIFIED_UNAUTHORIZED: 'IDENTIFIED_UNAUTHORIZED',
  POTENTIAL_MATCH: 'POTENTIAL_MATCH',
  UNKNOWN_PERSON: 'UNKNOWN_PERSON',
  IMAGE_QUALITY_INSUFFICIENT: 'IMAGE_QUALITY_INSUFFICIENT',
  AUTHORIZATION_EXPIRED: 'AUTHORIZATION_EXPIRED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export const GuardDecisionAction = {
  GRANT_ENTRY: 'GRANT_ENTRY',
  DENY_ENTRY: 'DENY_ENTRY',
  ESCALATE_TO_ADMIN: 'ESCALATE_TO_ADMIN',
  REFER_TO_VISITOR_DESK: 'REFER_TO_VISITOR_DESK',
  MANUAL_ID_CONFIRMED: 'MANUAL_ID_CONFIRMED',
} as const;
