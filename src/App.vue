<script setup lang="ts">
import { RouterView } from 'vue-router'
import Cabecalho from './components/Cabecalho.vue';
import { onMounted } from 'vue';
import { usuarioStore } from './stores/usuarioStore';
import getStorage from './utils/getStorage';
import type { ILoginResponse } from './interfaces/ILoginResponse';

const {usuario, setUsuario} = usuarioStore();

onMounted(() => {
  if (!usuario) {
    const local_user = getStorage('usuario') as ILoginResponse;
    setUsuario(local_user);
  }
});
</script>

<template>
  <Cabecalho>
    <RouterView />
  </Cabecalho>
</template>

<style scoped>
/*  */
</style>