<script setup lang="ts">
import Titulo from '@/components/Titulo.vue';
import Botao from '@/components/Botao.vue';

import Relatorio from '@/services/Relatorio';

const getRelatorio = (reportType: "7-days" | "14-days") => {
  switch(reportType) {
    case '7-days':
      Relatorio.getRelatorio7Dias()
      .then(res => {
        console.log('foi')
      })
      .catch(err => console.log(err));
      break;
    case '14-days':
      Relatorio.getRelatorio14Dias()
      .then(res => {
        console.log('foi')
      })
      .catch(err => console.log(err));
      break;
  }
}
</script>

<template>
  <main class='main'>
    <Titulo content="Relatórios" />
    <div class="fields-container">
      <Botao @click="getRelatorio('7-days')" class="btn" content="Últimos 7 dias" />
      <Botao @click="getRelatorio('14-days')" class="btn" content="Últimos 14 dias" />
    </div>
  </main>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  gap: 24px
}

.fields-container {
  display: flex;
  justify-content: center;
  gap: 12px
}
</style>