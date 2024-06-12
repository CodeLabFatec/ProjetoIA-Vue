<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import Titulo from "@/components/Titulo.vue";
import Botao from "@/components/Botao.vue";
import OpcoesBtn from "@/components/OpcoesBtn.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import UserModal from "@/components/UserModal.vue";

import User from "@/services/User";

import type IUser from "@/interfaces/IUser";

const router = useRouter();

const state = ref({
  items: [] as IUser[],
  error: false,
  loading: false,
  search: "",
  userModal: false,
  deleteModal: false,
  deleteFailed: false,
  deleteSuccess: false,
  activateModal: false, // Add this line
  activateFailed: false, // Add this line
  activateSuccess: false, // Add this line
  selectedUser: undefined as IUser | undefined,
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
        tipoAcesso_str: item.papel.nome
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
  { key: "tipoAcesso_str", title: "Tipo de Acesso" },
];

const updateDeleteModal = (new_state: boolean) => {
  state.value.deleteModal = new_state;
};

const updateAreaModal = (new_state: boolean) => {
  state.value.userModal = new_state;
};

const updateActivateModal = (new_state: boolean) => { // Add this function
  state.value.activateModal = new_state;
};

const askDeleteItem = (item: IUser | undefined) => {
  state.value.selectedUser = item;
  updateDeleteModal(true);
};

const askActivateItem = (item: IUser | undefined) => {
  state.value.selectedUser = item;
  updateActivateModal(true);
};

const confirmDeleteItem = async () => {
  if (state.value.selectedUser) {
    state.value.loading = true;
    updateDeleteModal(false);
    try {
      const res = await User.deleteById(state.value.selectedUser.id as number);
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
      state.value.selectedUser = undefined;
    }
  }
};

// const confirmActivateItem = async () => { // Add this function
//   if (state.value.selectedUser) {
//     state.value.loading = true;
//     updateActivateModal(false);
//     try {
//       const res = await User.activateById(state.value.selectedUser.id as number); // Assuming you have an API to activate
//       if (res.status === 200) {
//         state.value.activateSuccess = true;
//         getUsers();
//       } else {
//         state.value.activateFailed = true;
//       }
//     } catch (err) {
//       console.log(err);
//       state.value.activateFailed = true;
//     } finally {
//       state.value.loading = false;
//       state.value.selectedUser = undefined;
//     }
//   }
// };

const goToUpdate = (id: number | undefined) => {
  router.push(`/user/update/${id || ""}`);
};

const goToCreate = () => {
  router.push("/user/create");
};

const onSelect = (option: string, item: IUser) => {
  switch (option) {
    case "Detalhes":
      state.value.userModal = true;
      state.value.selectedUser = item;
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
            :items="['Detalhes', 'Editar']"
            @on-select="onSelect($event, item)"
          />
        </template>
        <template v-slot:item.tipoAcesso_str="{ item }">
          <div>
            <p
              style="
                display: flex;
                justify-content: start;
                width: 180px;
                text-align: center;
                border-radius: 3px;
              "
            >
              {{ item.papel.nome }}
            </p>
          </div>
        </template>
      </v-data-table>
    </div>
  </main>

  <UserModal
    :visible="state.userModal"
    @on-update-modal="updateAreaModal($event)"
    @on-delete-request="askDeleteItem(state.selectedUser)"
    @on-update-request="goToUpdate(state.selectedUser?.id)"
    @on-activate-request="askActivateItem(state.selectedUser)"
  />
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
