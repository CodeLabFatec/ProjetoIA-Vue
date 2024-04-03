<script lang="ts">
export default {
  props: {
    content: {
      type: String,
      required: true,
    },
  },
}
</script>

<template>
  <h1 class="titulo">
    {{ content }}
  </h1>
</template>

<style scoped>
.titulo {
  text-align: center;
  padding: 18px 64px;
  border-bottom: 2px dotted black;
  margin: 32px auto;
  width: fit-content;
}
</style>