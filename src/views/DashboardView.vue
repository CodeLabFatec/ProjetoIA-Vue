<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

import GraficoPessoasDia from "@/components/GraficoPessoasDia.vue";
import Titulo from "@/components/Titulo.vue";
import Indicador from "@/components/Indicador.vue";
import LoadingBar from "@/components/LoadingBar.vue";
import SeletorData from "@/components/SeletorData.vue";

import Dashboard from "@/services/Dashboard";
import Redzone from "@/services/Redzone";
import Relatorio from "@/services/Relatorio";
import Area from "@/services/Area";

import type IDashboardResponse from "@/interfaces/IDashboardResponse";
import type IRedzone from "@/interfaces/IRedzone";
import type IArea from "@/interfaces/IArea";

import { usuarioStore } from "@/stores/usuarioStore";

const { usuario } = usuarioStore();

const state = ref({
  graphic_data: {} as IDashboardResponse,
  redzones: [] as IRedzone[],
  areas: [] as IArea[],
  redzonesSelector: [] as string[],
  areasSelector: [] as string[],
  selectedDates: [] as string[] | undefined,
  selectedRedzone: "Todos",
  selectedArea: "Todos",
  loading: false,
  error: false,
  errorExport: false,
  errorRefresh: false,
  errorRefreshSnack: false,
  successExport: false,
  loadingExportTable: false,
  loadingExportGraphic: false,
  refresh: true,
});

const headers = [
  {
    key: "data",
    title: "Data/Horário",
  },
  {
    key: "tipo",
    title: "Entrada/Saída",
  },
  {
    key: "redzone",
    title: "Redzone",
  },
];

const updateSelector = (
  list: "areasSelector" | "redzonesSelector",
  items: IRedzone[] | IArea[]
) => {
  state.value[list] = [
    "Todos",
    ...items.map((item) => `${item.id} - ${item.nome}`),
  ];
};

watch(
  () => [state.value.areas, state.value.redzones],
  (newValue) => {
    const [newAreas, newRedzones] = newValue;

    updateSelector("areasSelector", newAreas);
    updateSelector("redzonesSelector", newRedzones);
  }
);

watch(
  () => [state.value.refresh],
  (newValue) => {
    setTimeout(() => {
      if (state.value.refresh) {
        if (!state.value.selectedDates?.length && !state.value.errorRefresh)
          refreshDashboard();
        state.value.refresh = false;
      } else {
        state.value.refresh = true;
      }
    }, 5000);
  }
);

const refreshDashboard = () => {
  Dashboard.refreshDashboard({
    redzone:
      state.value.selectedRedzone !== "Todos"
        ? Number(state.value.selectedRedzone.split("-")[0])
        : undefined,
    area:
      state.value.selectedArea !== "Todos"
        ? Number(state.value.selectedArea.split("-")[0])
        : undefined,
  })
    .then((res) => {
      if (res.status !== 200) {
        state.value.errorRefresh = true;
        state.value.errorRefreshSnack = true;
        return;
      }

      if (!(res.data.entradas.length || res.data.saidas.length)) {
        return;
      }

      const { entradas, saidas } = res.data;

      // infos para tabela
      const registros_pre = [
        ...entradas.map((item) => ({ ...item, tipo: "entrada" })),
        ...saidas.map((item) => ({ ...item, tipo: "saida" })),
      ].sort((a, b) => {
        let data_a = new Date(a.data);
        let data_b = new Date(b.data);

        return data_b.getTime() - data_a.getTime();
      });

      const registros_all = [
        ...registros_pre,
        ...state.value.graphic_data.tabela,
      ];

      // infos para gráfico
      const info_grafico_old = state.value.graphic_data.grafico;

      const info_grafico = [
        ...info_grafico_old.slice(0, -1),
        {
          data: info_grafico_old[info_grafico_old.length - 1].data,
          valor: [
            ...entradas,
            ...info_grafico_old[info_grafico_old.length - 1].valor,
          ],
        },
      ];

      // infos para os indicadores
      const total_pessoas =
        state.value.graphic_data.indicadores.total_pessoas +
        (entradas.length - saidas.length);
      const total_entradas =
        state.value.graphic_data.indicadores.total_entradas + entradas.length;

      state.value.graphic_data = {
        grafico: info_grafico,
        indicadores: {
          total_entradas,
          total_pessoas,
        },
        tabela: registros_all,
      } as IDashboardResponse;
    })
    .catch((err) => {
      console.log(err);
    });
};

