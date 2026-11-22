// Hex values for places that can't use Tailwind classes (icon colors, gradients, native props).
// The single source of truth is palette.json, which tailwind.config.js also reads.
import palette from './palette.json';

export const colors = {
  primary50: palette.primary['50'],
  primary100: palette.primary['100'],
  primary300: palette.primary['300'],
  primary500: palette.primary['500'],
  primary600: palette.primary['600'],
  primary700: palette.primary['700'],
  secondary50: palette.secondary['50'],
  secondary500: palette.secondary['500'],
  secondary600: palette.secondary['600'],
  neutral200: palette.neutral['200'],
  neutral300: palette.neutral['300'],
  neutral400: palette.neutral['400'],
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,
  canvas: palette.canvas,
  card: palette.card,
  line: palette.line.DEFAULT,
  ink: palette.ink.DEFAULT,
  inkSecondary: palette.ink.secondary,
  inkMuted: palette.ink.muted,
} as const;
