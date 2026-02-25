// football-shop-web/tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ต้องครอบคลุมทุกไฟล์ Component ของคุณ
  ],
  theme: {
    // กำหนดสีหลักสำหรับ Tailwind
    extend: {
        colors: {
            'primary-green': '#20830cff', // สีเขียวหลัก
            'secondary-white': '#ffffffff', // สีขาวรอง
        }
    }
  },
  plugins: [],
};