const getRedzones = (area_id?: number) => {
  state.value.loading = true;
  Redzone.getRedzones(area_id)
    .then((res) => {
      if (res.status == 200) {
        state.value.redzones = res.data;
      } else {
        state.value.error = true;
        console.log(res);
      }
      state.value.loading = false;
    })
    .catch((err) => {
      console.log(err);
      state.value.error = true;
      state.value.loading = false;
    });
};

const getAreas = () => {
  state.value.loading = true;
  Area.getAreas()
    .then((res) => {
      if (res.status == 200) {
        state.value.areas = res.data;
        state.value.loading = false;
      } else {
        console.log(res);
        state.value.error = true;
        state.value.loading = false;
      }
    })
    .catch((err) => {
      console.log(err);
      state.value.error = true;
      state.value.loading = false;
    });
};

const getDashboard = () => {
  state.value.loading = true;
  Dashboard.getDashboard(
    state.value.selectedRedzone !== "Todos"
      ? Number(state.value.selectedRedzone.split("-")[0])
      : undefined,
    state.value.selectedArea !== "Todos"
      ? Number(state.value.selectedArea.split("-")[0])
      : undefined,
    state.value.selectedDates?.length
      ? state.value.selectedDates.length > 1
        ? state.value.selectedDates.map((item) => new Date(item))
        : new Date(state.value.selectedDates[0])
      : undefined
  )
    .then((res) => {
      if (res.data && res.status == 200) {
        state.value.graphic_data = res.data;
      } else {
        state.value.error = true;
        console.log(res);
      }
      state.value.loading = false;
    })
    .catch((err) => {
      console.log(err);
      state.value.error = true;
      state.value.loading = false;
    });
};

const handleRedzoneSelector = () => {
  getDashboard();
};

const handleAreaSelector = () => {
  if (state.value.selectedArea !== "Todos") {
    getRedzones(Number(state.value.selectedArea.split("-")[0]));
    state.value.selectedRedzone = "Todos";
  } else {
    getRedzones();
  }
  getDashboard();
};

const handleDateSelector = (value: Date | Date[]) => {
  if (Array.isArray(value)) {
    state.value.selectedDates = value.map(
      (item) => `${item.getFullYear()}-${item.getMonth() + 1}-${item.getDate()}`
    );
  } else {
    state.value.selectedDates = [
      `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`,
    ];
  }
  getDashboard();
};

const handleClearDate = () => {
  state.value.selectedDates = [];
  getDashboard();
};

const exportContent = (source: "table" | "graphic") => {
  if (source == "table") state.value.loadingExportTable = true;
  if (source == "graphic") state.value.loadingExportGraphic = true;
  state.value.errorExport = false;
  Relatorio.getRelatorio(
    source == "table" ? "all" : "7-days",
    state.value.selectedRedzone !== "Todos"
      ? Number(state.value.selectedRedzone.split("-")[0])
      : undefined
  )
    .then((res) => {
      if (res.status !== 200) {
        state.value.errorExport = true;
      } else {
        state.value.successExport = true;
      }
      if (source == "table") state.value.loadingExportTable = false;
      if (source == "graphic") state.value.loadingExportGraphic = false;
    })
    .catch((err) => {
      console.log(err);
      state.value.errorExport = true;
      if (source == "table") state.value.loadingExportTable = false;
      if (source == "graphic") state.value.loadingExportGraphic = false;
    });
};

const exportPdf = () => {
  window.print();
};

onMounted(() => {
  getDashboard();
  getRedzones();
  usuario?.idPapel || (4 < 3 && getAreas());

  state.value.refresh = false;
});
</script>

