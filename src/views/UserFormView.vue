<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import Titulo from "@/components/Titulo.vue";
import Botao from "@/components/Botao.vue";
import User from "@/services/User";
import LoadingBar from "@/components/LoadingBar.vue";
import type { ISelectOption } from "@/interfaces/ISelectOption";

const router = useRouter();
const route = useRoute();

interface IUserForm {
  nome: string;
  email: string;
  idPapel?: number;
  areas: number[];
  redzones: number[];
}

const state = reactive({
  user: {
    areas: [],
    redzones: [],
    email: "",
    idPapel: undefined,
    nome: "",
  } as IUserForm,
  loading: false,
  error: false,
  success: false,
  invalid: false,
  papeis: [] as ISelectOption[],
  areas: [] as ISelectOption[],
  redzones: [] as ISelectOption[],
});

onMounted(() => {
  User.getCreateInfo().then((res) => {
    if (res) {
      state.areas = res.areas;
      state.papeis = res.papeis;
      state.redzones = res.redzones;
    }
  });

  if (route.params.id) {
    state.loading = true;
    User.getByID(Number(route.params.id))
      .then((res) => {
        if (res.status === 200 && res.data) {
          let areasSelected: number[] = [];
          if (res.data.areas && res.data.areas.length > 0) {
            areasSelected = res.data.areas.map((r) => {
              return r.id || 0;
            });
          }
          let redzoneSelected: number[] = [];
          if (res.data.redzones && res.data.redzones.length > 0) {
            redzoneSelected = res.data.redzones.map((r) => {
              return r.id || 0;
            });
          }
          state.user = {
            nome: res.data.nome,
            email: res.data.email,
            idPapel: res.data.papel.id,
            areas: areasSelected,
            redzones: redzoneSelected,
          };
        } else {
          state.error = true;
        }
        state.loading = false;
      })
      .catch((err) => {
        console.log("Error fetching user data:", err);
        state.error = true;
        state.loading = false;
      });
  }
});

const onSubmit = () => {
  if (!state.user.nome || !state.user.email || !state.user.idPapel) {
    state.invalid = true;
    return;
  }

  state.loading = true;
  const action = route.params.id ? "update" : "create";

  if (state.user.idPapel) {
    if (state.user.idPapel === 1) {
      state.user.areas = [];
      state.user.redzones = [];
    }
    if (state.user.idPapel === 2) {
      state.user.redzones = [];
    }
    if (state.user.idPapel === 3) {
      state.user.areas = [];
    }
  }

  if (action === "create") {
    User.create(state.user)
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
        console.log("Error submitting form:", err);
        state.error = true;
        state.loading = false;
      });
  } else if (action === "update") {
    User.update(route.params.id, state.user)
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
        console.log("Error submitting form:", err);
        state.error = true;
        state.loading = false;
      });
  }
};

const reset = () => {
  state.user = {
    areas: [],
    redzones: [],
    email: "",
    idPapel: undefined,
    nome: "",
  };
  state.invalid = false;
  state.error = false;
  state.loading = false;
  state.success = false;
  state.areas = [];
  state.redzones = [];
  state.papeis = [];
};

const goBack = () => {
  router.back();
};

const clearError = () => {
  state.invalid = false;
};
</script>

<template>
  <main class="userform">
    <LoadingBar :visible="state.loading" />
    <div class="userform-titulo-container">
      <div class="userform-backbtn">
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
          v-model="state.user.nome"
        ></v-text-field>
        <v-text-field
          @update:focused="clearError"
          :error-messages="state.invalid ? 'Campo obrigatório' : ''"
          :readonly="state.loading"
          variant="outlined"
          label="E-mail*"
          v-model="state.user.email"
        ></v-text-field>
        <v-select
          v-model="state.user.idPapel"
          :items="state.papeis"
          item-value="Id"
          item-text="Nome"
          item-title="Nome"
          label="Selecione um Papel de Permissão"
        ></v-select>
        <v-select
          v-if="state.user.idPapel && state.user.idPapel === 2"
          v-model="state.user.areas"
          :items="state.areas"
          item-value="Id"
          item-text="Nome"
          item-title="Nome"
          label="Selecione as áreas"
          multiple
        ></v-select>
        <v-select
          v-if="state.user.idPapel && state.user.idPapel === 3"
          v-model="state.user.redzones"
          :items="state.redzones"
          item-value="Id"
          item-text="Nome"
          item-title="Nome"
          label="Selecione as Redzones"
          multiple
        ></v-select>
      </div>
      <div class="userform-containerbtn">
        <Botao
          :disabled="state.loading"
          :content="route.params.id ? 'Editar' : 'Cadastrar'"
        />
      </div>
    </form>
  </main>
  <v-snackbar color="green" v-model="state.success">
    Usuário {{ route.params.id ? "editado" : "criado" }} com sucesso! Retornando
    à tela de listagem...
  </v-snackbar>
  <v-snackbar color="red" v-model="state.error">
    Um erro interno aconteceu. Tente novamente mais tarde.
  </v-snackbar>
</template>

<style scoped>
.v-select {
  color: var(--dark-blue);
}
.userform-backbtn {
  position: absolute;
  top: 74px;
  left: 0;
}
.userform {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  margin-bottom: 24px;
}
.userform-titulo-container {
  display: flex;
  width: 100%;
}
.userform .form {
  display: flex;
  flex-direction: column;
  margin-inline: 12px;
  width: 80%;
  max-width: 520px;
  gap: 12px;
}
.userform-containerbtn {
  display: flex;
  flex-direction: row-reverse;
}
</style>
