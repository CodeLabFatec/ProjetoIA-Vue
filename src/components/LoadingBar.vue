<script lang="ts">
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<template>
  <div class="loading-bar">
    <v-progress-linear v-if="visible" indeterminate color="#004488"></v-progress-linear>
  </div>
</template>

<style scoped>
.loading-bar {
  position: absolute;
  width: 100%;
  top: 74px;
  left: 0;
}
</style>