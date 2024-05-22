<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import Titulo from "@/components/Titulo.vue";
import Botao from "@/components/Botao.vue";
import OpcoesBtn from "@/components/OpcoesBtn.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import RedzoneModal from "@/components/RedzoneModal.vue";

import Redzone from "@/services/Redzone";

import type IRedzone from "@/interfaces/IRedzone";

const router = useRouter();

const state = ref({
  items: [] as IRedzone[],
  error: false,
  loading: false,
  search: "",
  deleteModal: false,
  selectedRedzone: undefined as IRedzone | undefined,
  deleteFailed: false,
  deleteSuccess: false,
  redzoneModal: false,
  activateModal: false,
  activateFailed: false,
  activateSuccess: false,
});

const getRedzones = () => {
  state.value.items = [];
  state.value.loading = true;
  Redzone.getRedzones()
    .then((res) => {
      const { status, data } = res;
      if (status == 200) {
        state.value.items = data.map((item) => ({
          ...item,
          data: new Date(item.data).toLocaleDateString("pt-BR"),
          status_str: item.status == true ? "Ativo" : "Inativo",
        }));
      } else {
        state.value.error = true;
      }
      state.value.loading = false;
    })
    .catch((err) => {
      console.log(err);
      state.value.loading = false;
      state.value.error = true;
    });
};

onMounted(() => {
  getRedzones();
});

const headers = [
  {
    key: "id",
    title: "",
    sortable: false,
    width: 0,
  },
  {
    key: "nome",
    title: "RedZone",
  },
  {
    key: "data",
    title: "Data de cadastro",
  },
  {
    key: "area.nome",
    title: "Área",
  },
  {
    key: "status_str",
    title: "Status",
  },
];

const updateDeleteModal = (new_state: boolean) => {
  state.value.deleteModal = new_state;
};

const updateRedzoneModal = (new_state: boolean) => {
  state.value.redzoneModal = new_state;
};

const askDeleteItem = (item: IRedzone | undefined) => {
  state.value.selectedRedzone = item;
  updateDeleteModal(true);
};

const updateActivateModal = (new_state: boolean) => {
  state.value.activateModal = new_state;
};

function askActivateItem(item: IRedzone | undefined) {
  state.value.selectedRedzone = item;
  updateActivateModal(true);
}

const confirmActivateItem = () => {
  if (state.value.selectedRedzone) {
    state.value.redzoneModal = false;
    state.value.loading = true;
    updateActivateModal(false);
    Redzone.activateById(state.value.selectedRedzone.id as number)
      .then((res) => {
        console.log(res);
        if (res.status == 204) {
          state.value.activateSuccess = true;
          getRedzones();
        } else {
          state.value.activateFailed = true;
          state.value.loading = false;
        }
        state.value.selectedRedzone = undefined;
      })
      .catch((err) => {
        console.log(err);
        state.value.activateFailed = true;
        state.value.loading = false;
      });
  }
};

const confirmDeleteItem = () => {
  if (state.value.selectedRedzone) {
    state.value.redzoneModal = false;
    state.value.loading = true;
    updateDeleteModal(false);
    Redzone.delete(state.value.selectedRedzone.id)
      .then((res) => {
        if (res.status == 204) {
          state.value.deleteSuccess = true;
          getRedzones();
        } else {
          state.value.deleteFailed = true;
          state.value.loading = false;
        }
        state.value.selectedRedzone = undefined;
      })
      .catch((err) => {
        console.log(err);
        state.value.deleteFailed = true;
        state.value.loading = false;
      });
  }
};

const goToUpdate = (id: number | undefined) => {
  router.push(`/redzones/update/${id || ""}`);
};

const goToCreate = () => {
  router.push("/redzones/create");
};

