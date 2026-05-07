/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#18181B',
        'accent-hover': '#3F3F46',
        surface: '#FAFAFA',
        border: '#E4E4E7',
        'text-secondary': '#52525B',
        'text-muted': '#A1A1AA',
        'hover-bg': '#F4F4F5',
      },
      fontFamily: {
        heading: ['Archivo', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
