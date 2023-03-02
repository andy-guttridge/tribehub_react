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
            "filter": "invert(26%) sepia(93%) saturate(832%) hue-rotate(186deg) brightness(97%) contrast(94%)"
          },
          ".FidgetSpinner": {
            "filter": "invert(17%) sepia(81%) saturate(3952%) hue-rotate(295deg) brightness(81%) contrast(93%)"
          },
          primary: '#e5006a',
          secondary: '#9c13bf',
          accent: '#215ba6',
          neutral: '#4a4a4a',
          'base-100': '#fbfbfb',
          'base-200': '#f8f8f8',
          'base-300': '#d6d6d6'
        }
      },
      {
        tribehub_dark_theme: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark"],
          ".CategoryIcon": {
            "filter": "invert(90%) sepia(15%) saturate(180%) hue-rotate(150deg) brightness(99%) contrast(98%)"
          },
          ".FidgetSpinner": {
            "filter": "invert(80%) sepia(16%) saturate(709%) hue-rotate(175deg) brightness(101%) contrast(94%)"
          },
          ".CalWeekendText": {
            "color": "#f2efc2"
          },
          primary: '#add5f7',
          secondary: '#e6e6e6',
          accent: '#d8ebf2',
          neutral: '#ffffff',
          'base-100': '#1c1c1c',
          'base-200': '#141414',
          'base-300': '#404040'
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