const onSelect = (option: string, item: IRedzone) => {
  switch (option) {
    case "Detalhes":
      state.value.redzoneModal = true;
      state.value.selectedRedzone = item;
      break;
    case "Editar":
      goToUpdate(item.id);
      break;
    case "Inativar":
      askDeleteItem(item);
      break;
    case "Ativar":
      askActivateItem(item);
      break;
  }
};
</script>

<template>
  <main class="redzones-list-main">
    <Titulo content="RedZones" />
    <p v-if="state.error" class="redzoneslist-error">
      Um erro interno aconteceu. Tente novamente mais tarde.
    </p>
    <div class="redzoneslist-btncontainer">
      <v-text-field
        placeholder="Pesquisar..."
        variant="underlined"
        class="redzoneslist-btncontainer-searchinput"
        v-model="state.search"
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>
      <div>
        <Botao
          content="Adicionar"
          @click="goToCreate()"
          class="redzoneslist-btn"
        />
      </div>
    </div>
    <div class="redzoneslist-tablecontainer">
      <v-data-table
        :headers="headers"
        :items="state.items"
        :loading="state.loading"
        :search="state.search"
      >
        <template v-slot:item.id="{ item }">
          <OpcoesBtn
            :items="['Detalhes', 'Editar', item.status ? 'Inativar' : 'Ativar']"
            @on-select="onSelect($event, item)"
          />
        </template>
        <template v-slot:item.status_str="{ item }">
          <div v-if="item.status">
            <p
              style="
                color: white;
                background-color: green;
                width: 50px;
                text-align: center;
                border-radius: 3px;
              "
            >
              Ativo
            </p>
          </div>
          <div v-if="!item.status">
            <p
              style="
                color: white;
                background-color: red;
                width: 50px;
                text-align: center;
                border-radius: 3px;
              "
            >
              Inativo
            </p>
          </div>
        </template>
      </v-data-table>
    </div>
  </main>

  <ConfirmModal
    title="Confirmar inativação?"
    msg_cancel="cancelar"
    msg_confirm="confirmar"
    :visible="state.deleteModal"
    :message="`Inativar redzone ${state.selectedRedzone?.nome}?`"
    @on-update-modal="updateDeleteModal($event)"
    @on-confirm="confirmDeleteItem()"
  />

  <ConfirmModal
    title="Confirmar ativação?"
    msg_cancel="cancelar"
    msg_confirm="confirmar"
    :visible="state.activateModal"
    :message="`Ativar redzone ${state.selectedRedzone?.nome}?`"
    @on-update-modal="updateActivateModal($event)"
    @on-confirm="confirmActivateItem()"
  />

  <RedzoneModal
    :redzone="state.selectedRedzone"
    :visible="state.redzoneModal"
    @on-update-modal="updateRedzoneModal($event)"
    @on-delete-request="askDeleteItem(state.selectedRedzone)"
    @on-update-request="goToUpdate(state.selectedRedzone?.id)"
  />

  <v-snackbar color="red" v-model="state.deleteFailed">
    Não foi possível inativar redzone. Tente novamente mais tarde.
  </v-snackbar>
  <v-snackbar color="green" v-model="state.deleteSuccess">
    Redzone inativada com sucesso.
  </v-snackbar>
  <v-snackbar color="red" v-model="state.activateFailed">
    Não foi possível ativar redzone. Tente novamente mais tarde.
  </v-snackbar>
  <v-snackbar color="green" v-model="state.activateSuccess">
    Redzone ativada com sucesso.
  </v-snackbar>
</template>

<style scoped>
.redzoneslist-btncontainer {
  display: flex;
  width: 90%;
  margin: 12px auto;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: -18px;
}

.redzoneslist-btncontainer-searchinput {
  flex: 1;
  padding: 0;
}

.redzoneslist-btn {
  width: 200px;
  margin-top: 12px;
}

.redzoneslist-tablecontainer {
  margin: 12px auto;
  width: 90%;
}

.redzoneslist-error {
  color: red;
  text-align: center;
}
</style>
