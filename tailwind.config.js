/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./<custom directory>/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        Primary: "#3886EF",
        secondary: "#E0EDEF",
        accent: "#262262",
      },
      fontFamily: {
        regular: "Agrandi-Regular",
        boldText: "Agrandi-TextBold",
      },
    },
  },
  plugins: [],
};
