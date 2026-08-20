/**
 * STALE — RETIRED v2 (flat paper) tokens. The brand moved to "Lens" (v3,
 * liquid glass) on 2026-07-20; tokens.css is the only authoritative token
 * file until this mirror is regenerated from it. Do not build anything new
 * from these values.
 *
 * Stephens AI — Design Tokens (TS)
 * For projects that prefer JS-object consumption (styled-components, Emotion, Tailwind theme, RN).
 */

export const tokens = {
  color: {
    ink:        '#0A0A0A',
    ink90:      '#1A1A1A',
    ink60:      '#6B6B6B',
    ink40:      '#A3A3A3',
    ink20:      '#D4D4D4',
    ink10:      '#EDEDED',
    ink05:      '#F5F5F5',
    paper:        '#FFFFFF',
    paperRaised: '#FAFAFA',
    salmon:      '#F47B6B',
    salmonDeep:  '#E35F4D',
    salmonSoft:  '#FDE6E1',
  },
  colorDark: {
    ink:        '#FAFAFA',
    ink90:      '#EDEDED',
    ink60:      '#9A9A9A',
    ink40:      '#6B6B6B',
    ink20:      '#2E2E2E',
    ink10:      '#1F1F1F',
    ink05:      '#161616',
    paper:        '#0A0A0A',
    paperRaised: '#141414',
    salmon:      '#F47B6B',
    salmonDeep:  '#FF9384',
    salmonSoft:  '#2A1410',
  },
  // Functional status palette. Scoped to status markers (the ledger chip) only —
  // NOT a brand accent. Same in light + dark. Salmon stays the sole brand accent.
  status: {
    good:      '#2E7A56',
    goodTint:  'rgba(46,122,86,0.10)',
    warn:      '#946A12',
    warnTint:  'rgba(176,130,40,0.15)',
    bad:       '#B23A2F',
    badTint:   'rgba(178,58,47,0.10)',
  },
  font: {
    sans: "'Inter Tight', 'Helvetica Neue', Arial, sans-serif",
    mono: "'IBM Plex Mono', ui-monospace, Menlo, monospace",
  },
  // Scale bumped 2026-06-08 for legibility. Body floor 17px; no text below micro (13px).
  fontSize: {
    mega:    'clamp(56px, 10vw, 140px)',
    display: 'clamp(40px, 6vw, 88px)',
    h1:      'clamp(34px, 4vw, 56px)',
    h2:      'clamp(25px, 2.4vw, 34px)',
    h3:      '21px',
    body:    '17px',
    label:   '14px',
    small:   '15px',
    micro:   '13px',
  },
  fontWeight: { regular: 400, medium: 500, bold: 600 },
  letterSpacing: { display: '-0.045em', heading: '-0.02em', body: '0', mono: '0.04em' },
  lineHeight:    { display: 0.92, heading: 1.05, body: 1.5 },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64, 9: 96, 10: 128 },
  radius: { sm: 2, md: 4, lg: 8, pill: 999 },
  motion: {
    ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    durFast: 120,
    durBase: 200,
    durSlow: 320,
  },
} as const;

export type Tokens = typeof tokens;
