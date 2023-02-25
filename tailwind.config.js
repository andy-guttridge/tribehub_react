/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js, jsx, ts, tsx}"],
  theme: {
    extend: {
      // Instructions on how to utilise Google Fonts within a Tailwind CSS project are from
      // https://daily-dev-tips.com/posts/using-google-fonts-in-a-tailwind-project/
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'shantell': ['Shantell Sans', 'cursive']
      }
    },
  },
  plugins: [require("daisyui")],
  // daisyUI config
  daisyui: {
    styled: true,
    themes: false,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
}
