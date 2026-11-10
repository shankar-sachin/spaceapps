/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0a0c0f',
        panel: '#11151a',
        panel2: '#171c22',
        line: '#2a313a',
        ink: '#ece7df',
        dim: '#a39d94',
        flame: { DEFAULT: '#ff7a1a', soft: '#ffa463', deep: '#c2540a' },
        amber: { DEFAULT: '#f2b233', bg: '#2a2110' },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