<template>
  <img class="dashboard-header-print" src="../assets/header-printeable.png" />
  <LoadingBar :visible="state.loading" />
  <v-snackbar
    class="dashboard-snackbar"
    color="red"
    v-model="state.errorRefreshSnack"
  >
    Erro ao atualizar Dashboard. Atualize a página (F5) ou tente novamente mais
    tarde.
  </v-snackbar>
  <v-snackbar class="dashboard-snackbar" color="red" v-model="state.error">
    Um erro interno aconteceu. Tente novamente mais tarde.
  </v-snackbar>
  <v-snackbar
    class="dashboard-snackbar"
    color="red"
    v-model="state.errorExport"
  >
    Erro ao baixar arquivo. Tente novamente mais tarde
  </v-snackbar>
  <v-snackbar
    class="dashboard-snackbar"
    color="green"
    v-model="state.successExport"
  >
    Exportado com sucesso! Baixando arquivo...
  </v-snackbar>
  <main class="dashboard-main">
    <div class="dashboard-header-printeable">
      <Titulo style="margin: auto" content="Relatório geral" />
      <div class="dashboard-header-printeable-subtitle">
        Relatório emitido em
        <b
          >{{ new Date().toLocaleDateString("pt-BR") }} às
          {{ new Date().toLocaleTimeString("pt-BR") }}</b
        >
      </div>
      <div class="dashboard-header-printeable-subtitle">
        Redzone:
        <b>{{
          state.selectedRedzone == "Todos"
            ? "Todos"
            : `${state.selectedRedzone.split("-")[1]} [ ID:
          ${state.selectedRedzone.split("-")[0]} ]`
        }}</b>
      </div>
      <div
        v-if="(usuario?.idPapel || 3) !== 3"
        class="dashboard-header-printeable-subtitle"
      >
        Área:
        <b>{{
          state.selectedArea == "Todos" && state.selectedRedzone == "Todos"
            ? "Todas"
            : state.selectedArea !== "Todos"
            ? `${state.selectedArea.split("-")[1]} [ ID: ${
                state.selectedArea.split("-")[0]
              } ]`
            : `${
                state.redzones.find(
                  (redzone) =>
                    Number(state.selectedRedzone.split("-")[0]) == redzone.id
                )?.area.nome
              } [ID: ${
                state.redzones.find(
                  (redzone) =>
                    Number(state.selectedRedzone.split("-")[0]) == redzone.id
                )?.area.id
              }]`
        }}</b>
      </div>
      <div
        v-if="
          state.selectedDates !== undefined && state.selectedDates.length == 1
        "
        class="dashboard-header-printeable-subtitle"
      >
        Data:
        <b>{{
          `${new Date(state.selectedDates[0]).toLocaleDateString("pt-BR")}`
        }}</b>
      </div>
      <div
        v-if="
          state.selectedDates !== undefined && state.selectedDates.length > 1
        "
        class="dashboard-header-printeable-subtitle"
      >
        Período:
        <b>{{
          `${new Date(state.selectedDates[0]).toLocaleDateString(
            "pt-BR"
          )} - ${new Date(state.selectedDates[1]).toLocaleDateString("pt-BR")}`
        }}</b>
      </div>
    </div>
    <div class="dashboard-header">
      <Titulo style="margin: 24px auto" content="Dashboard" />
    </div>
    <div class="dashboard-content">
      <div class="dashboard-filters">
        <div class="dashboard-selector-container">
          <div v-if="(usuario?.idPapel || 3) !== 3" class="dashboard-selector">
            <v-select
              color="#004488"
              label="Área"
              variant="underlined"
              :items="state.areasSelector"
              v-model="state.selectedArea"
              @update:model-value="handleAreaSelector"
            ></v-select>
          </div>
          <div class="dashboard-selector">
            <v-select
              color="#004488"
              label="Redzone"
              variant="underlined"
              :items="state.redzonesSelector"
              v-model="state.selectedRedzone"
              @update:model-value="handleRedzoneSelector"
            ></v-select>
          </div>
          <SeletorData
            label="Data/Período"
            :width="230"
            :value="
              state.selectedDates?.length == 1
                ? new Date(state.selectedDates[0])
                : state.selectedDates?.map((item) => new Date(item))
            "
            @on-change="handleDateSelector($event)"
            @on-clear="handleClearDate"
          />
        </div>
        <v-btn
          @click="exportPdf"
          variant="outlined"
          color="#004488"
          append-icon="mdi-download"
          >Baixar relatório completo</v-btn
        >
      </div>
      <div class="dashboard-content-row">
        <div class="dashboard-graphic">
          <v-tooltip
            bottom
            v-if="
              (!state.selectedDates || state.selectedDates.length == 0) &&
              state.selectedArea == 'Todos'
            "
          >
            <template v-slot:activator="{ props }">
              <v-btn
                class="dashboard-download-btn"
                icon="mdi-download"
                variant="text"
                color="#004488"
                v-bind="props"
                :loading="state.loadingExportGraphic"
                @click="exportContent('graphic')"
              ></v-btn>
            </template>
            <span>Baixar relatório últimos 7 dias em XLSX</span>
          </v-tooltip>
          <h1 class="dashboard-title">
            Quantidade de pessoas por dia
            {{
              !state.selectedDates || state.selectedDates.length == 0
                ? "(últimos 7 dias)"
                : ""
            }}
          </h1>
          <GraficoPessoasDia
            :mode="
              state.selectedRedzone !== 'Todos'
                ? 'total'
                : state.selectedArea == 'Todos'
                ? 'byArea'
                : 'byRedzone'
            "
            :loading="state.loading"
            :graphic_data="state.graphic_data?.grafico"
          />
        </div>
        <div class="dashboard-graphic-printeable-size"></div>
        <div class="dashboard-graphic-printeable">
          <h1 class="dashboard-title">
            Quantidade de pessoas por dia
            {{ !state.selectedDates ? "(últimos 7 dias)" : "" }}
          </h1>
          <GraficoPessoasDia
            :mode="
              state.selectedRedzone !== 'Todos'
                ? 'total'
                : state.selectedArea == 'Todos'
                ? 'byArea'
                : 'byRedzone'
            "
            :loading="state.loading"
            :graphic_data="state.graphic_data?.grafico"
          />
        </div>
        <h1 class="dashboard-title-printeable">Indicadores</h1>
        <div class="dashboard-indicators">
          <h1 class="dashboard-title">Indicadores</h1>
          <div class="dashboard-indicators-container">
            <Indicador
              class="dashboard-indicator"
              title="Pessoas em redzone"
              :subtitle="
                state.selectedDates?.length
                  ? 'Na data/período selecionado'
                  : 'Neste momento'
              "
              :subtitle_printeable="
                state.selectedDates?.length
                  ? 'Na data/período selecionado'
                  : 'No momento da emissão do relatório'
              "
              :value="`${
                !state.loading &&
                !state.error &&
                state.graphic_data?.tabela !== undefined
                  ? state.graphic_data?.tabela.filter(
                      (item) => item.tipo == 'entrada'
                    ).length -
                    state.graphic_data?.tabela.filter(
                      (item) => item.tipo == 'saida'
                    ).length
                  : '-'
              }`"
            />
            <Indicador
              class="dashboard-indicator"
              title="Total de entradas"
              :subtitle="
                state.selectedDates?.length
                  ? 'Na data/período selecionado'
                  : 'Desde o começo'
              "
              :subtitle_printeable="
                state.selectedDates?.length
                  ? 'Na data/período selecionado'
                  : 'Desde o começo até a emissão do relatório'
              "
              :value="`${
                !state.loading &&
                !state.error &&
                state.graphic_data?.tabela !== undefined
                  ? state.graphic_data?.tabela.filter(
                      (item) => item.tipo == 'entrada'
                    ).length
                  : '-'
              }`"
            />
          </div>
        </div>
      </div>
      <hr class="dashboard-hr" />
      <div style="margin-top: 12px" class="dashboard-content-row">
        <div class="dashboard-table">
          <v-tooltip bottom>
            <template v-slot:activator="{ props }">
              <v-btn
                class="dashboard-download-btn"
                icon="mdi-download"
                variant="text"
                color="#004488"
                v-bind="props"
                :loading="state.loadingExportTable"
                @click="exportContent('table')"
              ></v-btn>
            </template>
            <span>Baixar tabela em XLSX</span>
          </v-tooltip>
          <h1 class="dashboard-title">Registros de entradas e saídas</h1>
          <div class="dashboard-table-content">
            <v-data-table
              :headers="headers"
              :items="state.graphic_data?.tabela"
            >
              <template v-slot:item.data="{ item }">
                {{
                  `${new Date(item.data).toLocaleDateString(
                    "pt-BR"
                  )} às ${new Date(item.data).toLocaleTimeString("pt-BR")}`
                }}
              </template>
              <template v-slot:item.tipo="{ item }">
                {{ item.tipo == "entrada" ? "Entrada" : "Saída" }}
              </template>
            </v-data-table>
          </div>
          <div class="dashboard-table-content-printeable">
            <v-table density="compact">
              <thead>
                <tr>
                  <th v-for="head in headers" class="text-left">
                    <b>{{ head.title }}</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="dashboard-table-row"
                  v-for="item in state.graphic_data?.tabela"
                >
                  <td v-for="column in headers">
                    {{
                      column.key == "data"
                        ? `${new Date(item[column.key]).toLocaleDateString(
                            "pt-BR"
                          )} às ${new Date(item[column.key]).toLocaleTimeString(
                            "pt-BR"
                          )}`
                        : // @ts-ignore
                          item[column.key]
                    }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.dashboard-header-print,
.dashboard-header-printeable,
.dashboard-title-printeable,
.dashboard-table-content-printeable {
  display: none;
}

.dashboard-hr {
  width: 95%;
  margin: 32px auto;
  border-color: #004488;
}

.dashboard-main {
  margin-top: -12px;
  overflow-x: hidden;
}

.dashboard-content {
  margin: 12px auto;
  width: calc(100% - 48px);
  display: flex;
  flex-direction: column;
}

.dashboard-content-row {
  display: flex;
  flex-direction: row;
  gap: 24px;
  position: relative;
  background-color: white;
}

.dashboard-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-selector-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.dashboard-selector {
  width: 230px;
  height: 50px;
}

.dashboard-graphic,
.dashboard-table {
  flex: 1;
  position: relative;
}

.dashboard-graphic-printeable {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 745px;
  z-index: -1;
}

.dashboard-indicators {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: fit-content;
  align-items: center;
  align-self: flex-start;
  gap: 16px;
  height: 200px;
}

.dashboard-indicator {
  flex: 1;
}

.dashboard-title,
.dashboard-title-printeable {
  font-size: 18px;
  text-align: center;
  margin-bottom: 12px;
}

.dashboard-download-btn {
  position: absolute;
  top: 0;
  right: 0;
}

.dashboard-indicators-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 1080px) {
  .dashboard-selector-container {
    flex-direction: column;
    justify-content: center;
  }
}

@media (max-width: 824px) {
  .dashboard-filters {
    gap: 24px;
  }

  .dashboard-filters,
  .dashboard-selector-container,
  .dashboard-content-row {
    flex-direction: column;
    justify-content: center;
  }

  .dashboard-content-row {
    margin-top: 24px;
    gap: 8px;
  }

  .dashboard-indicators {
    width: 100%;
    margin: auto;
    gap: 0;
  }

  .dashboard-indicators .dashboard-title {
    margin: 0;
    padding: 0;
  }

  .dashboard-indicators-container {
    width: 100%;
    flex-direction: row;
    align-items: space-around;
  }

  .dashboard-graphic .dashboard-title {
    margin-bottom: 48px;
  }

  .dashboard-graphic .dashboard-download-btn {
    left: 50%;
    transform: translateX(-50%);
    top: 48px;
  }
}

@media print {
  .dashboard-header,
  .dashboard-filters,
  .dashboard-download-btn,
  .dashboard-indicators .dashboard-title,
  .dashboard-table-content,
  .dashboard-graphic {
    display: none;
  }

  .dashboard-main {
    overflow-x: inherit;
  }

  .dashboard-table-content-printeable {
    display: block;
  }

  .dashboard-hr {
    margin: 0;
    opacity: 0;
    page-break-after: always;
  }

  .dashboard-header-print {
    display: block;
    position: absolute;
    top: 0;
    width: 100%;
    height: auto;
  }

  .dashboard-header-printeable {
    display: block;
    margin-block: 72px;
  }

  .dashboard-content-row {
    flex-direction: column;
    gap: 0;
    background-color: transparent;
  }

  .dashboard-indicators {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: fit-content;
  }

  .dashboard-indicator {
    margin: 0;
  }

  .dashboard-title-printeable {
    display: block;
    margin-top: 32px;
  }

  .dashboard-title-printeable,
  .dashboard-title {
    font-size: 24px;
    color: var(--dark-blue);
  }

  .dashboard-table {
    margin-top: 32px;
  }

  .dashboard-table .dashboard-title {
    margin-bottom: 26px;
  }

  /* .dashboard-table-row {
    break-inside: avoid;
  } */

  .dashboard-graphic {
    display: none;
  }

  .dashboard-graphic-printeable {
    z-index: 1;
  }

  .dashboard-graphic-printeable-size {
    height: 370px;
  }

  .dashboard-header-printeable-subtitle {
    text-align: center;
    margin-top: 12px;
  }

  .dashboard-snackbar {
    display: none;
  }
}
</style>
