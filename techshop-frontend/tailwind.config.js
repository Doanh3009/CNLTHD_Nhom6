/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0064E0',     // Meta Blue
        surfaceDark: '#1C1E21', // Nền tối
        heading: '#1C2B33',     // Màu tiêu đề
        body: '#5D6C7B',        // Màu nội dung
        error: '#C80A28',       // Màu báo lỗi
        inputBorder: '#CED0D4',
      },
      fontFamily: {
        sans: ['"Optimistic VF"', 'Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}