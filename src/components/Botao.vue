<script lang="ts">
import type { PropType } from "vue";

export default {
  props: {
    content: {
      type: String,
      required: true,
    },
    color: {
      type: String as PropType<"primary" | "secondary">,
      default: "primary"
    },
    size: {
      type: String as PropType<"normal" | "large">,
      default: "normal"
    },
  }
}
</script>

<template>
  <button 
    :class="[
      'btn', 
      {
        primary: color == 'primary', 
        secondary: color == 'secondary'
      },
      {
        large: size == 'large'
      }
    ]"
  >
    {{ content }}
  </button>
</template>

<style scoped>
.btn {
  font-weight: bold;
  color: var(--white);
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s;
}

.primary {
  background-color: var(--dark-blue);
  min-width: 120px;
}

.primary:hover {
  background-color: var(--blue);
}

.secondary {
  background-color: var(--light-gray);
  min-width: 120px;
}

.secondary:hover {
  background-color: var(--light-gray-100);
}

.large {
  padding: 18px 12px;
}
</style>