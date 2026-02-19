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
        sufi: {
          "base-100": "#F8F3E6",  /* Rich cream/parchment */
          "base-200": "#D5B3A7",  /* Slightly warmer for gradient */
          "primary": "#9B2242",   /* Deep dried rose crimson */
        },
        ottoman: {
          "base-100": "#021a10",  /* Deep imperial plum */
          "base-200": "#064e3b",  /* Darker violet for gradient */
          "primary": "#e2e8f0",   /* Pale gold text */
          "--primary-content": "#FFECC3",  /* Bright gold for UI accents */
        },
        seljuk: {
          "base-100": "#006D7C",   /* Rich blue-turquoise - that sweet spot between dark blue and turquoise */
          "base-200": "#003B44",  /* Darker blue-turquoise for gradient depth */
          "primary": "#FFFFFF",  /* Pure white like the flag */
        },
        digital: {
          "base-100": "#000000",  /* Deep black background */
          "base-200": "#1a1a1a",  /* Slightly lighter black for gradient */
          "primary": "#00FF00",   /* Classic LCD green */
        },
        ssg: {
          "base-100": "#18181B",  /* Zinc-900 background */
          "base-200": "#1F2937",  /* Gray-800 for gradient */
          "primary": "#F1F5F9",   /* Slate-100 for content */
          "--primary-content": "#3B82F6",  /* Blue-500 for UI elements */
        },
        dune: {
          "base-100": "#8B5A2B",  /* Desert sand background */
          "base-200": "#654321",  /* Darker sand for gradient depth */
          "primary": "#E6C79C",   /* Light sand color for text */
          "--primary-content": "#C4661F",  /* Spice melange orange for UI elements */
        },
        andalus: {
          "base-100": "#3A0606",  /* Deep burgundy palace walls */
          "base-200": "#2C0404",  /* Darker burgundy for gradient */
          "primary": "#E0C097",   /* Soft Gold/Cream text */
          "--primary-content": "#FBF5B7",  /* Bright gold for UI accents */
        },
      },
    ],
  },
  plugins: [daisyui],
}

