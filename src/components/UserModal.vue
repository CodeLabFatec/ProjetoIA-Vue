<script lang="ts">
import Botao from "./Botao.vue";

import type { PropType } from "vue";
import type IUser from "@/interfaces/IUser";

export default {
  props: {
    visible: {
      required: true,
      type: Boolean,
    },
    user: {
      type: Object as PropType<IUser | undefined>,
      default: undefined,
    },
  },
  emits: ["onDeleteRequest", "onUpdateRequest", "OnUpdateModal"],
  data() {
    return {
      dialog: this.visible,
    };
  },
  watch: {
    visible(newVal: boolean) {
      this.dialog = newVal;
    },
  },
  components: {
    Botao,
  },
};
</script>

<template>
  <v-dialog
    width="auto"
    v-model="dialog"
    @update:model-value="$emit('OnUpdateModal', $event)"
  >
    <v-card max-width="600px">
      <div class="areamodal-title">
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            {{ $props.user?.nome || "" }}
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="$emit('OnUpdateModal', false)"
          >
          </v-btn>
        </v-card-title>
      </div>
      <div class="areamodal-desc">
        {{ $props.user?.email }}
      </div>
      <div class="areamodal-btn-container">
        <Botao
          content="Excluir"
          color="alert"
          @click="$emit('onDeleteRequest')"
        />
        <Botao content="Editar" @click="$emit('onUpdateRequest')" />
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.areamodal-title {
  padding-inline: 4px;
}

.areamodal-btn-container {
  display: flex;
  flex-direction: row-reverse;
  gap: 16px;
  padding: 22px;
}

.areamodal-desc {
  padding-inline: 22px;
  text-align: justify;
}
</style>
