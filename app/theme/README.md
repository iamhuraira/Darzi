# Theme — Premium dark tailor design system

Design tokens for Darzi: deep navy backgrounds, copper accent, cream typography.

## Contents

- **`colors.ts`** — Backgrounds (background, surface, tabBar, input), accent (copper, cream, gold), status (success, warning, error), border radius, shadows (including inner glow).

## Palette

| Token        | Hex       | Use |
|-------------|-----------|-----|
| background  | #0F1C2E   | Main screens — deep dark navy |
| surface     | #1A2D42   | Cards, bottom sheets |
| tabBar      | #0A1520   | Bottom tab bar |
| input       | #243447   | Input fields — dark steel |
| copper      | #C4622D   | Primary accent — buttons, CTAs, active |
| cream       | #F2E8DC   | Primary text, labels, icons |
| creamMuted  | #C4B8A8   | Secondary text, placeholders |
| gold        | #B8973A   | Badges (Pro, Basic), premium, dividers only |
| success     | #3DAB7A   | Mint green |
| warning     | #E8920A   | Warm amber — pending |
| error       | #D94F4F   | Soft red — error / cancelled |

## Usage

- **StyleSheet**: `import { colors } from '../theme/colors'` then `colors.background`, `colors.copper`, etc.
- **Tailwind**: `bg-background`, `bg-copper`, `text-cream`, `rounded-card` (14px).
