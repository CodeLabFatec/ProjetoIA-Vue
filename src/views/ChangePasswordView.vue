<script setup lang="ts">
import ExternalContainer from '@/components/ExternalContainer.vue'
import Autenticacao from '@/services/Autenticacao';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const SUCCESS_STATUS = 200;
const NOTFOUND_STATUS = 404;
const UNAUTH_STATUS = 401;

const router = useRouter();

const state = ref({
  loading: false,
  error: {
    not_found: false,
    code_incorrect: false,
    no_code: false,
    pword_dont_match: false,
    server: false,
  },
  success: false,
  email: '',
  senha: '',
  confirmar_senha: '',
  codigo: '',
  step: 1,
  step_phrase: [
    '1. Digite seu e-mail',
    '2. Digite o código enviado em seu e-mail',
    '3. Digite a nova senha',
  ]
});

const clearErrors = () => {
  for (let key in state.value.error) {
    if (key in state.value.error) {
      (state.value.error as Record<string, boolean>)[key] = false;
    }
  }
}

const submitEmail = () => {
  Autenticacao.submitEmail(state.value.email)
    .then(res => {
      if (res.status == SUCCESS_STATUS) {
        state.value.step = 2;
      } else if (res.status == NOTFOUND_STATUS) {
        state.value.error.not_found = true;
      } else {
        state.value.error.server = true;
      }
    })
    .catch(err => {
      console.log(err);
      state.value.error.server = true;
    })
    .finally(() => {
      state.value.loading = false;
    });
}

const changePassword = () => {
  if (state.value.codigo) {
    if (state.value.senha == state.value.confirmar_senha) {
      Autenticacao.changePassword(state.value.codigo, state.value.senha)
      .then(res => {
        if (res.status == SUCCESS_STATUS) {
          state.value.success = true;
          setTimeout(() => {
            router.push('/auth');
          }, 3000);
        } else if (res.status == UNAUTH_STATUS) {
          state.value.error.code_incorrect = true;
        } else {
          state.value.error.server = true;
        }
      })
      .catch(err => {
        console.log(err);
        state.value.error.server = true;
      })
      .finally(() => {
        state.value.loading = false;
      });
    } else {
      state.value.error.pword_dont_match = true;
    }
  } else {
    state.value.error.no_code = true;
  }
  state.value.loading = false;
}

const goNextStep = () => {
  clearErrors();
  state.value.loading = true;
  switch (state.value.step) {
    case 1:
      submitEmail();
      break;
    case 2:
      changePassword();
      break;
  }
}

</script>

<template>
  <v-theme-provider theme="dark" with-background>
    <ExternalContainer>
      <div class="main">
        <h1 class="title">
          Esqueci minha senha
        </h1>
        <span class="desc">{{ state.step_phrase[state.step - 1] }}</span>
        <form @submit.prevent="goNextStep" class="form" v-if="state.step == 1">
          <v-text-field class="input" :disabled="state.loading" :error="state.error.not_found" label="E-mail"
            variant="outlined" v-model="state.email" type="email" required></v-text-field>
          <v-btn type="submit" color="#003365" :loading="state.loading">Continuar</v-btn>
        </form>
        <form @submit.prevent="goNextStep" class="form" v-if="state.step == 2">
          <v-otp-input :error="state.error.no_code || state.error.code_incorrect" v-model="state.codigo"></v-otp-input>
          <span class="desc" style="margin-top: 24px; margin-bottom: 32px;" v-if="state.step == 2">{{
          state.step_phrase[2] }}</span>
          <v-text-field :disabled="state.loading" :error="state.error.pword_dont_match" class="input" label="Senha"
            variant="outlined" v-model="state.senha" type="password" required></v-text-field>
          <v-text-field :disabled="state.loading" :error="state.error.pword_dont_match" class="input"
            label="Confirmar senha" variant="outlined" v-model="state.confirmar_senha" type="password"
            required></v-text-field>
          <v-btn type="submit" color="#003365" :loading="state.loading">Enviar</v-btn>
        </form>
        <span class="error-warning" v-if="state.error.code_incorrect">
          Código incorreto.
        </span>
        <span class="error-warning" v-if="state.error.not_found">
          E-mail não encontrado.
        </span>
        <span class="error-warning" v-if="state.error.pword_dont_match">
          A senha em ambos os campos devem ser iguais
        </span>
        <span class="error-warning" v-if="state.error.server">
          Erro interno do servidor, <br> tente novamente mais tarde.
        </span>
        <span class="error-warning" v-if="state.error.no_code">
          Insira o código enviado por e-mail.
        </span>
        <span class="success-warning" v-if="state.success">
          Senha alterada! Voltando à tela de login...
        </span>
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

.title {
  color: var(--white);
}

.form {
  width: 70%;
  display: flex;
  flex-direction: column;

}

.form .input {
  widows: 70%;
}

.desc {
  color: var(--light-gray-200);
  text-align: center;
}

.error-warning {
  color: rgb(255, 124, 124);
  text-align: center;
}

.success-warning {
  color: rgb(47, 170, 47);
}
</style>