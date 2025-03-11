<script setup>
import { onBeforeUnmount, ref, watch, computed } from 'vue';
import { useStore } from '@/stores';

const store = useStore();

const props = defineProps({
  targetTime: {
    type: Date,
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  hideSeconds: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['timerComplete', 'duaVisible']);

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
let intervalId = null;
let lastDiff = null;
const showIftarMessage = ref(false);

const showDua = computed(() => {
  return props.mode === 'iftar' && hours.value === 0 && minutes.value === 0 && seconds.value < 60;
});

watch(showDua, (newValue) => {
  if (newValue) {
    showIftarMessage.value = true;
    setTimeout(() => {
      showIftarMessage.value = false;
      emit('timerComplete');
    }, 120000); // Show for 2 minutes
  }
  emit('duaVisible', newValue);
});

const display = computed(() => {
  const result = {
    showHours: false,
    showMinutes: true,
    showSeconds: !props.hideSeconds || (hours.value === 0 && minutes.value === 0),
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

    if (lastDiff > 0) {
      emit('timerComplete');
      // Ensure dua is hidden when timer completes
      if (showDua.value) {
        emit('duaVisible', false);
      }
    }
  } else {
    hours.value = Math.floor((diff / (1000 * 60 * 60)) % 24);
    minutes.value = Math.floor((diff / 1000 / 60) % 60);
    seconds.value = Math.floor((diff / 1000) % 60);
  }

  lastDiff = diff;
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
  <div class="flex justify-center flex-col items-center">
    <div class="basis-auto">
      <div class="timer-title">
        <template v-if="showIftarMessage">
          <div class="iftar-message mt-10">
            <div class="city-name">{{ store.selectedCity }}</div>
            <div class="message-text">
              <p>için</p>
              <p>iftar vakti!</p>
            </div>
          </div>
        </template>
        <template v-else>
          {{ mode === 'iftar' ? 'İftara' : 'İmsak Vaktine' }}
        </template>
      </div>

      <div v-if="!showIftarMessage" class="flex items-end gap-2">
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

        <template v-if="display.showSeconds">
          <div :class="display.secondClass">
            <div :style="{ '--value': seconds }" />
          </div>
          <div :class="display.secondLabelClass">sn</div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.timer-title {
  @apply text-xl sm:text-2xl md:text-3xl 2xl:text-4xl opacity-70 text-center mb-4;

  &:has(.iftar-message) {
    @apply opacity-100;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.iftar-message {
  @apply flex flex-col items-center gap-2 text-primary;

  .city-name {
    @apply text-6xl sm:text-5xl md:text-6xl 2xl:text-7xl font-bold opacity-0;
    animation: slideInUp 0.5s ease-out forwards;
  }

  .message-text {
    @apply text-5xl sm:text-3xl md:text-4xl 2xl:text-5xl font-medium flex flex-col items-center gap-1;

    p {
      opacity: 0;
      animation: slideInUp 0.5s ease-out forwards;

      &:first-child {
        animation-delay: 0.3s;
      }

      &:last-child {
        animation-delay: 0.6s;
      }
    }
  }
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