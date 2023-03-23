const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.ts"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      sm: "360px",
      md: "960px",
      lg: "1280px",
      xl: "1440px",
    },
  },
  plugins: [],
};
