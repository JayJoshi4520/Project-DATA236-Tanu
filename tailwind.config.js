/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Note the addition of the .jsx extension
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': '#4CAF50', // Add your custom color here
      },
    },
  },
  plugins: [],
};