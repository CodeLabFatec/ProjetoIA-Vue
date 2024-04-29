<script setup lang="ts">
import { onMounted, ref } from 'vue';

import GraficoPessoasDia from '@/components/GraficoPessoasDia.vue'
import Titulo from '@/components/Titulo.vue';
import Indicador from '@/components/Indicador.vue';

import Dashboard from '@/services/Dashboard';

import type IDashboardResponse from "@/interfaces/IDashboardResponse";

const state = ref({
  graphic_data: {} as IDashboardResponse
});

const headers = [
  {
    key: 'data',
    title: 'Data/Horário',
  },
  {
    key: 'tipo',
    title: 'Entrada/Saída',
  },
  {
    key: 'redzone',
    title: 'Redzone',
  },
]

onMounted(() => {
  Dashboard.getDashboard()
    .then(res => {
      if (res.data) {
        state.value.graphic_data = res.data
      }
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
});

</script>

<template>
  <main class="dashboard-main">
    <Titulo content="Dashboard" />
    <div class="dashboard-content">
      <div class="dashboard-content-row">
        <div class="dashboard-graphic">
          <h1 class="dashboard-title">
            Quantidade de pessoas por dia (últimos 7 dias)
          </h1>
          <GraficoPessoasDia :graphic_data="state.graphic_data?.grafico" />
        </div>
        <div class="dashboard-indicators">
          <h1 class="dashboard-title">
            Indicadores
          </h1>
          <Indicador title="Número total de pessoas em redzone" subtitle="Neste momento" :value="`${state.graphic_data?.indicadores?.total_pessoas}`" />
          <Indicador title="Número total de entradas" subtitle="Desde o início" :value="`${state.graphic_data?.indicadores?.total_entradas}`" />
        </div>
      </div>
      <div class="dashboard-content-row">
        <div class="dashboard-table">
          <h1 class="dashboard-title">
            Registros de entradas e saídas
          </h1>
          <v-data-table :headers="headers" :items="state.graphic_data?.tabela">
            <template v-slot:item.data="{ item }">
              
                {{ new Date(item.data).toLocaleDateString('pt-BR') }}
              
            </template>
            <template v-slot:item.tipo="{ item }">
              {{ item.tipo == 'entrada' ? 'Entrada' : 'Saída' }}
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.dashboard-content {
  margin: 12px auto;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dashboard-content-row {
  display: flex;
  flex-direction: row;
  gap: 24px;
  /* border: 1px solid red; */
}

.dashboard-graphic, .dashboard-table {
  flex: 1;
}

.dashboard-indicators {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: fit-content;
  align-items: center;
  align-self: flex-start;
  gap: 16px
}

.dashboard-title {
  font-size: 18px;
  text-align: center;
  margin-bottom: 12px;
}
</style>