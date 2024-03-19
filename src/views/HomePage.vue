<script setup>
import { computed, onMounted, reactive } from 'vue';
import { useStore } from '@/stores';

const state = reactive({
  response: null,
  city: 'Ankara',
  times: [],
  isNextSahur: false,
  nextTimeLabel: '',
  isInitialized: false,
});

const store = useStore();

const timesTRTranslation = {
  Sunrise: 'Gün Doğumu',
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
  const params = {
    city: state.city,
    country: 'Turkey',
    method: 13,
  };

  const { data:response } = await store.fetchTimesByCity(params);
  state.response = response;
  state.isInitialized = true;

  setAdhanTimeList();
  startCounter();
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

  state.times = adhanTimeList.map((name) => {
    return {
      name: timesTRTranslation[name],
      time: timings[name],
      emoji: '🌙',
    };
  });
};

const startCounter = () => {
  let counter = timer().value;

  setCountdownValue('timer-seconds', counter.seconds);
  setCountdownValue('timer-minutes', counter.minutes);
  setCountdownValue('timer-hours', counter.hours);

  setInterval(() => {
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

const setCountdownValue = (id, value) => {
  document.getElementById(id).style.setProperty('--value', value);
};

const getAdhanTime = (name) => {
  const { timings } = state.response.data;
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
    state.nextTimeLabel = 'Sahur';
    return timeUntilSahur;
  }

  state.nextTimeLabel = 'İftar';
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


onMounted(() => {
  // fetchData();
});
</script>

<template>
  <div class="flex h-[100vh] w-full items-center justify-center">
    <div class="basis-auto text-primary">
      <div v-show="!state.isInitialized" class="flex h-full">
        <div class="basis-full">
          <div class="flex">
            <input v-model="state.city" class="input input-bordered input-lg mr-2 text-center">
          </div>

          <div class="flex mt-4 text-3xl w-full justify-center">
            için iftara
          </div>

          <div class="flex mt-4">
            <button @click="fetchData" class="btn btn-primary btn-lg w-full">Ne kadar kaldı ?</button>
          </div>
        </div>
      </div>

      <div v-show="state.isInitialized" class="flex mt-8">
        <div class="basis-full">
          <div class="flex capitalize text-3xl">
            {{ state.city }} için
            {{ state.nextTimeLabel }}'a
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

          <div class="flex w-full justify-center mt-12">
            <div class="basis-full">
              <template v-if="state.response">
                {{ state.response.data.timings.Maghrib }}
              </template>

              <div v-for="(time, index) in state.times" :key="index" class="flex text-center">
                <div class="basis-1/2">
                  {{ time.name }} :
                </div>

                <div class="basis-1/2">
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