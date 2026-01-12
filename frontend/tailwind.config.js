/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Đây là dòng quan trọng nhất để làm Dark mode
  theme: {
    extend: {
      colors: {
        // Bạn có thể định nghĩa màu sắc riêng cho Board Game ở đây
        gameBoard: '#f0f0f0',
        gameDark: '#1a1a1a',
      }
    },
  },
  plugins: [],
}