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
      // Idea 1
      // {
      //   tribehub_theme: {
      //     primary: '#3f7c85',
      //     secondary: '#ff5f5d',
      //     accent: '#00ccbf',
      //     neutral: '#747e7e',
      //     'base-100': '#ffffff'
      //   },
      // },

      // Idea 2
      // {
      //     tribehub_theme: {
      //       primary: '#0d6986',
      //       secondary: '#db073d',
      //       accent: '#07485b',
      //       neutral: '#747e7e',
      //       'base-100': '#ede5f4'
      //     },
      // },
      // Idea 3
      //   {
      //     tribehub_theme: {
      //       primary: '#008cff',
      //       secondary: '#e80c7a',
      //       accent: '#55d900',
      //       neutral: '#747e7e',
      //       'base-100': '#fafafa'
      //     },
      // },
      // Idea 4
      // {
      //   tribehub_theme: {
      //     primary: '#875ccb',
      //     secondary: '#8c765b',
      //     accent: '#66cb7b',
      //     neutral: '#747e7e',
      //     'base-100': '#fafafa'
      //   },
      // },
      // Idea 5
        {
          tribehub_theme: {
            primary: '#1579da',
            secondary: '#f18a9a',
            accent: '#1c867c',
            neutral: '#747e7e',
            'base-100': '#e0f0ff'
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
