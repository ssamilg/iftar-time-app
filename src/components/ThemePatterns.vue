<script setup>
import { computed } from 'vue';

const props = defineProps({
  theme: {
    type: String,
    required: true
  }
});

const isVisible = computed(() => {
  return ['islamic', 'ottoman', 'seljuk', 'dark', 'light', 'dune', 'andalus'].includes(props.theme);
});
</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-500">
    <transition name="theme-transition" mode="out-in">
      <!-- Islamic Theme Patterns -->
      <div v-if="theme === 'islamic'" class="islamic-patterns" key="islamic">
        <div class="main-content">
          <div class="pattern-container">
            <div class="rub-el-hizb-grid"></div>
          </div>
        </div>
      </div>

      <!-- Ottoman Theme Patterns -->
      <div v-else-if="theme === 'ottoman'" class="ottoman-patterns" key="ottoman">
        <div class="main-content">
          <!-- Center Calligraphy -->
          <div class="center-calligraphy">
            <!-- <img src="@/assets/images/vav-elif.png" class="hat-calligraphy"> -->
            <img src="@/assets/images/vav-elif.png" class="hat-calligraphy">
          </div>

          <!-- Decorative Border -->
          <div class="decorative-border"></div>
        </div>
      </div>

      <!-- Seljuk Theme Patterns -->
      <div v-else-if="theme === 'seljuk'" class="seljuk-patterns" key="seljuk">
        <div class="main-content">
          <div class="pattern-container">
            <div class="star-grid"></div>
            <!-- <img src="@/assets/images/seljuk_eagle_alt.svg" class="absolute bottom-10 right-1/2 translate-x-1/2  max-w-80 lg:max-w-96 opacity-20"> -->
            <img src="@/assets/images/seljuk_eagle.svg" class="absolute bottom-10 right-1/2 translate-x-1/2  max-w-80 lg:max-w-96 opacity-20">
          </div>
        </div>
      </div>

      <!-- Dune Theme Patterns -->
      <div v-else-if="theme === 'dune'" class="dune-patterns" key="dune">
        <div class="main-content">
          <div class="pattern-container">
            <div class="sand-ripples"></div>
            <div class="spice-dust"></div>
          </div>
        </div>
      </div>

      <!-- Andalus Theme Patterns -->
      <div v-else-if="theme === 'andalus'" class="andalus-patterns" key="andalus">
        <div class="main-content">
          <div class="pattern-container">
            <div class="sebka-lattice"></div>
            <div class="arch-pattern"></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.theme-transition-enter-active,
.theme-transition-leave-active {
  transition: opacity 0.5s ease;
}

.theme-transition-enter-from,
.theme-transition-leave-to {
  opacity: 0;
}

// Islamic Theme
.islamic-patterns {
  @apply transition-opacity duration-500;
  .main-content {
    @apply fixed inset-0 flex items-center justify-center;
  }

  .pattern-container {
    @apply relative;
    width: 100%;
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
  }

  .rub-el-hizb-grid {
    @apply absolute inset-0;
    background-image: url('@/assets/images/Rub_El_Hizb.svg');
    background-size: 60px 60px;
    background-repeat: repeat;
    opacity: 0.15;
    mask-image: linear-gradient(
      to right,
      transparent,
      black 50%,
      black 60%,
      transparent
    );
  }

  .minaret {
    @apply absolute bottom-0 h-[500px] w-auto opacity-20;

    &.left {
      left: 5%;
    }

    &.right {
      right: 5%;
      transform: scaleX(-1);
    }
  }
}

// Ottoman Theme
.ottoman-patterns {
  @apply transition-opacity duration-500;
  .center-calligraphy {
    @apply absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-1/2;

    .hat-calligraphy {
      @apply opacity-10;
      width: 200px;
      height: auto;
    }
  }

  .side-elements {
    @apply absolute inset-0;

    .vav-left {
      @apply absolute opacity-10;
      width: 200px;
      height: auto;
      left: 10%;
      top: 50%;
      transform: translateY(-50%);
    }

    .vav-right {
      @apply absolute opacity-10;
      width: 200px;
      height: auto;
      right: 10%;
      top: 50%;
      transform: translateY(-50%) scaleX(-1);
    }
  }

  .decorative-border {
    @apply absolute bottom-0 left-0 right-0 h-[100px];
    background-image: repeating-linear-gradient(
      45deg,
      theme('colors.primary'),
      theme('colors.primary') 2px,
      transparent 2px,
      transparent 10px
    );
    opacity: 0.1;
    mask-image: linear-gradient(
      to top,
      black,
      transparent
    );
  }
}

