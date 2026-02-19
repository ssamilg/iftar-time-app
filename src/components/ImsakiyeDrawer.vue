<script setup>
import { ref, watch, nextTick, computed } from 'vue';
import { getHijriMonthById } from '@/constants/hijriMonths';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  monthlyTimes: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close']);

const todayCardRef = ref(null);

const todayStr = computed(() => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
});

const getDayStatus = (dateStr) => {
  const [dd, mm, yyyy] = dateStr.split('.');
  const dayDate = new Date(yyyy, mm - 1, dd);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dayDate.getTime() === today.getTime()) return 'today';
  if (dayDate < today) return 'past';
  return 'future';
};

const formatGregorianDate = (dateStr) => {
  const [dd, mm, yyyy] = dateStr.split('.');
  const date = new Date(yyyy, mm - 1, dd);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatDayName = (dateStr) => {
  const [dd, mm, yyyy] = dateStr.split('.');
  const date = new Date(yyyy, mm - 1, dd);
  return date.toLocaleDateString('tr-TR', { weekday: 'long' });
};

const formatHijriDate = (hijriStr) => {
  if (!hijriStr) return '';
  const [dd, mm, yyyy] = hijriStr.split('.');
  const month = getHijriMonthById(parseInt(mm, 10));
  const monthName = month ? month.nameTR : mm;
  return `${parseInt(dd, 10)} ${monthName} ${yyyy}`;
};

watch(() => props.show, (visible) => {
  if (visible) {
    nextTick(() => {
      setTimeout(() => {
        if (todayCardRef.value) {
          todayCardRef.value.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 300);
    });
  }
});
</script>

<template>
  <transition name="drawer">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-end justify-center"
      @click.self="emit('close')"
    >
      <div class="drawer-backdrop" @click="emit('close')"></div>

      <div class="drawer-content">
        <div class="drawer-handle" @click="emit('close')">
          <div class="w-10 h-1 rounded-full bg-primary/30 mx-auto"></div>
        </div>

        <h3 class="text-lg font-semibold text-center mb-3">İmsakiye</h3>

        <div class="flex flex-col gap-3 px-4 pb-6 overflow-y-auto flex-1">
          <div
            v-for="day in monthlyTimes"
            :key="day.MiladiTarihKisa"
            :ref="el => { if (day.MiladiTarihKisa === todayStr) todayCardRef = el }"
            class="imsakiye-card"
            :class="{
              'imsakiye-card--today': getDayStatus(day.MiladiTarihKisa) === 'today',
              'imsakiye-card--past': getDayStatus(day.MiladiTarihKisa) === 'past',
            }"
          >
            <div class="flex justify-between items-center text-sm opacity-75">
              <span>{{ formatGregorianDate(day.MiladiTarihKisa) }}</span>
              <span class="font-medium">{{ formatDayName(day.MiladiTarihKisa) }}</span>
              <span>{{ formatHijriDate(day.HicriTarihKisa) }}</span>
            </div>

            <div class="flex items-center justify-between mt-2 pt-2">
              <div class="text-xl font-bold flex items-center gap-1.5">
                <i class="bi bi-moon-stars-fill text-base opacity-60"></i>
                <span class="text-xs font-normal opacity-60">İmsak</span>
                {{ day.Imsak }}
              </div>
              <div class="text-xl font-bold flex items-center gap-1.5">
                {{ day.Aksam }}
                <span class="text-xs font-normal opacity-60">Akşam</span>
                <i class="bi bi-moon-fill text-base opacity-60"></i>
              </div>
            </div>

            <div
              class="flex justify-between text-xs opacity-50
                border-t border-primary/10 mt-2 pt-2"
            >
              <span class="flex items-center gap-1">
                <i class="bi bi-sunrise-fill"></i>
                Güneş {{ day.Gunes }}
              </span>
              <span class="flex items-center gap-1">
                <i class="bi bi-sun-fill"></i>
                Öğle {{ day.Ogle }}
              </span>
              <span class="flex items-center gap-1">
                <i class="bi bi-sunset-fill"></i>
                İkindi {{ day.Ikindi }}
              </span>
              <span class="flex items-center gap-1">
                <i class="bi bi-stars"></i>
                Yatsı {{ day.Yatsi }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.drawer-backdrop {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm;
}

.drawer-content {
  @apply relative z-10 w-full max-w-lg lg:max-w-xl bg-base-100 rounded-t-2xl
    flex flex-col max-h-[85vh];
}

.drawer-handle {
  @apply py-3 cursor-pointer;
}

.imsakiye-card {
  @apply rounded-lg p-3 bg-base-200/50 border border-primary/10
    transition-all duration-200;
}

.imsakiye-card--today {
  @apply ring-1 ring-primary bg-base-200 shadow-lg;
}

.imsakiye-card--past {
  @apply opacity-40;
}

.drawer-enter-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-active .drawer-content {
  transition: transform 0.3s ease;
}
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-leave-active .drawer-content {
  transition: transform 0.3s ease;
}
.drawer-enter-from {
  opacity: 0;
}
.drawer-enter-from .drawer-content {
  transform: translateY(100%);
}
.drawer-leave-to {
  opacity: 0;
}
.drawer-leave-to .drawer-content {
  transform: translateY(100%);
}
</style>
