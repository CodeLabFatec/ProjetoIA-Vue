<script setup lang="ts">
import Botao from "@/components/Botao.vue";
import Titulo from "@/components/Titulo.vue";
import Autenticacao from "@/services/Autenticacao";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const state = ref({
  actualPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  loading: false,
  errorMessage: undefined as string | undefined,
  success: false,
  error: false,
});

async function onSubmit() {
  if (
    state.value.newPassword === "" ||
    state.value.newPassword === " " ||
    state.value.actualPassword === "" ||
    state.value.actualPassword === " "
  ) {
    state.value.error = true;
    state.value.errorMessage = "Os campos devem ser preenchidos.";
    return;
  }

  if (state.value.confirmNewPassword !== state.value.newPassword) {
    state.value.error = true;
    state.value.errorMessage =
      "Os campos de Senha Nova e Confirmação Senha Nova devem ser diferentes.";
    return;
  }

  // buscar o id do usuário logado
  const userId = 16;
  state.value.errorMessage = undefined;
  state.value.error = false;

  state.value.loading = true;
  Autenticacao.updatePassword(
    userId,
    state.value.actualPassword,
    state.value.newPassword
  ).then((r) => {
    state.value.loading = false;
    if (r.status === 200) {
      state.value.success = true;
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } else {
      state.value.error = true;
      state.value.errorMessage = "Erro ao trocar a senha, tente novamente.";
    }
  });
}
</script>

<template>
  <main class="update-container">
    <Titulo content="Trocar senha" />
    <form @submit.prevent="onSubmit">
      <v-text-field
        v-model="state.actualPassword"
        label="Senha Atual"
        type="password"
        variant="outlined"
      />
      <v-text-field
        :disabled="state.loading"
        v-model="state.newPassword"
        label="Nova Senha"
        type="password"
        variant="outlined"
      />
      <v-text-field
        :disabled="state.loading"
        v-model="state.confirmNewPassword"
        label="Confirmação Nova Senha"
        type="password"
        variant="outlined"
      />
      <div class="button-container">
        <Botao :disabled="state.loading" :content="'Atualizar'" />
      </div>
    </form>
  </main>
  <v-snackbar color="green" v-model="state.success">
    Senha atualizada com sucesso!
  </v-snackbar>
  <v-snackbar color="red" v-model="state.error">
    {{ state.errorMessage }}
  </v-snackbar>
</template>
<style>
.update-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  margin-bottom: 24px;
}

form {
  display: flex;
  flex-direction: column;
  margin-inline: 12px;
  width: 80%;
  max-width: 520px;
  gap: 12px;
}

.button-container {
  display: flex;
  flex-direction: row-reverse;
}
</style>
