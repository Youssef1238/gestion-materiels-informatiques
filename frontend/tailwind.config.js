/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/pages/*.{html,js,jsx}","./src/Components/*.{html,js,jsx}","./src/assets/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans : ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'], 
        Montserrat: ['Montserrat', 'sans-serif'], 
        Roboto: ['Roboto', 'sans-serif'], 
      },
    },
  },
  plugins: [],
}

