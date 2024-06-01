<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import Titulo from "@/components/Titulo.vue";
import Botao from "@/components/Botao.vue";
import OpcoesBtn from "@/components/OpcoesBtn.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AreaModal from "@/components/AreaModal.vue";

import Area from "@/services/Area";

import type IArea from "@/interfaces/IArea";

const router = useRouter();

const state = ref({
  items: [] as IArea[],
  error: false,
  loading: false,
  search: "",
  deleteModal: false,
  activateModal: false,
  selectedArea: undefined as IArea | undefined,
  deleteFailed: false,
  deleteSuccess: false,
  areaModal: false,
  activateFailed: false,
  activateSuccess: false,
});

const getAreas = () => {
  state.value.items = [];
  state.value.loading = true;
  Area.getAreas()
    .then((res) => {
      const { status, data } = res;
      if (status == 200) {
        state.value.items = data.map((item) => ({
          ...item,
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
  getAreas();
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
    title: "Usuário",
  },
  {
    key: "email",
    title: "E-mail",
  },
  {
    key: "status_str",
    title: "Tipo de Acesso",
  },
];

const updateDeleteModal = (new_state: boolean) => {
  state.value.deleteModal = new_state;
};

const updateActivateModal = (new_state: boolean) => {
  state.value.activateModal = new_state;
};

const updateAreaModal = (new_state: boolean) => {
  state.value.areaModal = new_state;
};

const askDeleteItem = (item: IArea | undefined) => {
  state.value.selectedArea = item;
  updateDeleteModal(true);
};

function askActivateItem(item: IArea | undefined) {
  state.value.selectedArea = item;
  updateActivateModal(true);
}

const confirmDeleteItem = () => {
  if (state.value.selectedArea) {
    state.value.areaModal = false;
    state.value.loading = true;
    updateDeleteModal(false);
    Area.deleteById(state.value.selectedArea.id as number)
      .then((res) => {
        console.log(res);
        if (res.status == 204) {
          state.value.deleteSuccess = true;
          getAreas();
        } else {
          state.value.deleteFailed = true;
          state.value.loading = false;
        }
        state.value.selectedArea = undefined;
      })
      .catch((err) => {
        console.log(err);
        state.value.deleteFailed = true;
        state.value.loading = false;
      });
  }
};

const confirmActivateItem = () => {
  if (state.value.selectedArea) {
    state.value.areaModal = false;
    state.value.loading = true;
    updateActivateModal(false);
    Area.activateById(state.value.selectedArea.id as number)
      .then((res) => {
        console.log(res);
        if (res.status == 204) {
          state.value.activateSuccess = true;
          getAreas();
        } else {
          state.value.activateFailed = true;
          state.value.loading = false;
        }
        state.value.selectedArea = undefined;
      })
      .catch((err) => {
        console.log(err);
        state.value.activateFailed = true;
        state.value.loading = false;
      });
  }
};

const goToUpdate = (id: number | undefined) => {
  router.push(`/user/update/${id || ""}`);
};

const goToCreate = () => {
  router.push("/user/create");
};

const onSelect = (option: string, item: IArea) => {
  switch (option) {
    case "Detalhes":
      state.value.areaModal = true;
      state.value.selectedArea = item;
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
  <main class="areas-list-main">
    <Titulo content="Usuários" />
    <p v-if="state.error" class="areaslist-error">
      Um erro interno aconteceu. Tente novamente mais tarde.
    </p>
    <div class="areaslist-btncontainer">
      <v-text-field
        placeholder="Pesquisar..."
        variant="underlined"
        class="areaslist-btncontainer-searchinput"
        v-model="state.search"
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>
      <div>
        <Botao
          content="Adicionar"
          @click="goToCreate()"
          class="areaslist-btn"
        />
      </div>
    </div>
    <div class="areaslist-tablecontainer">
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
    :message="`Inativar área ${state.selectedArea?.nome}?`"
    @on-update-modal="updateDeleteModal($event)"
    @on-confirm="confirmDeleteItem()"
  />

  <ConfirmModal
    title="Confirmar ativação?"
    msg_cancel="cancelar"
    msg_confirm="confirmar"
    :visible="state.activateModal"
    :message="`Ativar área ${state.selectedArea?.nome}?`"
    @on-update-modal="updateActivateModal($event)"
    @on-confirm="confirmActivateItem()"
  />

  <AreaModal
    :visible="state.areaModal"
    :area="state.selectedArea"
    @on-update-modal="updateAreaModal($event)"
    @on-delete-request="askDeleteItem(state.selectedArea)"
    @on-update-request="goToUpdate(state.selectedArea?.id)"
    @on-activate-request="askActivateItem(state.selectedArea)"
  />

  <v-snackbar color="red" v-model="state.deleteFailed">
    Não foi possível inativar a área. Tente novamente mais tarde.
  </v-snackbar>
  <v-snackbar color="green" v-model="state.deleteSuccess">
    Área inativada com sucesso.
  </v-snackbar>
  <v-snackbar color="red" v-model="state.activateFailed">
    Não foi possível ativar a área. Tente novamente mais tarde.
  </v-snackbar>
  <v-snackbar color="green" v-model="state.activateSuccess">
    Área ativada com sucesso.
  </v-snackbar>
</template>

<style scoped>
.areaslist-btncontainer {
  display: flex;
  width: 90%;
  margin: 12px auto;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: -18px;
}

.areaslist-btncontainer-searchinput {
  flex: 1;
  padding: 0;
}

.areaslist-btn {
  width: 200px;
  margin-top: 12px;
}

.areaslist-tablecontainer {
  margin: 12px auto;
  width: 90%;
}

.areaslist-error {
  color: red;
  text-align: center;
}
</style>
