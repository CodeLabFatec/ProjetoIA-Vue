<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import Titulo from '@/components/Titulo.vue';
import Botao from '@/components/Botao.vue';
import OpcoesBtn from '@/components/OpcoesBtn.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import RedzoneModal from '@/components/RedzoneModal.vue';

import Redzone from '@/services/Redzone';

import type IRedzone from '@/interfaces/IRedzone';

const router = useRouter();

const state = ref({
  items: [] as IRedzone[],
  error: false,
  loading: false,
  search: '',
  deleteModal: false,
  selectedRedzone: undefined as IRedzone | undefined,
  deleteFailed: false,
  deleteSuccess: false,
  redzoneModal: false,
});

const getRedzones = () => {
  state.value.items = [];
  state.value.loading = true;
  Redzone.getRedzones()
    .then(res => {
      const { status, data } = res;
      if (status == 200) {
        state.value.items = data.map(item => ({
          ...item,
          data: new Date(item.data).toLocaleDateString('pt-BR'),
        }));
      } else {
        state.value.error = true;
      }
      state.value.loading = false;
    })
    .catch(err => {
      console.log(err);
      state.value.loading = false;
      state.value.error = true;
    });
}

onMounted(() => {
  getRedzones();
});

const headers = [
  {
    key: 'id',
    title: '',
    sortable: false,
    width: 0,
  },
  {
    key: 'nome',
    title: 'RedZone',
  },
  {
    key: 'data',
    title: 'Data de cadastro',
  },
];

const updateDeleteModal = (new_state: boolean) => {
  state.value.deleteModal = new_state;
}

const updateRedzoneModal = (new_state: boolean) => {
  state.value.redzoneModal = new_state;
}

const askDeleteItem = (item: IRedzone | undefined) => {
  state.value.selectedRedzone = item;
  updateDeleteModal(true);
}

const confirmDeleteItem = () => {
  if (state.value.selectedRedzone) {
    state.value.redzoneModal = false;
    state.value.loading = true;
    updateDeleteModal(false);
    Redzone.delete(state.value.selectedRedzone.id)
      .then(res => {
        if (res.status == 200) {
          state.value.deleteSuccess = true;
          getRedzones();
        } else {
          state.value.deleteFailed = true;
          state.value.loading = false;
        }
        state.value.selectedRedzone = undefined;
      })
      .catch(err => {
        console.log(err);
        state.value.deleteFailed = true;
        state.value.loading = false;
      });
  }
}

const goToUpdate = (id: number | undefined) => {
  router.push(`/redzones/update/${id || ''}`);
}

const goToCreate = () => {
  router.push('/redzones/create');
}

const onSelect = (option: string, item: IRedzone) => {
  switch (option) {
    case 'Detalhes':
      state.value.redzoneModal = true;
      state.value.selectedRedzone = item;
      break;
    case 'Editar':
      goToUpdate(item.id);
      break;
    case 'Excluir':
      askDeleteItem(item);
      break;
  }
}
</script>

<template>
  <main class="redzones-list-main">
    <Titulo content="RedZones" />
    <p v-if="state.error" class="redzoneslist-error">Um erro interno aconteceu. Tente novamente mais tarde.</p>
    <div class="redzoneslist-btncontainer">
      <v-text-field variant="underlined" class="redzoneslist-btncontainer-searchinput" v-model="state.search"
        prepend-inner-icon="mdi-magnify"></v-text-field>
      <div>
        <Botao content="Adicionar" @click="goToCreate()" class="redzoneslist-btn" />
      </div>
    </div>
    <div class="redzoneslist-tablecontainer">
      <v-data-table :headers="headers" :items="state.items" :loading="state.loading" :search="state.search">
        <template v-slot:item.id="{ item }">
          <OpcoesBtn :items="['Detalhes', 'Editar', 'Excluir']" @on-select="onSelect($event, item)" />
        </template>
      </v-data-table>
    </div>
  </main>

  <ConfirmModal 
    title="Confirmar exclusão?" 
    msg_cancel="cancelar" 
    msg_confirm="confirmar" 
    :visible="state.deleteModal"
    :message="`Excluir redzone ${state.selectedRedzone?.nome}?`" 
    @on-update-modal="updateDeleteModal($event)"
    @on-confirm="confirmDeleteItem()" 
  />
  <RedzoneModal 
    :redzone="state.selectedRedzone" 
    :visible="state.redzoneModal"
    @on-update-modal="updateRedzoneModal($event)" 
    @on-delete-request="askDeleteItem(state.selectedRedzone)"
    @on-update-request="goToUpdate(state.selectedRedzone?.id)"
  />

  <v-snackbar color="red" v-model="state.deleteFailed">
    Não foi possível deletar a redzone. Tente novamente mais tarde.
  </v-snackbar>
  <v-snackbar color="green" v-model="state.deleteSuccess">
    Redzone excluída com sucesso.
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