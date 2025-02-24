<script setup>
import dayjs from 'dayjs';
import { computed, onMounted, reactive } from 'vue';
import { useStore } from '@/stores';
import CountdownTimer from '@/components/CountdownTimer.vue';
import PrayerTimes from '@/components/PrayerTimes.vue';

const props = defineProps({
  city: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['back', 'ready']);

const state = reactive({
  response: null,
  nextDaysTimes: null,
  times: [],
  isNextSahur: false,
  nextTimeLabel: '',
  isLoading: true
});

const store = useStore();

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
    const params = {
      city: props.city,
      country: 'Turkey',
      method: 13,
    };

    const { data:response } = await store.fetchTimesByCity(params);
    state.response = response;

    let nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay = dayjs(nextDay).format('DD-MM-YYYY');

    const { data:nextDayResponse } = await store.fetchTimesByCityAndDate(nextDay, params);
    state.nextDaysTimes = nextDayResponse.data;

    setAdhanTimeList();
    emit('ready');
  } catch (error) {
    console.error('Error fetching prayer times:', error);
  } finally {
    state.isLoading = false;
  }
};

const setAdhanTimeList = () => {
  const { timings } = state.response.data;

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

const handleBack = () => {
  emit('back');
};

const getAdhanTime = (name) => {
  const { timings } = state.isNextSahur ? state.nextDaysTimes : state.response.data;
  const time = timings[name];
  const [hour, minute] = time.split(':');

  const now = new Date();
  const adhanTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);

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

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="flex h-5/6 mt-8">
    <div v-show="state.isLoading" class="flex flex-col items-center justify-center w-full animate-fade-in gap-6">
      <div class="loading-cycle">
        <i class="bi bi-sun-fill cycle-icon sun"></i>
        <i class="bi bi-moon-fill cycle-icon moon"></i>
        <i class="bi bi-stars cycle-icon stars"></i>
      </div>
      <div class="text-lg opacity-80">Vakitler yükleniyor...</div>
    </div>

    <div v-show="!state.isLoading" class="basis-full w-full">
      <div class="flex flex-col h-full justify-between">
        <!-- Top: City Info -->
        <div class="flex justify-center">
          <div class="basis-auto">
            <div class="flex items-center gap-4">
              <div class="text-2xl flex items-center gap-4">
                {{ props.city }}
                <button class="btn btn-circle btn-primary btn-ghost btn-sm" @click="handleBack">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex">
              <div class="text-base opacity-70">{{ formattedDate }}</div>
            </div>
          </div>
        </div>

        <!-- Middle: Counter -->
        <CountdownTimer
          v-if="!state.isLoading"
          :target-time="targetTime"
          :mode="timerMode"
        />

        <!-- Bottom: Prayer Times -->
        <PrayerTimes :times="state.times" />
      </div>
    </div>
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
  font-size: 1.5rem;
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