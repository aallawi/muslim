/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f8b400",
          hover: "",
        },
        secondary: {
          DEFAULT: "#2c786c",
          hover: "#004445",
        },
        body: "#faf5e4",
      },
    },
  },
  plugins: [],
};
