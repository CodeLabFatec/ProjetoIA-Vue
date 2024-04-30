<script lang="ts">
import type { PropType } from 'vue';
import type IDiaPessoas from '@/interfaces/IDiaPessoas'

export default {
  props: {
    graphic_data: {
      type: Object as PropType<IDiaPessoas[]>
    }
  },
  data: () => {
    return {
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: true
        },
        yaxis: {
          title: {
            text: 'Quantidade de pessoas'
          }
        },
        xaxis: {
          title: {
            text: 'Dias'
          }
        },
        fill: {
          opacity: 1
        },
      }
    }
  }
}
</script>

<template>
  <apexchart v-if="$props.graphic_data" type="bar" height="350" :options="{
    ...chartOptions,
    xaxis: {
      ...chartOptions.xaxis,
      categories: $props.graphic_data?.sort((a, b) => {
        const data_a = new Date(a.data);
        const data_b = new Date(b.data);

        return data_a.getTime() - data_b.getTime();
      }).map(item => new Date(item.data).toLocaleDateString('pt-BR')),
    },
  }" :series="[{
    name: 'Pessoas',
    data: $props.graphic_data?.map(item => item.valor)
  }]"></apexchart>
  <div v-else class="grafico-vazio">
    Erro ao carregar dados
  </div>
</template>

<style scoped>
.grafico-vazio {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 350px;
  color: var(--light-gray);
}
</style>