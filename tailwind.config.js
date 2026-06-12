/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-ink': 'var(--color-bg-deep-ink)',
        'light-cream': 'var(--color-fg-light-cream)',
        'muted-slate': 'var(--color-muted-slate)',
        'forest-green': 'var(--color-forest-green)',
        'mint': 'var(--color-mint)',
        'gold-amber': 'var(--color-gold-amber)',
      },
      fontFamily: {
        serif: 'var(--font-serif)',
        sans: 'var(--font-sans)',
      },
      zIndex: {
        '0': 'var(--z-base)',
        '100': 'var(--z-content)',
        '1000': 'var(--z-hud)',
        '3000': 'var(--z-3d)',
        '5000': 'var(--z-modal)',
      },
      transitionTimingFunction: {
        'spring': 'var(--transition-spring)',
      },
    },
  },
  plugins: [],
}