// Seljuk Theme
.seljuk-patterns {
  @apply transition-opacity duration-500;
  .main-content {
    @apply fixed inset-0 flex items-center justify-center;
  }

  .pattern-container {
    @apply relative;
    width: 100%;
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
  }

  .star-grid {
    @apply absolute inset-0;
    background-image: url('@/assets/images/seljuk-star.svg');
    background-size: 80px 80px;
    background-repeat: repeat;
    opacity: 0.10;
    filter: invert(1) brightness(100);
    mask-image: linear-gradient(
      to right,
      transparent,
      black 30%,
      black 70%,
      transparent
    );
  }

  .border-pattern {
    @apply fixed inset-x-0 h-40;

    &.top {
      @apply top-0;
      background-image: linear-gradient(to bottom, theme('colors.primary'), transparent);
      opacity: 0.05;
      mask-image: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 20px,
        black 20px,
        black 40px
      );
    }

    &.bottom {
      @apply bottom-0;
      background-image: linear-gradient(to top, theme('colors.primary'), transparent);
      opacity: 0.05;
      mask-image: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 20px,
        black 20px,
        black 40px
      );
    }
  }

  .side-pattern {
    @apply fixed top-0 bottom-0 w-40;

    &.left {
      @apply left-0;
      background-image: linear-gradient(to right, theme('colors.primary'), transparent);
      opacity: 0.05;
      mask-image: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 20px,
        black 20px,
        black 40px
      );
    }

    &.right {
      @apply right-0;
      background-image: linear-gradient(to left, theme('colors.primary'), transparent);
      opacity: 0.05;
      mask-image: repeating-linear-gradient(
        90deg,
        transparent,
        transparent 20px,
        black 20px,
        black 40px
      );
    }
  }
}

// Dune Theme
.dune-patterns {
  @apply transition-opacity duration-500;
  .main-content {
    @apply fixed inset-0 flex items-center justify-center;
  }

  .pattern-container {
    @apply relative;
    width: 100%;
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
  }

  .sand-ripples {
    @apply absolute inset-0;
    background-image: repeating-linear-gradient(
      45deg,
      theme('colors.primary'),
      theme('colors.primary') 1px,
      transparent 1px,
      transparent 20px
    );
    opacity: 0.1;
    mask-image: linear-gradient(
      to right,
      transparent,
      black 30%,
      black 70%,
      transparent
    );
  }

  .spice-dust {
    @apply absolute inset-0;
    background-image: radial-gradient(
      circle,
      #C4661F 1px,
      transparent 1px
    );
    background-size: 30px 30px;
    opacity: 0.15;
    animation: float 60s infinite linear;
  }

  @keyframes float {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 100px 100px;
    }
  }
}

// Andalus Theme
.andalus-patterns {
  @apply transition-opacity duration-500;
  .main-content {
    @apply fixed inset-0;
  }
  .pattern-container {
    @apply relative;
    width: 100%;
    height: 100%;
  }
  .sebka-lattice {
    @apply absolute inset-0;
    background-image:
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 29px,
        rgba(114, 47, 55, 0.06) 29px,
        rgba(114, 47, 55, 0.06) 30px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 29px,
        rgba(114, 47, 55, 0.06) 29px,
        rgba(114, 47, 55, 0.06) 30px
      );
    mask-image: radial-gradient(
      ellipse at center,
      black 20%,
      transparent 70%
    );
  }
  .arch-pattern {
    @apply absolute inset-0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='80' viewBox='0 0 60 80'%3E%3Cline x1='0' y1='79.5' x2='60' y2='79.5' stroke='%23722F37' stroke-width='0.5'/%3E%3Cpath d='M 4 80 V 36 C 4 10 56 10 56 36 V 80' fill='none' stroke='%23722F37' stroke-width='1.5'/%3E%3C/svg%3E");
    background-size: 60px 80px;
    background-repeat: repeat;
    opacity: 0.12;
    mask-image: radial-gradient(
      ellipse at center,
      black 20%,
      transparent 75%
    );
  }
}
</style>
