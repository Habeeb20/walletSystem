/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//    theme: {
//     extend: {
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0', transform: 'translateY(20px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         },
//       },
//       animation: {
//         fadeIn: 'fadeIn 0.8s ease-out forwards',
//       },
//     },
//   },
//   plugins: [require('tailwindcss-animate')],
// };








/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out forwards',
      },
      colors: {
        'dark-green-1': '#1A3C34',
        'dark-green-2': '#2E4F44',
        'medium-green-1': '#4A7C67',
        'medium-green-2': '#09a353',
        'light-gray': '#D9D9D9',
        'custom-green': '#1A3C34',
      },
    },
  },
  plugins: [import('tailwindcss-animate')],
};