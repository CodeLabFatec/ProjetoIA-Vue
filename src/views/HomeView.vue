<script setup lang="ts">
import { ref } from 'vue';

import Titulo from '@/components/Titulo.vue';
import Botao from '@/components/Botao.vue';

import Relatorio from '@/services/Relatorio';

const state = ref({
  error: false,
  success: false,
})

const getRelatorio = (reportType: "7-days" | "14-days") => {
  state.value.error = false;
  state.value.success = false;
  Relatorio.getRelatorio(reportType)
    .then(res => {
      if (res.status !== 200) {
        state.value.error = true;
      } else {
        state.value.success = true;
      }
    })
    .catch(err => {
      console.log(err);
      state.value.error = true;
    });
}
</script>

<template>
  <main class='main'>
    <Titulo content="Relatórios" />
    <div class="fields-container">
      <Botao @click="getRelatorio('7-days')" class="btn" content="Últimos 7 dias" />
      <Botao @click="getRelatorio('14-days')" class="btn" content="Últimos 14 dias" />
    </div>
    <div v-if="state.error" class="error-warning">Erro ao gerar relatório, tente novamente mais tarde.</div>
    <div v-if="state.success" class="success-warning">Relatório gerado com sucesso!</div>
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

.error-warning, .success-warning {
  margin: auto;
  font-weight: bold;
}

.error-warning {
  color: red;
}

.success-warning {
  color: green;
}
</style>