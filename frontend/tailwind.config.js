/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5FA8D3',   // bleu principal
          light: '#CAE9FF',     // bleu clair
          dark: '#1B4965',      // bleu marine foncé
        },
        accent: {
          DEFAULT: '#62B6CB',   // turquoise
          light: '#BEE9E8',     // turquoise pastel
        },
        // Raccourcis directs pour usage rapide
        'blue-primary': '#5FA8D3',
        'blue-light': '#CAE9FF',
        'blue-dark': '#1B4965',
        'turquoise': '#62B6CB',
        'turquoise-light': '#BEE9E8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'sidebar': '4px 0 8px rgba(27, 73, 101, 0.08)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      transitionDuration: {
        '200': '200ms',
      },
    },
  },
  plugins: [],
}
