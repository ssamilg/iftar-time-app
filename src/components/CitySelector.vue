<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/stores';
import CitySelectModal from './CitySelectModal.vue';

const props = defineProps({
  currentFont: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['start']);

const store = useStore();
const city = ref(localStorage.getItem('selectedCity') || 'Ankara');
const showModal = ref(false);

const startCountdown = () => {
  localStorage.setItem('selectedCity', city.value);
  store.setSelectedCity(city.value);
  emit('start', city.value);
};

const handleCitySelect = (selectedCity) => {
  city.value = selectedCity;
  localStorage.setItem('selectedCity', selectedCity);
};
</script>

<template>
  <div class="flex items-center h-full">
    <div class="basis-auto w-full">
      <div class="flex justify-center">
        <button
          class="btn btn-lg border-primary/50 text-primary w-full max-w-xs normal-case text-lg gap-2"
          @click="showModal = true"
        >
          {{ city }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
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

    <CitySelectModal
      :show="showModal"
      :selected-city="city"
      @close="showModal = false"
      @select="handleCitySelect"
    />
  </div>
</template>
