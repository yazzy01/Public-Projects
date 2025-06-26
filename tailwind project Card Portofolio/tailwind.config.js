/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'mt-5',
    'mt-6',
    {
      pattern: /^m(t|b|l|r)-\d+$/,
      pattern: /^p(t|b|l|r|x|y)-\d+$/,
      pattern: /^(w|h)-\d+$/,
    }
  ]
} 