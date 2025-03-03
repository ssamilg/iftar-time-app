<script setup>
import { onBeforeUnmount, ref, watch, computed } from 'vue';

const props = defineProps({
  targetTime: {
    type: Date,
    required: true
  },
  mode: {
    type: String,
    required: true
  }
});

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
let intervalId = null;

const display = computed(() => {
  const result = {
    showHours: false,
    showMinutes: true,
    hourClass: 'countdown countdown-digit',
    minuteClass: 'countdown countdown-digit',
    secondClass: 'countdown countdown-digit-small',
    labelClass: 'digit-label',
    secondLabelClass: 'digit-label'
  };

  if (hours.value === 0) {
    if (minutes.value === 0) {
      // Only seconds left
      result.showMinutes = false;
      result.secondClass = 'countdown countdown-digit-xlarge';
      result.secondLabelClass = 'digit-label-large';
    } else {
      // Minutes and seconds
      result.minuteClass = 'countdown countdown-digit-large';
      result.secondClass = 'countdown countdown-digit-large';
    }
  } else {
    // Hours, minutes and seconds
    result.secondClass += ' mb-2';
    result.secondLabelClass = 'digit-label-small';
    result.showHours = true;
  }

  return result;
});

const calculateTimeDiff = () => {
  const now = new Date();
  const diff = props.targetTime - now;

  if (diff <= 0) {
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
  } else {
    hours.value = Math.floor((diff / (1000 * 60 * 60)) % 24);
    minutes.value = Math.floor((diff / 1000 / 60) % 60);
    seconds.value = Math.floor((diff / 1000) % 60);
  }
};

const startCounter = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  calculateTimeDiff();
  intervalId = setInterval(calculateTimeDiff, 1000);
};

watch(() => props.targetTime, () => {
  startCounter();
}, { immediate: true });

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});
</script>

<template>
  <div class="flex justify-center">
    <div class="basis-auto">
      <div class="timer-title">
        {{ mode === 'iftar' ? 'İftara' : 'İmsak Vaktine' }}
      </div>

      <div class="flex items-end gap-2">
        <template v-if="display.showHours">
          <div :class="display.hourClass">
            <div :style="{ '--value': hours }" />
          </div>
          <div :class="display.labelClass">sa</div>
        </template>

        <template v-if="display.showMinutes">
          <div :class="display.minuteClass">
            <div :style="{ '--value': minutes }" />
          </div>
          <div :class="display.labelClass">dk</div>
        </template>

        <div :class="display.secondClass">
          <div :style="{ '--value': seconds }" />
        </div>
        <div :class="display.secondLabelClass">sn</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.timer-title {
  @apply text-xl sm:text-2xl opacity-70 text-center mb-4;
}

.digit-label {
  @apply text-2xl sm:text-3xl opacity-70;

  &-small {
    @apply text-xl sm:text-2xl opacity-70;
  }

  &-large {
    @apply text-3xl sm:text-4xl opacity-70;
  }
}

.countdown {
  &-digit {
    @apply text-7xl sm:text-9xl leading-none;

    &-small {
      @apply text-4xl sm:text-6xl leading-none;
    }

    &-large {
      @apply text-8xl sm:text-[10rem] leading-none;
    }

    &-xlarge {
      @apply text-9xl sm:text-[12rem] leading-none;
    }
  }
}
</style>