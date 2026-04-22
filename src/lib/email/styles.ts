import type { CSSProperties } from 'react'
import { colors, radii, fontSizes, fontWeights, lineHeights } from '@/styles/tokens'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'https://southeastsocial.mikekeefe.com'

export const emailMain: CSSProperties = {
  backgroundColor: colors.neutral[50],
  fontFamily: 'system-ui, -apple-system, sans-serif',
}

export const emailContainer: CSSProperties = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
}

export const emailH1: CSSProperties = {
  color: colors.neutral[950],
  fontSize: '28px',
  fontWeight: fontWeights.bold,
  margin: '0 0 24px',
}

export const emailH1Sm: CSSProperties = {
  color: colors.neutral[950],
  fontSize: '24px',
  fontWeight: fontWeights.bold,
  margin: '0 0 16px',
}

export const emailH2: CSSProperties = {
  color: colors.neutral[950],
  fontSize: '18px',
  fontWeight: fontWeights.semibold,
  margin: '0 0 16px',
}

export const emailText: CSSProperties = {
  color: colors.neutral[900],
  fontSize: fontSizes.base,
  lineHeight: '1.6',
  margin: '0 0 16px',
}

export const emailTextSm: CSSProperties = {
  color: colors.neutral[900],
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

export const emailButton: CSSProperties = {
  backgroundColor: colors.primary[500],
  borderRadius: radii.md,
  color: '#ffffff',
  display: 'inline-block',
  fontSize: fontSizes.base,
  fontWeight: fontWeights.semibold,
  padding: '12px 24px',
  textDecoration: 'none',
}

export const emailButtonSm: CSSProperties = {
  backgroundColor: colors.primary[500],
  borderRadius: radii.md,
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: fontWeights.semibold,
  padding: '10px 20px',
  textDecoration: 'none',
}

export const emailButtonSection: CSSProperties = {
  margin: '32px 0',
}

export const emailHr: CSSProperties = {
  borderColor: colors.neutral[200],
  margin: '32px 0',
}

export const emailFooter: CSSProperties = {
  color: colors.neutral[500],
  fontSize: '13px',
  lineHeight: lineHeights.normal,
}

export const emailLink: CSSProperties = {
  color: colors.primary[500],
}

export const emailInfoBox: CSSProperties = {
  backgroundColor: colors.neutral[100],
  borderRadius: radii.md,
  margin: '24px 0',
  padding: '16px 20px',
}

export const emailInfoBoxSm: CSSProperties = {
  backgroundColor: colors.neutral[100],
  borderRadius: radii.md,
  margin: '16px 0',
  padding: '16px 20px',
}

export const emailInfoText: CSSProperties = {
  color: colors.neutral[900],
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
}

export const emailInfoLabel: CSSProperties = {
  color: colors.neutral[500],
  fontSize: '11px',
  fontWeight: fontWeights.semibold,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  margin: '0 0 2px',
}

export const emailInfoValue: CSSProperties = {
  color: colors.neutral[950],
  fontSize: '15px',
  fontWeight: fontWeights.medium,
  margin: '0 0 12px',
}

export const emailCtaBox: CSSProperties = {
  backgroundColor: colors.primary[50],
  borderRadius: radii.md,
  margin: '24px 0',
  padding: '20px',
}

export const emailCtaText: CSSProperties = {
  color: colors.neutral[900],
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0 0 16px',
}

export const emailEventRow: CSSProperties = {
  borderLeft: `3px solid ${colors.primary[500]}`,
  margin: '0 0 16px',
  paddingLeft: '12px',
}

export const emailEventTitle: CSSProperties = {
  color: colors.neutral[950],
  fontSize: '15px',
  fontWeight: fontWeights.semibold,
  margin: '0 0 4px',
}

export const emailEventLink: CSSProperties = {
  color: colors.neutral[950],
  textDecoration: 'none',
}

export const emailEventMeta: CSSProperties = {
  color: colors.neutral[500],
  fontSize: '13px',
  margin: '0',
}
