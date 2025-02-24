<script setup>
import { ref, computed } from 'vue';
import { cities } from '@/data/cities';

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

const searchQuery = ref('');

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/i̇/g, 'i') // Handle dotted i
    .replace(/ı/g, 'i') // Convert dotless i to i
    .replace(/İ/g, 'i') // Convert capital dotted I to i
    .replace(/I/g, 'i') // Convert capital dotless I to i
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim();
};

const filteredCities = computed(() => {
  const query = normalizeText(searchQuery.value);
  if (!query) return cities;

  return cities.filter(city =>
    normalizeText(city.name).includes(query)
  );
});

const handleSelect = (cityName) => {
  emit('select', cityName);
  emit('close');
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-base-100 z-50 flex flex-col"
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
          placeholder="Şehir ara..."
          class="input input-bordered input-sm w-full bg-primary/10"
          autofocus
        />
      </div>
    </div>

    <div class="flex-1 overflow-auto p-2">
      <div class="grid grid-cols-1 gap-2">
        <button
          v-for="city in filteredCities"
          :key="city.id"
          class="btn text-left h-auto min-h-12 normal-case text-base border border-primary/20"
          :class="{ 'bg-primary/20 text-primary border-primary/20': city.name === selectedCity }"
          @click="handleSelect(city.name)"
        >
          {{ city.name }}
        </button>
      </div>
    </div>
  </div>
</template>
