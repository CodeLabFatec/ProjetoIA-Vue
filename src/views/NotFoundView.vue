<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const back = () => {
  router.go(-1);
}
</script>

<template>
<main class="main">
  <h1>404</h1>
  <h2>Página não encontrada.</h2>
  <v-btn @click="back" color="#004488">Voltar</v-btn>
</main>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  gap: 24px;
}

.main h1 {
  font-size: 94px;
}
</style>