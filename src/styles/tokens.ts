/**
 * Design System — SouthEastSocial
 *
 * Aesthetic direction: Bold, warm, and rooted in place. SE London is gritty and creative —
 * Peckham, Deptford, New Cross, Bermondsey. The palette draws from the area's visual culture:
 * brick-red arches, market stall oranges, the steel-blue of the Thames at dusk, golden pub lights.
 *
 * Think Resident Advisor energy (bold type, confident layouts) meets a community notice board
 * (handmade warmth, approachable). Not precious or over-designed — this is for real people
 * listing real events.
 *
 * Typography leans editorial: a strong display face for headings, clean sans-serif for UI,
 * generous line-height for readability on phone screens.
 */

// ---------------------------------------------------------------------------
// Colour palette
// ---------------------------------------------------------------------------

export const colors = {
  // Primary — brick orange-red, inspired by SE London railway arches and market stalls
  primary: {
    50: '#fff4ed',
    100: '#ffe6d5',
    200: '#fecba8',
    300: '#fda470',
    400: '#fb7236',
    500: '#f95016', // brand orange — main CTA, links, highlights
    600: '#ea3410',
    700: '#c22410',
    800: '#9a1f14',
    900: '#7c1d13',
    950: '#430b07',
  },

  // Secondary — Thames steel blue, used for information states and secondary actions
  secondary: {
    50: '#f0f4fe',
    100: '#dde6fd',
    200: '#c3d3fb',
    300: '#99b5f8',
    400: '#698df3',
    500: '#4666ed', // secondary blue — badges, links on dark backgrounds
    600: '#3148e2',
    700: '#2938cf',
    800: '#282fa8',
    900: '#272e85',
    950: '#1b1f52',
  },

  // Accent — golden yellow, pub lights and market signage
  accent: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15', // accent yellow — featured events, highlight strips
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
  },

  // Neutral — warm off-white to near-black; warmer than pure grey
  neutral: {
    50: '#faf9f7',  // page background
    100: '#f0ede8',
    200: '#e2ddd5',
    300: '#cec6bb',
    400: '#b5a99a',
    500: '#9e8f7e',
    600: '#8a7a6b',
    700: '#726358',
    800: '#5f524a',
    900: '#4e443d',
    950: '#1a1614',  // near-black for body text
  },

  // Semantic — feedback colours
  success: {
    light: '#dcfce7',
    base: '#16a34a',
    dark: '#14532d',
  },
  error: {
    light: '#fee2e2',
    base: '#dc2626',
    dark: '#7f1d1d',
  },
  warning: {
    light: '#fef9c3',
    base: '#ca8a04',
    dark: '#713f12',
  },
  info: {
    light: '#dde6fd',
    base: '#3148e2',
    dark: '#1b1f52',
  },
} as const

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const fonts = {
  // Display: used for page titles, event names, hero headings
  // Swap for a Google Font like 'DM Serif Display' or 'Playfair Display' via next/font
  display: 'var(--font-display)',
  // Body/UI: clean, legible at small sizes
  sans: 'var(--font-sans)',
  mono: 'var(--font-mono)',
} as const

export const fontSizes = {
  xs: '0.75rem',    // 12px — labels, legal
  sm: '0.875rem',   // 14px — secondary text, timestamps
  base: '1rem',     // 16px — body copy
  lg: '1.125rem',   // 18px — lead paragraphs
  xl: '1.25rem',    // 20px — small headings
  '2xl': '1.5rem',  // 24px — card titles
  '3xl': '1.875rem',// 30px — section headings
  '4xl': '2.25rem', // 36px — page headings
  '5xl': '3rem',    // 48px — hero headings (mobile)
  '6xl': '3.75rem', // 60px — hero headings (desktop)
  '7xl': '4.5rem',  // 72px — display / splash only
} as const

export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const

export const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const

export const letterSpacings = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const

// ---------------------------------------------------------------------------
// Spacing scale (base-8)
// ---------------------------------------------------------------------------

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
  40: '10rem',      // 160px
  48: '12rem',      // 192px
  64: '16rem',      // 256px
} as const

// ---------------------------------------------------------------------------
// Border radius scale
// ---------------------------------------------------------------------------

export const radii = {
  none: '0',
  sm: '0.25rem',    // 4px — tags, small badges
  md: '0.5rem',     // 8px — inputs, buttons
  lg: '0.75rem',    // 12px — cards
  xl: '1rem',       // 16px — modals, large cards
  '2xl': '1.5rem',  // 24px — hero cards
  full: '9999px',   // pills, avatars
} as const

// ---------------------------------------------------------------------------
// Shadow scale
// ---------------------------------------------------------------------------

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(26 22 20 / 0.08)',
  md: '0 4px 6px -1px rgb(26 22 20 / 0.10), 0 2px 4px -2px rgb(26 22 20 / 0.08)',
  lg: '0 10px 15px -3px rgb(26 22 20 / 0.10), 0 4px 6px -4px rgb(26 22 20 / 0.05)',
  xl: '0 20px 25px -5px rgb(26 22 20 / 0.12), 0 8px 10px -6px rgb(26 22 20 / 0.05)',
  '2xl': '0 25px 50px -12px rgb(26 22 20 / 0.20)',
  // Card hover — slight lift effect
  hover: '0 8px 20px -4px rgb(249 80 22 / 0.18)',
  // Focus ring — used on interactive elements for accessibility
  focus: '0 0 0 3px rgb(249 80 22 / 0.40)',
} as const

// ---------------------------------------------------------------------------
// Animation / transition
// ---------------------------------------------------------------------------

export const transitions = {
  fast: '100ms ease',
  base: '200ms ease',
  slow: '350ms ease',
} as const

// ---------------------------------------------------------------------------
// Breakpoints (matches Tailwind defaults)
// ---------------------------------------------------------------------------

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ---------------------------------------------------------------------------
// Z-index scale
// ---------------------------------------------------------------------------

export const zIndex = {
  behind: -1,
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
  tooltip: 70,
} as const
