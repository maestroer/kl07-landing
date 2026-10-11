/** Tailwind отвечает только за раскладку. Цвета, радиусы и шрифты — токены Arc UI
 *  из src/components/arc/foundation.css, чтобы тема и акцент менялись в одном месте. */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-raised': 'var(--surface-raised)',
        'surface-muted': 'var(--surface-muted)',
        foreground: 'var(--foreground)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        line: 'var(--border)',
        'line-subtle': 'var(--border-subtle)',
        'line-strong': 'var(--border-strong)',
        accent: 'var(--accent)',
        'accent-strong': 'var(--accent-strong)',
        'accent-subtle': 'var(--accent-subtle)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      borderRadius: {
        control: 'var(--radius-control)',
        panel: 'var(--radius-panel)',
        surface: 'var(--radius-surface)',
      },
      boxShadow: {
        resting: 'var(--shadow-resting)',
        raised: 'var(--shadow-raised)',
        floating: 'var(--shadow-floating)',
      },
    },
  },
  plugins: [],
}
