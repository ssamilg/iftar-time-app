<script setup>
import { computed, onMounted, reactive } from 'vue';
import { useStore } from '@/stores';

const state = reactive({
  response: null,
  city: 'Ankara',
  times: [],
  isNextSahur: false,
});

const store = useStore();

const timesTRTranslation = {
  Fajr: 'Sabah',
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
    return timeUntilSahur;
  }

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
  fetchData();
});
</script>

<template>
  <div class="flex h-full w-full items-center justify-center">
    <div class="basis-auto text-primary">
      <div class="flex">
        {{ state.city }}
        <input v-model="state.city" class="input input-bordered mr-2">
        <button @click="fetchData" class="btn btn-primary">Get Data</button>
      </div>

      <div class="flex">
        <div class="basi-full">
          <div class="flex my-4">
            <div class="grid grid-flow-col gap-5 text-center auto-cols-max">
              <div class="flex flex-col">
                <span class="countdown font-mono text-5xl">
                  <span id="timer-hours" style="--value:00;" />
                </span>
                hours
              </div>
              <div class="flex flex-col">
                <span class="countdown font-mono text-5xl">
                  <span id="timer-minutes" style="--value:00;" />
                </span>
                min
              </div>
              <div class="flex flex-col">
                <span class="countdown font-mono text-5xl">
                  <span id="timer-seconds" style="--value:00;" />
                </span>
                sec
              </div>
            </div>
          </div>

          <template v-if="state.response">
            {{ state.response.data.timings.Maghrib }}
          </template>

          <div v-for="(time, index) in state.times" :key="index" class="flex">
            {{ index }} - {{ time.name }} : {{ time.time }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

