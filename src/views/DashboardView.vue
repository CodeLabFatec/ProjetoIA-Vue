<script setup lang="ts">
import { onMounted, ref } from 'vue';

import GraficoPessoasDia from '@/components/GraficoPessoasDia.vue'
import Titulo from '@/components/Titulo.vue';
import Indicador from '@/components/Indicador.vue';
import LoadingBar from '@/components/LoadingBar.vue';

import Dashboard from '@/services/Dashboard';

import type IDashboardResponse from "@/interfaces/IDashboardResponse";
import type IRedzone from '@/interfaces/IRedzone';
import Redzone from '@/services/Redzone';

const state = ref({
  graphic_data: {} as IDashboardResponse,
  redzones: [] as IRedzone[],
  selectedRedzone: '',
  loading: false,
  error: false,
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

const getDashboard = () => {
  state.value.loading = true;
  Dashboard.getDashboard(state.value.selectedRedzone ? Number(state.value.selectedRedzone.split('-')[0]) : undefined)
  .then(res => {
    if (res.data && res.status == 200) {
      state.value.graphic_data = res.data
    } else {
      state.value.error = true;
      console.log(res);
    }
    state.value.loading = false;
  })
  .catch(err => {
    console.log(err);
    state.value.error = true;
    state.value.loading = false;
  })
}

onMounted(() => {
  getDashboard();

  state.value.loading = true;
  Redzone.getRedzones()
  .then(res => {
    if (res.status == 200) {
      state.value.redzones = res.data;
    } else {
      state.value.error = true;
      console.log(res);
    }
    state.value.loading = false;
  })
  .catch(err => {
    console.log(err);
    state.value.error = true;
    state.value.loading = false;
  });
});

</script>

<template>
  <LoadingBar :visible="state.loading" />
  <v-snackbar color="red" v-model="state.error">
    Um erro interno aconteceu. Tente novamente mais tarde.
  </v-snackbar>
  <main class="dashboard-main">
    <Titulo content="Dashboard" />
    <div class="dashboard-content">
      <div class="dashboard-filters">
        <v-combobox
          label="Redzone"
          variant="underlined"
          :items="state.redzones.map(redzone => `${redzone.id} - ${redzone.nome}`)"
          v-model="state.selectedRedzone"
          @update:model-value="getDashboard"
        ></v-combobox>
      </div>
      <div class="dashboard-content-row">
        <div class="dashboard-graphic">
          <h1 class="dashboard-title">
            Quantidade de pessoas por dia (últimos 7 dias)
          </h1>
          <GraficoPessoasDia :loading="state.loading" :graphic_data="state.graphic_data?.grafico" />
        </div>
        <div class="dashboard-indicators">
          <h1 class="dashboard-title">
            Indicadores
          </h1>
          <Indicador title="Número total de pessoas em redzone" subtitle="Neste momento" :value="`${
            state.graphic_data?.indicadores?.total_pessoas !== undefined ? 
            state.graphic_data?.indicadores?.total_pessoas
             : '-'}`" />
          <Indicador title="Número total de entradas" subtitle="Desde o início" :value="`${
            state.graphic_data?.indicadores?.total_entradas !== undefined ? 
            state.graphic_data?.indicadores?.total_entradas
            : '-'}`" />
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
}

.dashboard-filters {
  width: 240px;
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