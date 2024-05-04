<script lang="ts">
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
    value: {
      type: String,
      required: true,
    },
    subtitle_printeable: {
      type: String,
      required: false,
    }
  }
}
</script>

<template>
  <div :class="['indicador-container', $props.class]">
    <h3 class="indicador-title">
      {{ $props.title }}
    </h3>
    <span class="indicador-value">
      {{ $props.value }}
    </span>
    <h4 v-if="$props.subtitle" class="indicador-subtitle">
      {{ $props.subtitle }}
    </h4>
    <h4 v-if="$props.subtitle_printeable || $props.subtitle" class="indicador-subtitle-printeable">
      {{ $props.subtitle_printeable || $props.subtitle }}
    </h4>
  </div>
</template>

<style scoped>
.indicador-subtitle-printeable {
  display: none;
}

.indicador-container {
  background-color: var(--blue);
  border-radius: 12px;
  padding: 14px;
  color: white;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.indicador-container h3,
.indicador-container h4 {
  padding: 0;
  margin: 0;
  text-align: center;
}

.indicador-container h3 {
  line-height: 18px;
  font-size: 18px;
}

.indicador-container h4 {
  font-weight: normal;
  font-size: 14px;
}

.indicador-value {
  font-weight: bold;
  font-size: 28px;
}

@media print {
  .indicador-subtitle {
    display: none;
  }

  .indicador-title,
  .indicador-subtitle-printeable {
    color: black;
  }

  .indicador-value {
    color: var(--blue);
  }

  .indicador-subtitle-printeable {
    display: block;
  }
}
</style>