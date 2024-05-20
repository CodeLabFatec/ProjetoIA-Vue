<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import Titulo from '@/components/Titulo.vue';
import Botao from '@/components/Botao.vue';
import OpcoesBtn from '@/components/OpcoesBtn.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import AreaModal from '@/components/AreaModal.vue';

import Area from '@/services/Area';

import type IArea from '@/interfaces/IArea';

const router = useRouter();

const state = ref({
  items: [] as IArea[],
  error: false,
  loading: false,
  search: '',
  deleteModal: false,
  selectedArea: undefined as IArea | undefined,
  deleteFailed: false,
  deleteSuccess: false,
  areaModal: false,
});

const getAreas = () => {
  state.value.items = [];
  state.value.loading = true;
  Area.getAreas()
    .then(res => {
      const { status, data } = res;
      if (status == 200) {
        console.log(data)
        state.value.items = data.map(item => ({
          ...item,
          status_str: item.status == true ? "Ativo" : "Inativo"
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
    getAreas();
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
    title: 'Área',
  },
  {
    key: 'descricao',
    title: 'Descrição',
  },
  {
    key: 'status_str',
    title: 'Status',
  },
];

const updateDeleteModal = (new_state: boolean) => {
  state.value.deleteModal = new_state;
}

const updateAreaModal = (new_state: boolean) => {
  state.value.areaModal = new_state;
}

const askDeleteItem = (item: IArea | undefined) => {
  state.value.selectedArea = item;
  updateDeleteModal(true);
}

const confirmDeleteItem = () => {
  if (state.value.selectedArea) {
    state.value.areaModal = false;
    state.value.loading = true;
    updateDeleteModal(false);
    Area.deleteById(state.value.selectedArea.id as number)
      .then(res => {
        console.log(res)
        if (res.status == 204) {
          state.value.deleteSuccess = true;
          getAreas();
        } else {
          state.value.deleteFailed = true;
          state.value.loading = false;
        }
        state.value.selectedArea = undefined;
      })
      .catch(err => {
        console.log(err);
        state.value.deleteFailed = true;
        state.value.loading = false;
      });
  }
}

const goToUpdate = (id: number | undefined) => {
  router.push(`/area/update/${id || ''}`);
}

const goToCreate = () => {
  router.push('/area/create');
}

const onSelect = (option: string, item: IArea) => {
  switch (option) {
    case 'Detalhes':
      state.value.areaModal = true;
      state.value.selectedArea = item;
      console.log(state.value.selectedArea)
      break;
    case 'Editar':
      goToUpdate(item.id);
      break;
    case 'Inativar':
      askDeleteItem(item);
      break;
  }
}
</script>

<template>
  <main class="areas-list-main">
    <Titulo content="Áreas" />
    <p v-if="state.error" class="areaslist-error">Um erro interno aconteceu. Tente novamente mais tarde.</p>
    <div class="areaslist-btncontainer">
      <v-text-field placeholder="Pesquisar..."variant="underlined" class="areaslist-btncontainer-searchinput" v-model="state.search"
        prepend-inner-icon="mdi-magnify"></v-text-field>
      <div>
        <Botao content="Adicionar" @click="goToCreate()" class="areaslist-btn" />
      </div>
    </div>
    <div class="areaslist-tablecontainer">
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
    :message="`Excluir área ${state.selectedArea?.nome}?`" 
    @on-update-modal="updateDeleteModal($event)"
    @on-confirm="confirmDeleteItem()" 
  />

  <AreaModal 
    :visible="state.areaModal"
    :area="state.selectedArea" 
    @on-update-modal="updateAreaModal($event)" 
    @on-delete-request="askDeleteItem(state.selectedArea)"
    @on-update-request="goToUpdate(state.selectedArea?.id)"
  />

  <v-snackbar color="red" v-model="state.deleteFailed">
    Não foi possível inativar a área. Tente novamente mais tarde.
  </v-snackbar>
  <v-snackbar color="green" v-model="state.deleteSuccess">
    Área inativada com sucesso.
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