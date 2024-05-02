<script lang="ts">
import type { PropType } from 'vue';
import type IDiaPessoas from '@/interfaces/IDiaPessoas'

export default {
  props: {
    graphic_data: {
      type: Object as PropType<IDiaPessoas[]>
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      chartOptions: {
        chart: {
          type: 'bar',
          toolbar: {
            show: false,
          }
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
  <apexchart v-if="$props.graphic_data" type="bar" height="320" :options="{
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
  <div v-if="$props.loading" class="grafico-loading">
    <v-progress-circular indeterminate color="#004488"></v-progress-circular>
  </div>
  <div v-if="!$props.graphic_data && !$props.loading" class="grafico-vazio">
    Erro ao carregar dados
  </div>
</template>

<style scoped>
.grafico-vazio, .grafico-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 350px;
}

.grafico-vazio {
  color: var(--light-gray);
}
</style>