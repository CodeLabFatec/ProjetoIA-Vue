<script setup lang="ts">
import Titulo from '@/components/Titulo.vue';
import Botao from '@/components/Botao.vue';

const submit = () => {
  console.log('submit')
}
</script>

<template>
  <main class='main'>
    <Titulo content="Relatórios" />
    <div class="fields-container">

    </div>
    <div class="btn-container">
      <Botao @click="submit" class="btn" content="Download Relatório" />
    </div>
  </main>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  gap: 24px
}

.btn-container {
  display: flex;
  justify-content: center;
}

.btn {
  padding-inline: 52px;
}
</style>