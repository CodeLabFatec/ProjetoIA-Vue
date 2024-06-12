<script setup lang="ts">
import Botao from "@/components/Botao.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import OpcoesBtn from "@/components/OpcoesBtn.vue";
import Titulo from "@/components/Titulo.vue";
import UserModal from "@/components/UserModal.vue";
import type IUser from "@/interfaces/IUser";
import User from "@/services/User";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

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
        tipoAcesso_str: item.papel.nome,
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

const updateUserModal = (new_state: boolean) => {
  state.value.userModal = new_state;
};

const askDeleteItem = (item: IUser | undefined) => {
  state.value.selectedUser = item;
  updateDeleteModal(true);
};

const confirmDeleteItem = async () => {
  if (state.value.selectedUser) {
    state.value.loading = true;
    updateDeleteModal(false);
    try {
      const res = await User.deleteById(state.value.selectedUser.id as number);
      if (res.status === 200) {
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
      state.value.userModal = false;
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
      state.value.userModal = true;
      state.value.selectedUser = item;
      break;
    case "Editar":
      goToUpdate(item.id);
      break;
    case "Excluir":
      askDeleteItem(item);
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
            :items="['Detalhes', 'Editar', 'Excluir']"
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

  <ConfirmModal
    title="Confirmar exclusão?"
    msg_cancel="cancelar"
    msg_confirm="confirmar"
    :visible="state.deleteModal"
    :message="`Excluir usuário ${state.selectedUser?.nome}?`"
    @on-update-modal="updateDeleteModal($event)"
    @on-confirm="confirmDeleteItem()"
  />

  <UserModal
    :visible="state.userModal"
    :user="state.selectedUser"
    @on-update-modal="updateUserModal($event)"
    @on-delete-request="askDeleteItem(state.selectedUser)"
    @on-update-request="goToUpdate(state.selectedUser?.id)"
  />

  <v-snackbar color="red" v-model="state.deleteFailed">
    Não foi possível excluir o usuário. Tente novamente mais tarde.
  </v-snackbar>
  <v-snackbar color="green" v-model="state.deleteSuccess">
    Usuário excluído com sucesso.
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
