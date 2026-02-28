# Theme — Design system

Design tokens and theme values for the Darzi app.

## Contents

- **`colors.ts`** — Brand colors (navy, gold), backgrounds (canvas, surface), typography (charcoal, muted), status (success, warning, error), and shadow presets.

## Usage

- **Tailwind / NativeWind**: Use utility classes like `bg-navy`, `text-gold`, `bg-canvas`.
- **StyleSheet / dynamic values**: Import from `./theme/colors` and use `colors.navy`, `shadows.md`, etc.

## Palette

| Token   | Use           |
|--------|----------------|
| navy   | Primary / brand |
| gold   | Accent / luxury |
| canvas | App background  |
| surface| Cards / panels  |
| charcoal | Body text     |
| muted  | Secondary text  |
