<script setup>
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import { computed, onMounted, reactive, ref } from 'vue';
import { useStore } from '@/stores';
import CountdownTimer from '@/components/CountdownTimer.vue';
import PrayerTimes from '@/components/PrayerTimes.vue';
import SettingsPage from '@/views/SettingsPage.vue';
import { getHijriMonthById } from '@/constants/hijriMonths';

// Set locale to Turkish
dayjs.locale('tr');

const props = defineProps({
  currentTheme: {
    type: String,
    required: true
  },
  themes: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['back', 'ready', 'updateSettings']);

const store = useStore();
const showSettings = ref(false);
const showDate = ref(localStorage.getItem('showDate') !== 'false');
const showHijriDate = ref(localStorage.getItem('showHijriDate') !== 'false');
const hideSeconds = ref(localStorage.getItem('hideSeconds') === 'true');

const state = reactive({
  times: [],
  isNextSahur: false,
  nextTimeLabel: '',
});

const timesTRTranslation = {
  Sunrise: 'Güneş',
  Fajr: 'Imsak',
  Dhuhr: 'Öğle',
  Asr: 'İkindi',
  Maghrib: 'Akşam',
  Isha: 'Yatsı',
};

const iftarTime = computed(() => {
  return getAdhanTime('Maghrib');
});

const sahurTime = computed(() => {
  return getAdhanTime('Fajr');
});

const targetTime = computed(() => {
  const mode = checkTimerMode();
  if (mode === 'sahur') {
    const sahur = sahurTime.value;
    if (state.isNextSahur) {
      sahur.setDate(sahur.getDate() + 1);
    }
    return sahur;
  }
  return iftarTime.value;
});

const timerMode = computed(() => {
  return checkTimerMode();
});

const fetchData = async () => {
  try {
    await store.fetchAllTimes();
    setAdhanTimeList();
    emit('ready');
  } catch (error) {
    console.error('Error fetching prayer times:', error);
  }
};

const setAdhanTimeList = () => {
  if (!store.prayerTimes) return;

  const { timings } = store.prayerTimes.data;

  const adhanTimeList = [
    'Fajr',
    'Dhuhr',
    'Asr',
    'Maghrib',
    'Isha',
    'Sunrise',
  ];

  const timeIcons = {
    'Fajr': 'bi-moon-stars-fill',
    'Dhuhr': 'bi-sun-fill',
    'Asr': 'bi-sunset-fill',
    'Maghrib': 'bi-moon-fill',
    'Isha': 'bi-stars',
    'Sunrise': 'bi-sunrise-fill',
  };

  state.times = adhanTimeList
    .sort((a, b) => {
      return timings[a] > timings[b] ? 1 : -1;
    })
    .map((name) => {
    return {
      name: timesTRTranslation[name],
      time: timings[name],
      icon: timeIcons[name],
    };
  });
};

const getAdhanTime = (name) => {
  let adhanTime = new Date();

  if (store.prayerTimes && store.nextDayTimes) {
    const { timings } = state.isNextSahur ? store.nextDayTimes.data : store.prayerTimes.data;
    const time = timings[name];
    const [hour, minute] = time.split(':');

    const now = new Date();
    adhanTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);

    // Apply 1-minute correction to Maghrib (iftar) time
    if (name === 'Maghrib') {
      adhanTime.setMinutes(adhanTime.getMinutes() - 1);
    }
  }

  return adhanTime;
};

const checkTimerMode = () => {
  let timerMode = 'iftar';

  const now = new Date();
  const iftar = iftarTime.value;
  const sahur = sahurTime.value;

  if (sahur > now) {
    timerMode = 'sahur';
  } else if (now > sahur && now < iftar) {
    timerMode = 'iftar';
  } else if (now > iftar && now > sahur) {
    state.isNextSahur = true;
    timerMode = 'sahur';
  }

  return timerMode;
};

const formattedDate = computed(() => {
  return dayjs().format('DD MMMM YYYY');
});

