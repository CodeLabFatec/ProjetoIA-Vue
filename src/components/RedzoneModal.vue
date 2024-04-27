<script lang="ts">
import Botao from './Botao.vue';

import type { PropType } from 'vue';
import type IRedzone from '@/interfaces/IRedzone';

export default {
  props: {
    visible: {
      required: true,
      type: Boolean,
    },
    redzone: {
      type: Object as PropType<IRedzone | undefined>,
      default: undefined,
    },
  },
  emits: ['onDeleteRequest', 'onUpdateRequest', 'OnUpdateModal'],
  data() {
    return {
      dialog: this.visible,
    }
  },
  watch: {
    visible(newVal: boolean) {
      this.dialog = newVal;
    }
  },
  components: {
    Botao,
  },
}
</script>

<template>
  <v-dialog width="auto" v-model="dialog" @update:model-value="$emit('OnUpdateModal', $event)">
    <v-card max-width="600px">
      <div class="redzonemodal-title">
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            {{ $props.redzone?.nome || '' }}
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="$emit('OnUpdateModal', false)"
          >
          </v-btn>
        </v-card-title>
        <v-card-text>
          {{ `Criado em ${$props.redzone?.data}` }}
        </v-card-text>
      </div>
      <div class="redzonemodal-desc">
        {{ $props.redzone?.descricao }}
      </div>
      <div class="redzonemodal-btn-container">
        <Botao content="Excluir" color="alert" @click="$emit('onDeleteRequest')" />
        <Botao content="Editar" @click="$emit('onUpdateRequest')" />
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.redzonemodal-title{
  padding-inline: 4px;
}

.redzonemodal-btn-container {
  display: flex;
  flex-direction: row-reverse;
  gap: 16px;
  padding: 22px;
}

.redzonemodal-desc {
  padding-inline: 22px;
  text-align: justify
}
</style>