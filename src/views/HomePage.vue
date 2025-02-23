<script setup>
import { ref, computed, onMounted } from 'vue';
import CountdownPage from './CountdownPage.vue';
import ThemePatterns from '../components/ThemePatterns.vue';
import { cities } from '@/data/cities';

const DEFAULT_THEME = 'islamic';
const city = ref(localStorage.getItem('selectedCity') || 'Ankara');
const showCountdown = ref(false);
const searchQuery = ref(city.value);
const isDropdownOpen = ref(false);
const currentTheme = ref(localStorage.getItem('selectedTheme') || DEFAULT_THEME);
const themes = [
  { value: 'light', label: 'Modern', font: 'Inter' },
  { value: 'dark', label: 'Dark', font: 'Roboto' },
  { value: 'islamic', label: 'Islamic', font: 'Noto Naskh Arabic' },
  { value: 'ottoman', label: 'Ottoman', font: 'Mirza' },
  { value: 'seljuk', label: 'Seljuk', font: 'Kavivanar' },
];

const filteredCities = computed(() => {
  if (isDropdownOpen.value && searchQuery.value === city.value) {
    return cities;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return cities.filter(city =>
    city.name.toLowerCase().includes(query)
  );
});

const startCountdown = () => {
  showCountdown.value = true;
  localStorage.setItem('selectedCity', city.value);
};

const handleBack = () => {
  showCountdown.value = false;
};

const handleCitySelect = (selectedCity) => {
  city.value = selectedCity;
  searchQuery.value = selectedCity;
  isDropdownOpen.value = false;
  localStorage.setItem('selectedCity', selectedCity);
};

const handleFocus = () => {
  isDropdownOpen.value = true;
  searchQuery.value = '';
};

const handleBlur = () => {
  setTimeout(() => {
    isDropdownOpen.value = false;
    searchQuery.value = city.value;
  }, 200);
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
    class="relative flex h-screen w-full justify-center home-page"
    :style="{ fontFamily: currentFont }"
  >
    <ThemePatterns :theme="currentTheme" />
    <div class="basis-full text-primary">
      <div v-if="!showCountdown" class="flex items-center h-full">
        <div class="basis-auto w-full">
          <div class="flex justify-center">
            <div class="dropdown w-full max-w-xs" :class="{ 'dropdown-open': isDropdownOpen }">
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="city ? '' : 'Şehir seçin'"
                class="input input-bordered input-lg w-full text-center pr-10"
                @focus="handleFocus"
                @blur="handleBlur"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
              <div
                class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full max-h-96 overflow-auto"
              >
                <ul class="menu menu-compact">
                  <li v-for="cityOption in filteredCities" :key="cityOption.id">
                    <a
                      @mousedown="handleCitySelect(cityOption.name)"
                      :class="{ 'active': cityOption.name === city }"
                    >
                      {{ cityOption.name }}
                    </a>
                  </li>
                  <li v-if="filteredCities.length === 0" class="text-center opacity-50 py-2">
                    Sonuç bulunamadı
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex mt-4 text-3xl w-full justify-center">
            için iftara
          </div>

          <div class="flex mt-4 w-full justify-center">
            <button
              @click="startCountdown"
              class="btn btn-primary btn-lg w-full max-w-xs"
              :disabled="!city"
            >
              Ne kadar kaldı ?
            </button>
          </div>
        </div>
      </div>

      <CountdownPage
        v-else
        :city="city"
        @back="handleBack"
      />
    </div>

    <div class="absolute bottom-0 text-center text-primary flex flex-col gap-4">
      <div class="flex gap-2 items-center">
        <select
          class="select select-bordered select-sm w-32"
          :value="currentTheme"
          @change="handleThemeChange"
        >
          <option v-for="theme in themes" :key="theme.value" :value="theme.value">
            {{ theme.label }}
          </option>
        </select>
      </div>

      <a href="https://ssamilg.dev">
        SSG
      </a>
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

/* Add theme-specific input styling */
[data-theme='seljuk'] {
  .input, .select {
    @apply bg-opacity-50;
    backdrop-filter: blur(4px);
  }

  .dropdown-content {
    @apply bg-opacity-90;
    backdrop-filter: blur(8px);
  }
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