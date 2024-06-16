<script setup lang="ts">
import ExternalContainer from "@/components/ExternalContainer.vue";
import Autenticacao from "@/services/Autenticacao";
import { usuarioStore } from "@/stores/usuarioStore";
import getStorage from "@/utils/getStorage";
import removeStorage from "@/utils/removeStorage";
import saveStorage from "@/utils/saveStorage";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const SUCCESS_STATUS = 200;
const UNAUTH_STATUS = 403;

const router = useRouter();

const userStore = usuarioStore();

const state = ref({
  email: "",
  senha: "",
  error: false,
  serverError: false,
  loading: false,
});

const submit = () => {
  state.value.loading = true;
  const { email, senha } = state.value;
  Autenticacao.login({ email, senha })
    .then((res) => {
      const { data, status } = res;
      if (status == SUCCESS_STATUS && data) {
        saveStorage("usuario", data);
        userStore.setUsuario(data);
        const path = getStorage("toPath", "session") as { toPath: string };
        router.push(path ? path.toPath : "/");
        removeStorage("toPath", "session");
      } else if (status == UNAUTH_STATUS) {
        state.value.error = true;
      } else {
        state.value.serverError = true;
      }
    })
    .catch((err) => {
      if (err.response.status == UNAUTH_STATUS) {
        state.value.error = true;
      } else {
        console.log(err);
        state.value.serverError = true;
      }
    })
    .finally(() => {
      state.value.loading = false;
    });
};

const goToChangePassword = () => {
  router.push("/recover-password");
};

const onFocus = () => {
  state.value.error = false;
  state.value.serverError = false;
};

onMounted(() => {
  if (userStore.usuario) {
    router.push("/");
  }
});
</script>

<template>
  <v-theme-provider theme="dark" with-background>
    <ExternalContainer>
      <div class="main">
        <h1 class="title">Login</h1>
        <form @submit.prevent="submit" class="form">
          <v-text-field
            :disabled="state.loading"
            @update:focused="onFocus"
            :error="state.error"
            class="input"
            label="E-mail"
            variant="outlined"
            v-model="state.email"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            :disabled="state.loading"
            :error="state.error"
            @update:focused="onFocus"
            class="input"
            label="Senha"
            variant="outlined"
            v-model="state.senha"
            type="password"
            required
          ></v-text-field>
          <div class="btns">
            <button
              type="button"
              :disabled="state.loading"
              @click="goToChangePassword"
            >
              Esqueci minha senha
            </button>
            <v-btn type="submit" color="#003365" :loading="state.loading"
              >Entrar</v-btn
            >
            <span class="error-warning" v-if="state.error"
              >Email/senha incorretos.</span
            >
            <span class="error-warning" v-if="state.serverError"
              >Erro interno do servidor, <br />
              tente novamente mais tarde.</span
            >
          </div>
        </form>
      </div>
    </ExternalContainer>
  </v-theme-provider>
</template>

<style scoped>
.main {
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
}

.form {
  width: 70%;
}

.btns {
  margin: auto;
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  color: var(--white);
}

.error-warning {
  color: rgb(255, 124, 124);
  text-align: center;
}
</style>
@/utils/saveStorage
