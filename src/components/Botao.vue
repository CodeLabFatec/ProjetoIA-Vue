<script lang="ts">
import type { PropType } from "vue";

export default {
  props: {
    content: {
      type: String,
      required: true,
    },
    color: {
      type: String as PropType<"primary" | "secondary" | "alert">,
      default: "primary"
    },
    size: {
      type: String as PropType<"normal" | "large">,
      default: "normal"
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  }
}
</script>

<template>
  <button 
    :disabled="disabled"
    :class="[
      'btn', 
      {
        primary: color == 'primary', 
        secondary: color == 'secondary',
        alert: color == 'alert'
      },
      {
        large: size == 'large'
      },
      {
        disabled
      }
    ]"
  >
    {{ content }}
  </button>
</template>

<style scoped>
.btn {
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s;
  color: var(--white);
}

.primary {
  background-color: var(--dark-blue);
  min-width: 120px;
}

.primary:hover {
  background-color: var(--blue);
}

.primary.disabled {
  background-color: var(--gray-blue);
  color: var(--light-gray-100);
}

.primary.disabled:hover {
  background-color: var(--gray-blue);
}

.alert {
  background-color: var(--red);
  min-width: 120px;
}

.alert:hover {
  background-color: var(--light-red);
}

.alert.disabled {
  background-color: var(--red-gray);
  color: rgb(219, 219, 219)
}

.alert.disabled:hover {
  background-color: var(--red-gray);
}

.secondary {
  background-color: var(--light-gray);
  min-width: 120px;
}

.secondary:hover {
  background-color: var(--light-gray-100);
}
.secondary.disabled {
  background-color: var(--light-gray);
  color: var(--light-gray-100);
}

.secondary.disabled:hover {
  background-color: var(--light-gray);
}

.large {
  padding: 18px 12px;
}

.disabled {
  cursor: default;
}
</style>