/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        base: '#09090B',
        surface: '#111113',
        panel: '#18181B',
        border: '#27272A',
        muted: '#3F3F46',
        dim: '#71717A',
        soft: '#A1A1AA',
        bright: '#E4E4E7',
        accent: '#6366F1',
        'accent-dim': '#4338CA',
        'accent-glow': 'rgba(99,102,241,0.15)',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
      }
    }
  },
  plugins: []
}
