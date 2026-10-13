/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        diu: {
          blue: '#174EA6',
          blue2: '#1E4FA3',
          green: '#43B649',
          red: '#EF3035',
          navy: '#071A3D',
          ink: '#101828',
          paper: '#F8F9FB',
          mist: '#EDF2F7'
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        editorial: '0 24px 70px rgba(7,26,61,.12)',
        subtle: '0 10px 30px rgba(7,26,61,.08)'
      }
    }
  },
  plugins: []
}
