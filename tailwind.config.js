@"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'neumorphism': '#e0e0e0',
      },
      boxShadow: {
        'neu': '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
        'neu-sm': '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
        'neu-inset': 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
      }
    },
  },
  plugins: [],
}
"@ | Out-File -FilePath "tailwind.config.js" -Encoding UTF8