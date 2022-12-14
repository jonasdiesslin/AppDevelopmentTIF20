/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./App.{js,ts,jsx,tsx}",
    "./Views/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'dodgerblue': '#1e90ff',
      },
    },
  },
  plugins: [],
}
