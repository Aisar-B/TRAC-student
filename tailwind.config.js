/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    screens: {
      xs: '22.5rem',
      sm: '40rem',
      md: '48rem',
      lg: '64rem',
      xl: '80rem',
      '2xl': '96rem',
    },
    extend: {
      colors: {
        trac: {
          primary: "#1B5E20",
          primaryDark: "#0D3B10",
          primaryLight: "#2E7D32",
          primaryLighter: "#388E3C",
          secondary: "#F9A825",
          secondaryDark: "#F57F17",
          secondaryLight: "#FBC02D",
          accent: "#33691E",
          background: "#F1F8E9",
        },
        // Legacy aliases for gradual migration
        msu: {
          maroon: "#1B5E20",
          blue: "#2E7D32",
        }
      },
      fontFamily: {
        serif: ['Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
};
