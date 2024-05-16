<script lang="ts">
import type { PropType } from 'vue';
import type { IDiaPessoas } from '@/interfaces/IDiaPessoas'
import type IRedzone from '@/interfaces/IRedzone';
import type IArea from '@/interfaces/IArea';

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
    mode: {
      type: String as PropType<"total" | "byRedzone" | "byArea">,
      default: "total",
    }
  },
  data: () => {
    return {
      chartOptions: {
        chart: {
          type: 'bar',
          stacked: true,
          toolbar: {
            show: false,
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
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
  },
  methods: {
    groupByRedzone() {
      const redzones = Object.values((this.$props.graphic_data as any[]).reduce((total, current) => {
        current.valor.forEach((item: any) => {
          const redzone = item.redZone;
          total[redzone.id] = redzone;
        });
        return total;
      }, {})) as IRedzone[];

      // retornar {name: redzone, data: number[]}
      return redzones.map(redzone => ({
        name: redzone.nome,
        data: this.$props.graphic_data?.map(item => {
          return item.valor.filter(register => register.redZone.id == redzone.id).length;
        })
      }))
    },
    groupByArea() {
      const areas = Object.values((this.$props.graphic_data as any[]).reduce((total, current) => {
        current.valor.forEach((item: any) => {
          const area = item.redZone.area;
          total[area.id] = area;
        });
        return total;
      }, {})) as IArea[];

      return areas.map(area => ({
        name: area.nome,
        data: this.$props.graphic_data?.map(item => {
          return item.valor.filter(register => register.redZone.area.id == area.id).length;
        })
      }))
    },
  }
}
</script>

<template>
  <apexchart v-if="$props.graphic_data" type="bar" height="320" :options="{
    ...chartOptions,
    plotOptions: {
      bar: {
        ...chartOptions.plotOptions.bar,
        dataLabels: {
          total: {
            enabled: $props.mode !== 'total'
          }
        }
      }

    },
    xaxis: {
      ...chartOptions.xaxis,
      categories: $props.graphic_data?.sort((a, b) => {
        const data_a = new Date(a.data);
        const data_b = new Date(b.data);

        return data_a.getTime() - data_b.getTime();
      }).map(item => {
        const [year, month, day] = item.data.split('-');
        return `${day}/${month}/${year}`;
      }),
    },
  }" :series="$props.mode == 'total' ?
    [{
      name: 'Pessoas',
      data: $props.graphic_data?.map(item => item.valor.length)
    }] : (
      $props.mode == 'byArea' ? groupByArea() : groupByRedzone()
    )"></apexchart>
  <div v-if="$props.loading" class="grafico-loading">
    <v-progress-circular indeterminate color="#004488"></v-progress-circular>
  </div>
  <div v-if="!$props.graphic_data && !$props.loading" class="grafico-vazio">
    Erro ao carregar dados
  </div>
</template>

<style scoped>
.grafico-vazio,
.grafico-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 350px;
}

.grafico-vazio {
  color: var(--light-gray);
}
</style>