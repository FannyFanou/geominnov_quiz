/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#34525D", 
          light: "#59BCA4",
        },
        secondary: "#FF80B9",
        accent: {
          yellow: "#FEC000",
          red: "#C22026",
        },
        monochrome: {
          dark: "#222222",
          light: "#F5F5F5",
        },
      },
    },
  },
  plugins: [],
};
