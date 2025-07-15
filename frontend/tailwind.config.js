/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/pages/*.{html,js,jsx}","./src/Components/*.{html,js,jsx}","./src/assets/*.{html,js,jsx}" , "./src/auth/*.jsx"],
  theme: {
    extend: {
      fontFamily: {
        sans : ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'], 
        Montserrat: ['Montserrat', 'sans-serif'], 
        Roboto: ['Roboto', 'sans-serif'], 
      },
      colors: {
        'primary': '#7fd0c7',
        'secondary': '#80C0D1',
        'dark' : "#6E9693"
      },
      textColor: {
        'primary': '#273F3D',
        'secondary': '#6E9693',
      }
    },
  },
  plugins: [],
}

