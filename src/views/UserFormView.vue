<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import Titulo from "@/components/Titulo.vue";
import Botao from "@/components/Botao.vue";
import Area from "@/services/Area";
import LoadingBar from "@/components/LoadingBar.vue";

const router = useRouter();
const route = useRoute();

const state = reactive({
  nome: "",
  email: "",
  matricula: "",
  descricao: "",
  loading: false,
  error: false,
  success: false,
  invalid: false,
});

const selectedOption = ref<string | null>(null);
const options = ["Administrador", "Guarda"];

onMounted(() => {
  if (route.params.id) {
    state.loading = true;
    Area.getByID(Number(route.params.id))
      .then((res) => {
        if (res.status === 200 && res.data) {
          state.nome = res.data.nome;
          state.descricao = res.data.descricao;
        } else {
          state.error = true;
        }
        state.loading = false;
      })
      .catch((err) => {
        console.log(err);
        state.error = true;
        state.loading = false;
      });
  }
});

const onSubmit = () => {
  if (!state.nome) {
    state.invalid = true;
    return;
  }

  state.loading = true;
  const action = route.params.id ? "update" : "create";
  Area[action]({
    id: Number(route.params.id),
    nome: state.nome,
    descricao: state.descricao,
  })
    .then((res) => {
      if (res.status !== 201 && res.status !== 200) {
        state.error = true;
      } else {
        state.success = true;
        setTimeout(() => {
          reset();
          goBack();
        }, 1000);
      }
      state.loading = false;
    })
    .catch((err) => {
      console.log(err);
      state.error = true;
      state.loading = false;
    });
};

const reset = () => {
  state.nome = "";
  state.email = "";
  state.matricula = "";
  state.descricao = "";
  state.invalid = false;
  state.error = false;
  state.loading = false;
  state.success = false;
};

const goBack = () => {
  router.back();
};

const clearError = () => {
  state.invalid = false;
};
</script>


<template>
    <main class="areaform">
      <LoadingBar :visible="state.loading" />
      <div class="areaform-titulo-container">
        <div class="areaform-backbtn">
          <v-btn
            @click="goBack"
            variant="text"
            icon="mdi-arrow-left"
            color="#004488"
          ></v-btn>
        </div>
        <Titulo
          :content="route.params.id ? 'Edição de Usuário' : 'Cadastro de Usuário'"
        />
      </div>
      <form @submit.prevent="onSubmit" class="form">
        <div>
          <v-text-field
            @update:focused="clearError"
            :error-messages="state.invalid ? 'Campo obrigatório' : ''"
            :readonly="state.loading"
            variant="outlined"
            label="Nome completo*"
            v-model="state.nome"
          ></v-text-field>
          <v-select
            v-model="selectedOption"
            :items="options"
            label="Tipo de Acesso"
            outlined
          ></v-select>
          <v-text-field
            @update:focused="clearError"
            :error-messages="state.invalid ? 'Campo obrigatório' : ''"
            :readonly="state.loading"
            variant="outlined"
            label="E-mail*"
            v-model="state.email"
          ></v-text-field>
          <v-text-field
            @update:focused="clearError"
            :error-messages="state.invalid ? 'Campo obrigatório' : ''"
            :readonly="state.loading"
            variant="outlined"
            label="Matrícula*"
            v-model="state.matricula"
          ></v-text-field>
        </div>
        <div class="areaform-containerbtn">
          <Botao
            :disabled="state.loading"
            :content="route.params.id ? 'Editar' : 'Cadastrar'"
          />
        </div>
      </form>
    </main>
    <v-snackbar color="green" v-model="state.success">
      Área {{ route.params.id ? "editada" : "criada" }} com sucesso!
      Retornando à tela de listagem...
    </v-snackbar>
    <v-snackbar color="red" v-model="state.error">
      Um erro interno aconteceu. Tente novamente mais tarde.
    </v-snackbar>
  </template>
  

  <style scoped>

.v-select{
    color: var(--dark-blue);
}
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
  
