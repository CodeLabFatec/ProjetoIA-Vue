<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import Titulo from '@/components/Titulo.vue';
import Botao from '@/components/Botao.vue';

import Area from '@/services/Area';
import LoadingBar from '@/components/LoadingBar.vue';

const router = useRouter();
const route_data = useRoute();

const state = ref({
  nome: '',
  descricao: '',
  loading: false,
  error: false,
  success: false,
  invalid: false,
});

onMounted(() => {
  if (route_data.params.id) {
    state.value.loading = true;
    Area.getByID(Number(route_data.params.id))
      .then(res => {
        if (res.status == 200 && res.data) {
          state.value.nome = res.data.nome;
          state.value.descricao = res.data.descricao;
        } else {
          state.value.error = true;
        }
        state.value.loading = false;
      })
      .catch(err => {
        console.log(err);
        state.value.error = true;
        state.value.loading = false;
      });
  }
});

const onSubmit = () => {
  if (!state.value.nome) {
    state.value.invalid = true;
    return
  }

  state.value.loading = true;
  Area[route_data.params.id ? 'update' : 'create']({
    id: Number(route_data.params.id),
    nome: state.value.nome,
    descricao: state.value.descricao
  })
    .then(res => {

      if (res.status !== 201 && res.status !== 200) {
        state.value.error = true;
      } else {
        state.value.success = true;
        setTimeout(() => {
          reset();
          goBack();
        }, 3250);
      }

      state.value.loading = false;
    })
    .catch(err => {
      console.log(err);
      state.value.error = true;
      state.value.loading = false;
    });
}

const reset = () => {
  state.value = {
    invalid: false,
    descricao: '',
    error: false,
    loading: false,
    nome: '',
    success: false,
  }
}

const goBack = () => {
  router.back();
}

const clearError = () => {
  state.value.invalid = false;
}
</script>

<template>
  <main class="areaform">
    <LoadingBar :visible="state.loading" />
    <div class="areaform-titulo-container">
      <div class="areaform-backbtn">
        <v-btn @click="goBack" variant="text" icon="mdi-arrow-left" color="#004488"></v-btn>
      </div>
      <Titulo :content="route_data.params.id ? 'Edição de Área' : 'Cadastro de Área'" />
    </div>
    <form @submit.prevent="onSubmit" class="form">
      <div>
        <v-text-field @update:focused="clearError" :error-messages="state.invalid ? 'Campo obrigatório' : ''"
          :readonly="state.loading" variant="outlined" label="Nome*" v-model="state.nome"></v-text-field>
      </div>
      <div>
        <v-textarea :readonly="state.loading" class="desc-field" variant="outlined" label="Descrição"
          v-model="state.descricao" auto-grow></v-textarea>
      </div>
      <div class="areaform-containerbtn">
        <Botao :disabled="state.loading" :content="route_data.params.id ? 'Editar' : 'Cadastrar'" />
      </div>
    </form>
  </main>
  <v-snackbar color="green" v-model="state.success">
    Área {{ route_data.params.id ? 'editada' : 'criada' }} com sucesso! Retornando à tela de listagem...
  </v-snackbar>
  <v-snackbar color="red" v-model="state.error">
    Um erro interno aconteceu. Tente novamente mais tarde.
  </v-snackbar>
</template>

<style scoped>
.areaform-backbtn {
  position: absolute;
  top: 74px;
  left: 0;
}

.areaform {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  margin-bottom: 24px;
}

.areaform-titulo-container {
  display: flex;
  width: 100%;
}

.areaform .form {
  display: flex;
  flex-direction: column;
  margin-inline: 12px;
  width: 80%;
  max-width: 520px;
  gap: 12px;
}

.areaform-containerbtn {
  display: flex;
  flex-direction: row-reverse;
}
</style>