<script setup>
import { defineProps, computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  times: {
    type: Array,
    required: true
  }
});

const currentTime = ref(new Date());

let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date();
  }, 60000); // Update every minute
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const currentTimeIndex = computed(() => {
  const now = currentTime.value;
  const currentTimestamp = new Date(now).setHours(now.getHours(), now.getMinutes(), 0, 0);
  let currentIndex = -1;

  props.times.forEach((time, index) => {
    const [hours, minutes] = time.time.split(':');
    const timestamp = new Date(now).setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (currentTimestamp >= timestamp) {
      currentIndex = index;
    }
  });

  return currentIndex;
});

const displayTimes = computed(() => {
  const times = [...props.times];

  if (currentTimeIndex.value === -1) {
    times.pop();
    times.unshift({
      ...props.times[5],
      name: 'Yatsı',
      time: 'dün'
    });
  }

  return times;
});

const getTimeClasses = (index) => ({
  'prayer-time': true,
  'prayer-time-current': index === currentTimeIndex.value || (index === 0 && currentTimeIndex.value === -1),
  'prayer-time-past': index < currentTimeIndex.value
});
</script>

<template>
  <div class="flex w-full justify-center text-sm mt-10">
    <div class="basis-full max-w-sm px-4 blur-2px">
      <div class="space-y-1.5">
        <div
          v-for="(time, index) in displayTimes"
          :key="time.name"
          class="prayer-time-item"
        >
          <div class="flex items-center px-2 py-1.5 rounded" :class="getTimeClasses(index)">
            <div class="prayer-time-name">{{ time.name }}</div>
            <i :class="[time.icon, 'prayer-time-icon']" />
            <div class="prayer-time-time">{{ time.time || '-' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.blur-2px {
  backdrop-filter: blur(2px);
}

.prayer-time {
  &-name {
    @apply flex-1 font-medium text-primary/80 text-right text-base;
  }

  &-icon {
    @apply mx-3 text-primary/40;
  }

  &-time {
    @apply flex-1 tabular-nums text-primary/80 text-left text-base;
  }

  &-current {
    @apply bg-primary/10;

    .prayer-time-name,
    .prayer-time-time,
    .prayer-time-icon {
      @apply text-primary text-xl;
    }

    .prayer-time-icon {
      @apply text-2xl;
    }
  }

  &-past {
    @apply opacity-40 text-base;

    .prayer-time-name,
    .prayer-time-time,
    .prayer-time-icon {
      @apply text-sm;
    }
  }
}
</style>