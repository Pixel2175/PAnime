/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,css,html}"],
  theme: {
    extend: {
      colors: {
        dark: "#0A0911",
        mid: "#1F1D2C",
        light: "#2A253A",
        hover: "#3A253A",
        t: { light: "#dddddd" },
      },
    },
  },
  plugins: [],
};
