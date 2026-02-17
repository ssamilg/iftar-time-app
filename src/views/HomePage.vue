<script setup>
import { ref, computed, onMounted } from 'vue';
import CountdownPage from './CountdownPage.vue';
import ThemePatterns from '../components/ThemePatterns.vue';
import CitySelector from '../components/CitySelector.vue';

const DEFAULT_THEME = 'islamic';
const city = ref(localStorage.getItem('selectedCity') || 'Ankara');
const showCountdown = ref(false);
const currentTheme = ref(localStorage.getItem('selectedTheme') || DEFAULT_THEME);
const themes = [
  { value: 'light', label: 'Modern', font: 'Inter' },
  { value: 'dark', label: 'Dark', font: 'Roboto' },
  { value: 'islamic', label: 'Islamic', font: 'Aref Ruqaa' },
  { value: 'ottoman', label: 'Ottoman', font: 'Quintessential' },
  { value: 'seljuk', label: 'Seljuk', font: 'Faculty Glyphic' },
  { value: 'digital', label: 'Digital', font: 'VT323' },
  { value: 'ssg', label: 'SSG', font: 'Poppins' },
  { value: 'dune', label: 'Dune', font: 'Chakra Petch' },
  { value: 'andalus', label: 'Andalus', font: 'Amiri' },
];

const handleBack = () => {
  showCountdown.value = false;
};

const currentFont = computed(() => {
  const selectedTheme = themes.find(theme => theme.value === currentTheme.value);
  return selectedTheme?.font || 'system-ui';
});

const handleThemeChange = (event) => {
  const newTheme = event.target.value;
  const html = document.querySelector('html');

  // First fade out
  document.body.classList.add('theme-transitioning');

  // After fade out, change theme and trigger fade in
  setTimeout(() => {
    currentTheme.value = newTheme;
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('selectedTheme', newTheme);
    document.body.classList.remove('theme-transitioning');
  }, 500);
};

const handleStart = (selectedCity) => {
  city.value = selectedCity;
  showCountdown.value = true;
};

const handleSettingsUpdate = (settings) => {
  if (settings.city) {
    city.value = settings.city;
    localStorage.setItem('selectedCity', settings.city);
  }

  if (settings.theme) {
    handleThemeChange({ target: { value: settings.theme } });
  }
};

onMounted(() => {
  const html = document.querySelector('html');
  const savedTheme = localStorage.getItem('selectedTheme') || DEFAULT_THEME;
  currentTheme.value = savedTheme;
  html.setAttribute('data-theme', savedTheme);

  if (localStorage.getItem('selectedCity')) {
    showCountdown.value = true;
  }
});
</script>

<template>
  <div
    class="relative flex h-dvh w-full justify-center home-page overflow-auto"
    :style="{ fontFamily: currentFont }"
  >
    <ThemePatterns :theme="currentTheme" />
    <div class="basis-full text-primary flex flex-col">
      <div class="flex-grow">
        <CitySelector
          v-if="!showCountdown"
          :current-font="currentFont"
          @start="handleStart"
        />

        <CountdownPage
          v-else
          :city="city"
          :current-theme="currentTheme"
          :themes="themes"
          @back="handleBack"
          @update-settings="handleSettingsUpdate"
        />
      </div>

      <div class="text-center py-4">
        <a href="https://ssamilg.dev" class="text-primary hover:opacity-80 transition-opacity">
          SSG
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
body {
  transition: opacity 1s ease;
}

body.theme-transitioning {
  opacity: 0;
}

.home-page {
  @apply bg-gradient-to-b from-base-100 to-base-200;
}

.dropdown-content {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    @apply bg-base-200 rounded-lg;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-primary rounded-lg transition-opacity duration-200;

    &:hover {
      @apply bg-primary/80;
    }
  }
}
</style>