<script setup lang="ts">
import { ref, onMounted } from 'vue';

import Titulo from '@/components/Titulo.vue';
import Botao from '@/components/Botao.vue';
import OpcoesBtn from '@/components/OpcoesBtn.vue';

import Redzone from '@/services/Redzone';

import type IRedzone from '@/interfaces/IRedzone';

const state = ref({
  items: [] as IRedzone[],
  error: false,
  loading: false,
  search: '',
})

onMounted(() => {
  state.value.loading = true;
  Redzone.getRedzones()
    .then(res => {
      const { status, data } = res;
      if (status == 200) {
        state.value.items = data.map(item => ({
          ...item,
          data_cadastro: new Date(item.data_cadastro).toLocaleDateString('pt-BR'),
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
    })
})

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
    key: 'data_cadastro',
    title: 'Data de cadastro',
  },
]

const deleteItem = (id: number) => {
  console.log('delete', id);
}

const goToUpdate = (id: number) => {
  console.log('update', id);
}

const goToCreate = () => {
  console.log('create');
}

const onSelect = (item: string, id: number) => {
  switch (item) {
    case 'Editar':
      goToUpdate(id);
      break;
    case 'Excluir':
      deleteItem(id);
      break;
  }
}
</script>

<template>
  <main class="redzones-list-main">
    <Titulo content="RedZones" />
    <p v-if="state.error" class="redzoneslist-error">Um erro interno aconteceu. Tente novamente mais tarde.</p>
    <div class="redzoneslist-btncontainer">
      <v-text-field  variant="underlined" class="redzoneslist-btncontainer-searchinput"
        v-model="state.search" prepend-inner-icon="mdi-magnify"></v-text-field>
      <div>
        <Botao content="Adicionar" @click="goToCreate()" class="redzoneslist-btn" />
      </div>
    </div>
    <div class="redzoneslist-tablecontainer">
      <v-data-table :headers="headers" :items="state.items" :loading="state.loading" :search="state.search">
        <template v-slot:item.id="{ item }">
          <OpcoesBtn :items="['Editar', 'Excluir']" @on-select="onSelect($event, item.id)" />
        </template>
      </v-data-table>
    </div>
  </main>
</template>

<style>
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