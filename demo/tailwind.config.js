/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fly-in": "fly-in 0.5s ease",
        "fade-in": "fade-in 0.3s ease",
        "fade-out": "fade-out 0.3s ease",
      },
      keyframes: {
        "fly-in": {
          "0%": {
            transform: "translateY(100vh)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "fade-out": {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
};
