<script setup>
import dayjs from 'dayjs';
import { computed, onMounted, reactive, onBeforeUnmount } from 'vue';
import { useStore } from '@/stores';

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
  isLoading: true,
  intervalId: null
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

const timeUntilIftar = computed(() => {
  const now = new Date();
  const iftar = iftarTime.value;
  const diff = iftar - now;

  return formatTimeDiff(diff);
});

const timeUntilSahur = computed(() => {
  const now = new Date();
  const sahur = sahurTime.value;

  if (state.isNextSahur) {
    sahur.setDate(sahur.getDate() + 1);
  }

  const diff = sahur - now;

  return formatTimeDiff(diff);
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
    startCounter();
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

  state.times = adhanTimeList
    .sort((a, b) => {
      return timings[a] > timings[b] ? 1 : -1;
    })
    .map((name) => {
    return {
      name: timesTRTranslation[name],
      time: timings[name],
      emoji: '🌙',
    };
  });
};

const startCounter = () => {
  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }

  let counter = timer().value;

  setCountdownValue('timer-seconds', counter.seconds);
  setCountdownValue('timer-minutes', counter.minutes);
  setCountdownValue('timer-hours', counter.hours);

  state.intervalId = setInterval(() => {
    if(counter.seconds > 0){
      counter.seconds--
    } else if(counter.seconds === 0){
      counter.seconds = 59;

      if (counter.minutes === 0) {
        counter.minutes = 59;
        counter.hours--;
        setCountdownValue('timer-minutes', counter.minutes);
        setCountdownValue('timer-hours', counter.hours);
      } else {
        counter.minutes--;
        setCountdownValue('timer-minutes', counter.minutes)
      }
    }

    setCountdownValue('timer-seconds', counter.seconds);
  }, 1000);
};

const handleBack = () => {
  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }
  emit('back');
};

const setCountdownValue = (id, value) => {
  document.getElementById(id).style.setProperty('--value', value);
};

const getAdhanTime = (name) => {
  const { timings } = state.isNextSahur ? state.nextDaysTimes : state.response.data;
  const time = timings[name];
  const [hour, minute] = time.split(':');

  const now = new Date();
  const adhanTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);

  return adhanTime;
};

const formatTimeDiff = (diff) => {
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  return { hours, minutes, seconds };
};

const timer = () => {
  const mode = checkTimerMode();

  if (mode === 'sahur') {
    state.nextTimeLabel = 'sahur';
    return timeUntilSahur;
  }

  state.nextTimeLabel = 'iftar';
  return timeUntilIftar;
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
  } else if (now > iftar  && now > sahur) {
    state.isNextSahur = true;
    timerMode = 'sahur';
  }

  return timerMode;
};

onBeforeUnmount(() => {
  if (state.intervalId) {
    clearInterval(state.intervalId);
    state.intervalId = null;
  }
});

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="flex mt-8">
    <div v-show="state.isLoading" class="flex flex-col items-center w-full">
      <span class="loading loading-spinner loading-lg"></span>
      <div class="mt-4 text-xl">
        {{ props.city }} için namaz vakitleri yükleniyor...
      </div>
    </div>

    <div v-show="!state.isLoading" class="basis-full">
      <div class="flex text-3xl items-center justify-between">
        <div class="basis-auto">
          {{ props.city }} için
          {{ state.nextTimeLabel }}'a
        </div>

        <div class="basis-auto">
          <button class="btn btn-circle btn-primary btn-ghost" @click="handleBack">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex w-full justify-center my-4">
        <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
          <div class="flex flex-col">
            <span class="countdown countdown-digit">
              <span id="timer-hours" style="--value:00;" />
            </span>
            saat
          </div>

          <div class="flex flex-col items-center text-7xl">
            :
          </div>

          <div class="flex flex-col">
            <span class="countdown countdown-digit">
              <span id="timer-minutes" style="--value:00;" />
            </span>
            dakika
          </div>

          <div class="flex flex-col items-center text-7xl">
            :
          </div>

          <div class="flex flex-col">
            <span class="countdown countdown-digit">
              <span id="timer-seconds" style="--value:00;" />
            </span>
            saniye
          </div>
        </div>
      </div>

      <div class="flex justify-end text-3xl">
        kaldı
      </div>

      <div class="flex w-full justify-center mt-12 text-lg">
        <div class="basis-full">
          <div v-for="(time, index) in state.times" :key="index" class="flex text-center justify-center">
            <div class="basis-full">
              <div class="flex">
                <div class="basis-1/2 pr-2 text-right">
                  {{ time.name }}
                </div>

                <div class="basis-1/2 pl-2 text-left">
                  {{ time.time }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.countdown-digit {
  @apply text-6xl sm:text-7xl;
}
</style>