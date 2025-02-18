/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'amiri': ['Amiri', 'serif'],
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          "base-100": "#f8f9fa",     /* Soft white background */
          "base-200": "#EDF2F7",  /* More noticeable cool gray */
          "primary": "#2c3e50",   /* Deep blue-gray text */
        },
        dark: {
          "base-100": "#121212",     /* Material dark background */
          "base-200": "#1E1E1E",  /* Slightly lighter than base-100 for gradient */
          "primary": "#ffffff",   /* White text */
        },
        islamic:{
          "base-100": "#234E52",     /* Deep teal background */
          "base-200": "#2C3E50",  /* Warmer, more peachy undertone */
          "primary": "#FBE6C2",   /* Warm parchment text */
        },
        ottoman: {
          "base-100": "#F8F3E6",  /* Rich cream/parchment */
          "base-200": "#D5B3A7",  /* Slightly warmer for gradient */
          "primary": "#9B2242",   /* Deep Ottoman crimson */
        },
        seljuk: {
          "base-100": "#006D7C",   /* Rich blue-turquoise - that sweet spot between dark blue and turquoise */
          "base-200": "#7C6755",  /* Warm earthy brown that complements the turquoise while adding warmth */
          "primary": "#FFFFFF",  /* Pure white like the flag */
        },
      },
    ],
  },
  plugins: [daisyui],
}

