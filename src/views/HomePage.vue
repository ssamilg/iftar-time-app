<script setup>
import { ref, computed } from 'vue';
import CountdownPage from './CountdownPage.vue';
import { cities } from '@/data/cities';

const city = ref('Ankara');
const showCountdown = ref(false);
const searchQuery = ref(city.value);
const isDropdownOpen = ref(false);

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
};

const handleBack = () => {
  showCountdown.value = false;
};

const handleCitySelect = (selectedCity) => {
  city.value = selectedCity;
  searchQuery.value = selectedCity;
  isDropdownOpen.value = false;
};

const handleFocus = () => {
  isDropdownOpen.value = true;
};

const handleBlur = () => {
  setTimeout(() => {
    isDropdownOpen.value = false;
    searchQuery.value = city.value;
  }, 200);
};
</script>

<template>
  <div class="flex h-[100vh] w-full items-center justify-center">
    <div class="basis-auto text-primary">
      <div v-if="!showCountdown" class="flex h-full">
        <div class="basis-full">
          <div class="flex flex-col items-center">
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

            <div class="flex mt-4 text-3xl w-full justify-center">
              için iftara
            </div>

            <div class="flex mt-4 w-full max-w-xs">
              <button
                @click="startCountdown"
                class="btn btn-primary btn-lg w-full"
                :disabled="!city"
              >
                Ne kadar kaldı ?
              </button>
            </div>
          </div>
        </div>
      </div>

      <CountdownPage
        v-else
        :city="city"
        @back="handleBack"
      />
    </div>

    <div class="absolute bottom-0 text-center text-primary">
      <a href="https://ssamilg.dev">
        SSG
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.countdown-digit {
  @apply text-6xl sm:text-7xl;
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