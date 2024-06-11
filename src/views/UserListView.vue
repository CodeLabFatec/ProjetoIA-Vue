<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import Titulo from "@/components/Titulo.vue";
import Botao from "@/components/Botao.vue";
import OpcoesBtn from "@/components/OpcoesBtn.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import AreaModal from "@/components/AreaModal.vue";

import User from "@/services/User";

import type IUser from "@/interfaces/IUser";

const router = useRouter();

const state = ref({
  items: [] as IUser[],
  error: false,
  loading: false,
  search: "",
  deleteModal: false,
  activateModal: false,
  selectedArea: undefined as IUser | undefined,
  deleteFailed: false,
  deleteSuccess: false,
  areaModal: false,
  activateFailed: false,
  activateSuccess: false,
});

const getUsers = async () => {
  state.value.items = [];
  state.value.loading = true;
  try {
    const res = await User.getUsers();
    const { status, data } = res;
    if (status === 200 && Array.isArray(data)) {
      state.value.items = data.map((item) => ({
        ...item,
        status_str: item.status ? "Ativo" : "Inativo",
      }));
    } else {
      state.value.error = true;
    }
  } catch (err) {
    console.log(err);
    state.value.error = true;
  } finally {
    state.value.loading = false;
  }
};

onMounted(() => {
  getUsers();
});

const headers = [
  { key: "id", title: "", sortable: false, width: 0 },
  { key: "nome", title: "Usuário" },
  { key: "email", title: "E-mail" },
  { key: "status_str", title: "Tipo de Acesso" },
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

const askDeleteItem = (item: IUser | undefined) => {
  state.value.selectedArea = item;
  updateDeleteModal(true);
};

const askActivateItem = (item: IUser | undefined) => {
  state.value.selectedArea = item;
  updateActivateModal(true);
};

const confirmDeleteItem = async () => {
  if (state.value.selectedArea) {
    state.value.loading = true;
    updateDeleteModal(false);
    try {
      const res = await User.deleteById(state.value.selectedArea.id as number);
      if (res.status === 204) {
        state.value.deleteSuccess = true;
        getUsers();
      } else {
        state.value.deleteFailed = true;
      }
    } catch (err) {
      console.log(err);
      state.value.deleteFailed = true;
    } finally {
      state.value.loading = false;
      state.value.selectedArea = undefined;
    }
  }
};

const goToUpdate = (id: number | undefined) => {
  router.push(`/user/update/${id || ""}`);
};

const goToCreate = () => {
  router.push("/user/create");
};

const onSelect = (option: string, item: IUser) => {
  switch (option) {
    case "Detalhes":
      state.value.areaModal = true;
      state.value.selectedArea = item;
      break;
    case "Editar":
      goToUpdate(item.id);
      break;
    case "Inativar":
    case "Ativar":
      askActivateItem(item);
      break;
  }
};
</script>

<template>
  <main class="users-list-main">
    <Titulo content="Usuários" />
    <p v-if="state.error" class="userslist-error">
      Um erro interno aconteceu. Tente novamente mais tarde.
    </p>
    <div class="userslist-btncontainer">
      <v-text-field
        placeholder="Pesquisar..."
        variant="underlined"
        class="userslist-btncontainer-searchinput"
        v-model="state.search"
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>
      <div>
        <Botao
          content="Adicionar"
          @click="goToCreate()"
          class="userslist-btn"
        />
      </div>
    </div>
    <div class="userslist-tablecontainer">
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
    @on-confirm="confirmDeleteItem"
  />

  <ConfirmModal
    title="Confirmar ativação?"
    msg_cancel="cancelar"
    msg_confirm="confirmar"
    :visible="state.activateModal"
    :message="`Ativar área ${state.selectedArea?.nome}?`"
    @on-update-modal="updateActivateModal($event)"
    
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
.userslist-btncontainer {
  display: flex;
  width: 90%;
  margin: 12px auto;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: -18px;
}

.userslist-btncontainer-searchinput {
  flex: 1;
  padding: 0;
}

.userslist-btn {
  width: 200px;
  margin-top: 12px;
}

.userslist-tablecontainer {
  margin: 12px auto;
  width: 90%;
}

.userslist-error {
  color: red;
  text-align: center;
}
</style>
