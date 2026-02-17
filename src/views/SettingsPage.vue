<script setup>
import { ref, watch } from 'vue';
import CitySelectModal from '@/components/CitySelectModal.vue';
import { useStore } from '@/stores';

const props = defineProps({
  currentCity: {
    type: String,
    required: true
  },
  currentTheme: {
    type: String,
    required: true
  },
  showDate: {
    type: Boolean,
    required: true
  },
  showHijriDate: {
    type: Boolean,
    required: true
  },
  showSeconds: {
    type: Boolean,
    required: true
  },
  themes: {
    type: Array,
    required: true
  }
});

const store = useStore();
const emit = defineEmits(['close', 'updateSettings', 'refresh']);

const selectedCity = ref(props.currentCity);
const selectedTheme = ref(props.currentTheme);
const showDateToggle = ref(props.showDate);
const showHijriDateToggle = ref(props.showHijriDate);
const showSecondsToggle = ref(props.showSeconds);
const showCitySelector = ref(false);

const handleSave = () => {
  const settings = {
    showDate: showDateToggle.value,
    showHijriDate: showHijriDateToggle.value,
    showSeconds: showSecondsToggle.value
  };

  if (selectedCity.value !== props.currentCity) {
    store.setSelectedCity(selectedCity.value);
    emit('refresh');
  }

  emit('updateSettings', settings);
  emit('close');
};

const handleClose = () => {
  emit('close');
};

const handleCitySelect = (city) => {
  selectedCity.value = city;
  store.setSelectedCity(selectedCity.value);
  emit('refresh');
};

const handleThemeChange = (theme) => {
  selectedTheme.value = theme;
  emit('updateSettings', { theme });
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-base-100 p-4 rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90dvh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Ayarlar</h2>
        <div class="flex justify-end gap-2">
          <button class="btn btn-primary btn-sm" @click="handleSave">
            Kaydet
          </button>

          <button class="btn btn-circle btn-ghost btn-sm" @click="handleClose">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <!-- City Selection -->
        <div class="form-control">
          <label class="label py-1">
            <span class="label-text">Şehir</span>
          </label>
          <div class="flex gap-2">
            <input
              type="text"
              class="input input-bordered flex-1"
              :value="selectedCity"
              readonly
              @click="showCitySelector = true"
              placeholder="Şehir seçin"
            />
          </div>
        </div>

        <!-- Show Date Toggle -->
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-4">
            <span class="label-text">Tarih Göster</span>
            <input type="checkbox" class="toggle toggle-primary" v-model="showDateToggle" />
          </label>
        </div>

        <!-- Hijri Date Toggle -->
        <div class="form-control !mt-0">
          <label class="label cursor-pointer justify-start gap-4">
            <span class="label-text">Hicri Tarih Göster</span>
            <input type="checkbox" class="toggle toggle-primary" v-model="showHijriDateToggle" />
          </label>
        </div>

        <!-- Show Seconds Toggle -->
        <div class="form-control !mt-0">
          <label class="label cursor-pointer justify-start gap-4">
            <span class="label-text">Saniye Sayacını Göster</span>
            <input type="checkbox" class="toggle toggle-primary" v-model="showSecondsToggle" />
          </label>
        </div>

        <!-- Theme Selection -->
        <div class="form-control">
          <label class="label py-1">
            <span class="label-text">Tema</span>
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              v-for="theme in themes"
              :key="theme.value"
              class="btn btn-sm"
              :class="[
                selectedTheme === theme.value ? 'btn-primary' : 'btn-outline',
              ]"
              @click="handleThemeChange(theme.value)"
            >
              {{ theme.label }}
            </button>
          </div>
        </div>

        <div class="div">
           <!-- API Disclaimer -->
           <div class="card bg-base-200">
             <div class="card-body p-3">
               <p class="text-xs opacity-70">
                 Namaz vakitleri
                 <a
                   href="https://aladhan.com/prayer-times-api"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="link link-primary"
                 >
                   Aladhan API
                 </a> tarafından sağlanmaktadır. Vakitler resmi kaynaklardan farklılık gösterebilir.
               </p>
             </div>
           </div>

           <!-- GitHub Link -->
           <div class="card bg-base-200 mt-2">
             <div class="card-body p-3">
               <p class="text-xs opacity-70">
                 Bu proje açık kaynaklıdır. Kaynak kodlarına
                 <a
                   href="https://github.com/ssamilg/iftar-time-app"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="link link-primary"
                 >
                   GitHub
                 </a> üzerinden ulaşabilirsiniz.
               </p>
             </div>
           </div>
         </div>
      </div>
    </div>

    <!-- City Select Modal -->
    <CitySelectModal
      v-if="showCitySelector"
      :show="showCitySelector"
      :selected-city="selectedCity"
      @select="handleCitySelect"
      @close="showCitySelector = false"
    />
  </div>
</template>