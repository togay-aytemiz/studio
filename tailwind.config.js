/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        brand: ['Sora', 'sans-serif'],
      },
      colors: {
        background: 'var(--bg-primary)',
        surface: 'var(--bg-secondary)',
        primary: 'var(--primary)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
      }
    }
  },
  plugins: [],
}
