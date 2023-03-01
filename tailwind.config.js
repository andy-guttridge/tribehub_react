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
        'fredoka': ['Fredoka One', 'cursive']
      }
    },
  },
  plugins: [require("daisyui")],
  // daisyUI config
  daisyui: {
    styled: true,
    themes: [

      // Technique to use a filter to change the colour of a SVG is from 
      // https://stackoverflow.com/questions/22252472/how-can-i-change-the-color-of-an-svg-element 

      // Technique to define a CSS class as part of a DaisyUI theme is from 
      // https://github.com/saadeghi/daisyui/discussions/640
      {
        tribehub_theme: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark"],
          ".CategoryIcon": {
            "filter": "invert(26%) sepia(13%) saturate(3556%) hue-rotate(286deg) brightness(88%) contrast(89%)"
          },
          ".FidgetSpinner": {
            "filter": "invert(25%) sepia(79%) saturate(4101%) hue-rotate(320deg) brightness(96%) contrast(110%)"
          },
          primary: '#ff147a',
          secondary: '#00d7ff',
          accent: '#803053',
          neutral: '#747e7e',
          'base-100': '#fafafa',
          'base-200': '#e6e6e6'
        },
      },
      {
        tribehub_dark_theme: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark"],
          ".CategoryIcon": {
            "filter": "invert(84%) sepia(88%) saturate(459%) hue-rotate(353deg) brightness(95%) contrast(95%);"
          },
          ".FidgetSpinner": {
            "filter": "invert(42%) sepia(98%) saturate(1106%) hue-rotate(171deg) brightness(99%) contrast(90%)"
          },
          primary: '#0ea1ed',
          secondary: '#ed2637',
          accent: '#ede626',
          neutral: '#747e7e',
          'base-100': '#1c1c1c',
          'base-200': '#141414'
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "tribehub_dark_theme",
  },
  darkMode: ['class', '[data-theme="tribehub_dark_theme"]'],
}
