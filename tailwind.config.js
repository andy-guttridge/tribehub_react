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
    themes: [
        {
          tribehub_theme: {
            primary: '#0ea1ed',
            secondary: '#ed2637',
            accent: '#0aa183',
            neutral: '#747e7e',
            'base-100': '#fafafa',
            'base-200': '#f0f0f0'
          },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
}