const formattedHijriDate = computed(() => {
  let hijriDate = null;

  if (store.hijriDate) {
    const { day, year, month } = store.hijriDate;
    const monthName = getHijriMonthById(month.number).nameTR;

    hijriDate = `${day} ${monthName} ${year}`;
  }

  return hijriDate;
});

const handleSettingsClick = () => {
  showSettings.value = true;
};

const handleSettingsClose = () => {
  showSettings.value = false;
};

const handleSettingsUpdate = (settings) => {
  if (settings.showDate !== undefined) {
    localStorage.setItem('showDate', settings.showDate);
    showDate.value = settings.showDate;
  }
  if (settings.showHijriDate !== undefined) {
    localStorage.setItem('showHijriDate', settings.showHijriDate);
    showHijriDate.value = settings.showHijriDate;
  }
  if (settings.hideSeconds !== undefined) {
    localStorage.setItem('hideSeconds', settings.hideSeconds);
    hideSeconds.value = settings.hideSeconds;
  }
  emit('updateSettings', settings);
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="flex h-5/6 mt-8">
    <div v-show="store.isLoading" class="flex flex-col items-center justify-center w-full animate-fade-in gap-6">
      <div class="loading-cycle">
        <i class="bi bi-sun-fill cycle-icon sun"></i>
        <i class="bi bi-moon-fill cycle-icon moon"></i>
        <i class="bi bi-stars cycle-icon stars"></i>
      </div>
      <div class="text-lg opacity-80">Vakitler yükleniyor...</div>
    </div>

    <div v-show="!store.isLoading" class="basis-full w-full">
      <div class="flex flex-col h-full justify-between">
        <!-- Top: City Info -->
        <div class="flex justify-center">
          <div class="basis-auto">
            <div class="flex items-center justify-center w-full gap-4">
              <div class="basis-auto">
                <div class="text-2xl flex items-center gap-4">
                  <div class="basis-auto">
                    {{ store.selectedCity }}
                  </div>

                  <button class="btn btn-circle btn-primary btn-ghost btn-sm" @click="handleSettingsClick">
                    <i class="bi bi-gear"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center opacity-70">
              <div v-if="showDate" class="basis-auto">
                {{ formattedDate }}
              </div>

              <div v-if="showHijriDate && formattedHijriDate" class="basis-auto">
                <template v-if="showDate">
                  <i class="bi bi-dot"></i>
                </template>
                {{ formattedHijriDate }}
              </div>
            </div>
          </div>
        </div>

        <!-- Middle: Counter -->
        <CountdownTimer
          v-if="!store.isLoading"
          :target-time="targetTime"
          :mode="timerMode"
          :hide-seconds="hideSeconds"
          @timer-complete="fetchData"
        />

        <!-- Bottom: Prayer Times -->
        <PrayerTimes :times="state.times" />
      </div>
    </div>

    <!-- Settings Modal -->
    <SettingsPage
      v-if="showSettings"
      :current-city="store.selectedCity"
      :current-theme="props.currentTheme"
      :show-date="showDate"
      :show-hijri-date="showHijriDate"
      :hide-seconds="hideSeconds"
      :themes="props.themes"
      @close="handleSettingsClose"
      @update-settings="handleSettingsUpdate"
      @refresh="fetchData"
    />
  </div>
</template>

<style lang="scss">
// Add smooth transitions for prayer time items
.flex-enter-active,
.flex-leave-active {
  transition: all 0.3s ease;
}
.flex-enter-from,
.flex-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.bi {
  font-size: 1.2rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.loading-cycle {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cycle-icon {
  position: absolute;
  font-size: 3.5rem;
  color: var(--primary);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
    transform: scale(0.8);
  }
  5%, 28% {
    opacity: 1;
    transform: scale(1);
  }
  33% {
    opacity: 0;
    transform: scale(0.8);
  }
}

.sun {
  animation: fadeInOut 6s infinite;
}

.moon {
  animation: fadeInOut 6s infinite 2s;
}

.stars {
  animation: fadeInOut 6s infinite 4s;
}
</style>