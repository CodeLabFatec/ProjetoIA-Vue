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
    }
  }
}
</script>

<template>
  <div class="indicador-container">
    <h3 class="indicador-title">
      {{ $props.title }}
    </h3>
    <h4 v-if="$props.subtitle" class="indicador-subtitle">
      {{ $props.subtitle }}
    </h4>
    <span class="indicador-value">
      {{ $props.value }}
    </span>
  </div>
</template>

<style scoped>
.indicador-container {
  background-color: var(--blue);
  border-radius: 12px;
  padding: 14px;
  color: white;
  width: 220px;
}

.indicador-container h3, .indicador-container h4 {
  padding: 0;
  margin: 0;
}

.indicador-container h3 {
  line-height: 18px;
}

.indicador-container h4 {
  font-weight: normal;
}

.indicador-value {
  font-weight: bold;
  font-size: 36px;
}
</style>