const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            primary: {
              DEFAULT: "#41B3A3",
            },
            background: { DEFAULT: "#1a1a1a",secondary: "#3d3d3d" },
            textSecondary: "#9a9a9a",
            midPurple: "#222436",
            lightPurple: "#404258",
            border: '#242424',
            foreground: "#DCDCDC",
          },
        },
        light: {
          colors: {
            primary: {
              DEFAULT: "#419197",
            },
            background: { DEFAULT: "#F8F0E5" },
            midPurple: "#EADBC8",
            lightPurple: "#DAC0A3",
            border: '#242424',
          }
        }
      },
    })
  ],
}

