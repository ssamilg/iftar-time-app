<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from '@/stores';

// Props and emits
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  selectedCity: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close', 'select']);

// Store and state
const store = useStore();
const searchQuery = ref('');
const selectedCountry = ref(localStorage.getItem('selectedCountry') || 'Turkey');
const isLoading = ref(false);
const showCountrySelector = ref(true); // Default to showing countries first
const citiesPerBatch = 20;
const displayedCitiesCount = ref(citiesPerBatch);

// Text normalization for search
const normalizeText = (text) => {
  let normalizedText = '';

  if (text) {
    normalizedText = text
      .toLowerCase()
      .replace(/i̇/g, 'i')
      .replace(/ı/g, 'i')
      .replace(/İ/g, 'i')
      .replace(/I/g, 'i')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  return normalizedText;
};

// Computed properties
const filteredCities = computed(() => {
  const query = normalizeText(searchQuery.value);
  let cities = store.cities;

  if (query) {
    cities = cities.filter(city => normalizeText(city).includes(query));
  }

  return cities;
});

const displayedCities = computed(() => {
  return filteredCities.value.slice(0, displayedCitiesCount.value);
});

const hasMoreCities = computed(() => {
  return displayedCitiesCount.value < filteredCities.value.length;
});

const filteredCountries = computed(() => {
  const query = normalizeText(searchQuery.value);
  let filteredCountries = store.countries;

  if (query) {
    filteredCountries = filteredCountries.filter(country =>
      normalizeText(country.country).includes(query)
    );
  }

  return filteredCountries;
});

const countryName = computed(() => {
  return selectedCountry.value;
});

// Load cities for a country
const loadCities = async (country) => {
  isLoading.value = true;
  try {
    await store.fetchCitiesByCountry(country);
  } catch (error) {
    console.error('Failed to load cities:', error);
  } finally {
    isLoading.value = false;
  }
};

// Infinite scroll methods
const loadMoreCities = () => {
  if (hasMoreCities.value) {
    displayedCitiesCount.value += citiesPerBatch;
  }
};

const handleScroll = (event) => {
  const element = event.target;
  const scrollPosition = element.scrollTop + element.clientHeight;
  const scrollHeight = element.scrollHeight;

  if (scrollHeight - scrollPosition < 100 && hasMoreCities.value && !isLoading.value) {
    loadMoreCities();
  }
};

// UI interaction methods
const handleSelectCity = (cityName) => {
  emit('select', cityName);
  emit('close');
};

const handleSelectCountry = (country) => {
  selectedCountry.value = country.country;
  localStorage.setItem('selectedCountry', country.country);
  showCountrySelector.value = false;
  searchQuery.value = '';
  displayedCitiesCount.value = citiesPerBatch;
  loadCities(country.country);
};

const toggleCountrySelector = () => {
  showCountrySelector.value = !showCountrySelector.value;
  searchQuery.value = '';
  displayedCitiesCount.value = citiesPerBatch;
};

// Watchers and lifecycle hooks
watch(() => searchQuery.value, () => {
  displayedCitiesCount.value = citiesPerBatch;
});

watch(() => props.show, async (newValue) => {
  if (newValue) {
    // If we have a selected country, load its cities
    if (selectedCountry.value && store.cities.length === 0) {
      await loadCities(selectedCountry.value);
    }

    displayedCitiesCount.value = citiesPerBatch;
  }
});
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-base-100 z-50 flex flex-col max-w-lg mx-auto h-dvh"
  >
    <div class="p-3 border-b border-base-200 flex items-center gap-3">
      <button
        class="btn btn-ghost btn-sm btn-circle"
        @click="$emit('close')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="flex-1">
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="showCountrySelector ? 'Ülke ara...' : 'Şehir ara...'"
          class="input input-bordered input-sm w-full bg-primary/10 text-base"
          autofocus
        />
      </div>
    </div>

    <div v-if="!showCountrySelector" class="p-2 border-b border-base-200">
      <button
        class="btn btn-outline w-full flex justify-between items-center mb-2"
        @click="toggleCountrySelector"
      >
        <span>{{ `Ülke: ${countryName}` }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
          :class="{ 'rotate-180': showCountrySelector }"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
    </div>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <span class="loading loading-spinner loading-md text-primary"></span>
    </div>

    <!-- Country selection list -->
    <div v-else-if="showCountrySelector" class="flex-1 overflow-y-auto p-2">
      <div class="grid grid-cols-1 gap-2">
        <button
          v-for="country in filteredCountries"
          :key="country.iso2"
          class="btn text-left h-auto min-h-12 normal-case text-base border border-primary/20"
          :class="{ 'bg-primary/20 text-primary border-primary/20': country.country === countryName }"
          @click="handleSelectCountry(country)"
        >
          {{ country.country }}
        </button>
      </div>
    </div>

    <div v-else class="flex-1 overflow-y-auto p-2" @scroll="handleScroll">
      <div class="grid grid-cols-1 gap-2">
        <button
          v-for="city in displayedCities"
          :key="city"
          class="btn text-left h-auto min-h-12 normal-case text-base border border-primary/20"
          :class="{ 'bg-primary/20 text-primary border-primary/20': city === selectedCity }"
          @click="handleSelectCity(city)"
        >
          {{ city }}
        </button>

        <!-- Loading indicator for infinite scroll -->
        <div v-if="hasMoreCities" class="flex justify-center py-2">
          <span class="loading loading-spinner loading-sm text-primary"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.overflow-y-auto {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  height: 100%;
}
</style>
