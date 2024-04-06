<script setup lang="ts">
import type { ISelectedDate } from '@/interfaces/ISelectedDate';

import { ref } from 'vue';

import Titulo from '@/components/Titulo.vue';
import Botao from '@/components/Botao.vue';
import SeletorData from '@/components/SeletorData.vue';

const selectedDate = ref<ISelectedDate>(null);

const submit = () => {
  console.log('submit')
}

const onChange = (date: ISelectedDate) => {
  selectedDate.value = date;
}


const reset = () => {
  selectedDate.value = null;
}

</script>

<template>
  <main class='main'>
    <Titulo content="Relatórios" />
    <div class="fields-container">
      <SeletorData 
        label="Selecione uma data"
        :value="selectedDate"
        @on-change="onChange($event)"
      />
    </div>
    <div class="btn-container">
      <Botao @click="submit()" class="btn" content="Download Relatório" />
    </div>
  </main>
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  gap: 24px
}

.fields-container {
  display: flex;
  justify-content: center;
}

.btn-container {
  display: flex;
  justify-content: center;
}

.btn {
  padding-inline: 52px;
}
</style>