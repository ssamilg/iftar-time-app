<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  times: {
    type: Array,
    required: true
  }
});

const currentTimeIndex = computed(() => {
  const now = new Date();
  const currentTimestamp = now.setHours(now.getHours(), now.getMinutes(), 0, 0);

  let currentIndex = 0;

  props.times.forEach((time, index) => {
    const [hours, minutes] = time.time.split(':');
    const timestamp = now.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    if (currentTimestamp >= timestamp) {
      currentIndex = index;
    }
  });

  return currentIndex;
});

const getTimeClasses = computed(() => (index) => {
  return {
    'prayer-time': true,
    'prayer-time-current': index === currentTimeIndex.value,
    'prayer-time-past': index < currentTimeIndex.value
  };
});
</script>

<template>
  <div class="flex w-full justify-center text-sm mt-10">
    <div class="basis-full max-w-sm px-4">
      <div class="space-y-1.5">
        <div
          v-for="(time, index) in times"
          :key="time.name"
          class="prayer-time-item"
        >
          <div class="flex items-center px-2 py-1.5 rounded" :class="getTimeClasses(index)">
            <div class="prayer-time-name">{{ time.name }}</div>
            <i :class="[time.icon, 'prayer-time-icon']" />
            <div class="prayer-time-time">{{ time.time }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.prayer-time {
  &-name {
    @apply flex-1 font-medium text-primary/80 text-right;
  }

  &-icon {
    @apply mx-3 text-primary/40;
  }

  &-time {
    @apply flex-1 tabular-nums text-primary/80 text-left;
  }

  &-current {
    @apply bg-primary/10 text-lg;

    .prayer-time-name,
    .prayer-time-time,
    .prayer-time-icon {
      @apply text-primary;
    }

    .prayer-time-icon {
      @apply text-xl;
    }
  }

  &-past {
    @apply opacity-40 text-sm;
  }
}
</style>