/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    "./src/**/*.{js,jsx,ts,tsx}",
   
  ],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        primaryBg: '#020129',
      },
      margin: {
        '2%': '2%',
        '3%': '3%',
        '5%': '5%',
        '7%': '7%',
        '10%': '10%',
        '13%': '13%',
        '15%': '15%',
        '18%': '18%',
        '20%': '20%',
        '23%': '23%',
        '30%': '30%',
        '35%': '35%',
        '40%': '40%',
        '45%': '45%',
        '50%': '50%',
        '55%': '55%',
        '60%': '60%',
        '70%': '70%',
        '80%': '80%',
        '85%': '85%',
        '90%': '90%',
        '100%': '100%',
      },
      gap: {
        '5%': '5%',
        '10%': '10%',
        '20%': '20%',
        '30%': '30%',
        '40%': '40%',
        '50%': '50%',
      },
      fontSize: {
        '30%': '30%',
        '40%': '40%',
        '70%': '70%',
        '80%': '80%',
        '95%': '95%',
        '100%': '100%',
        '125%': '125%',
        '150%': '150%',
        '200%': '200%',
      },
      width: {
        '8%': '8%',
        '10%': '10%',
        '20%': '20%',
        '30%': '30%',
        '40%': '40%',
        '50%': '50%',
        '60%': '60%',
        '80%': '80%',
        '90%': '90%',
        '92%': '92%',
        '98%': '98%',
        '99%': '99%',
        '100%': '100%',
      },
      height: {
        '5%': '5%',
        '8%': '8%',
        '10%': '10%',
        '12%': '12%',
        '13%': '13%',
        '15%': '15%',
        '20%': '20%',
        '40%': '40%',
        '50%': '50%',
        '60%': '60%',
        '70%': '70%',
        '80%': '80%',
        '90%': '90%',
        '95%': '95%',
        '100%': '100%',
      },
    },
  },

  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      };
      addUtilities(newUtilities);
    },
  ],
}
