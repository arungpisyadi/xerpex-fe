/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '2.5': '0.625rem', // This adds the gap-2.5 utility class (10px)
      },
    },
  },
  plugins: [],
}
