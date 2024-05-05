<script lang="ts">
import Botao from './Botao.vue';

export default {
  props: {
    visible: {
      required: true,
      type: Boolean,
    },
    message: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    msg_confirm: {
      required: true,
      type: String,
    },
    msg_cancel: {
      required: true,
      type: String,
    },
  },
  emits: ['onConfirm', 'OnUpdateModal'],
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
    <v-card prepend-icon="mdi-alert-circle-outline" :title="$props.title" :text="$props.message">
      <div class="confirmmodal-container">
        <Botao :content="$props.msg_confirm" color="alert" @click="$emit('onConfirm')" />
        <Botao :content="$props.msg_cancel" color="secondary" @click="$emit('OnUpdateModal', false)" />
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.confirmmodal-container {
  display: flex;
  gap: 16px;
  padding: 22px;
}
</style>