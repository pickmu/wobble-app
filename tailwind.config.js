/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./<custom directory>/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        Primary: "#212429",
        secondary: "#DCDFE4",
        primaryYellow: "#ffb200",
        secondaryYellow: "#ffd403",
      },
      fontFamily: {
        regular: "Agrandi-Regular",
        boldText: "Agrandi-TextBold",
      },
    },
  },
  plugins: [],
};
