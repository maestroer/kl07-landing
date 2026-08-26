/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        ink: '#08080c',
        line: 'rgba(139,124,246,0.16)',
        soft: 'rgba(255,255,255,0.07)',
        txt: '#d6d4e2',
        dim: '#83819a',
        mute: '#57556e',
        violet: '#8b7cf6',
        lilac: '#a99bfa',
        orange: '#e8825f',
        grn: '#4ade80',
        blu: '#7aa2f7',
      },
    },
  },
  plugins: [],
}
