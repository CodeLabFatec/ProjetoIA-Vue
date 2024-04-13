<script lang="ts">
import Botao from './Botao.vue';
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    updateModal() {
      this.$emit('updateModal')
    },
    changeMode(mode: 'default' | 'range') {
      this.selectMode = mode;
      this.selectedDate = null;
    },
    presentDate(date: Date | string[] | null) {
      if (date !== null) {
        const convertString = (text: string) => {
          return new Date(text).toLocaleDateString('pt-BR')
        }

        if (Array.isArray(date)) {
          if (date[0] == null) {
            return 'Selecione uma data'
          }
          return `${convertString(date[0])} - ${date.length > 1 ? convertString(date[date.length - 1]) : ''}`
        } else {
          return date.toLocaleDateString('pt-BR')
        }
      } else {
        return 'Selecione uma data'
      }
    },
    formatDateArray(list: string[]) {
      return [
        new Date(list[0]),
        new Date(list[list.length - 1]),
      ]
    },
    confirmSelectedDate() {
      this.$emit('onConfirmSelectedDate', Array.isArray(this.selectedDate) ? this.formatDateArray(this.selectedDate) : this.selectedDate);
      this.dialog = false;
      this.updateModal();
    }
  },
  watch: {
    visible(newVal) {
      this.dialog = newVal;
    },
  },
  data(): { 
    dialog: boolean; 
    selectMode: string; 
    selectedDate: Date | string[] | null 
  } {
    return {
      dialog: this.visible,
      selectMode: 'default',
      selectedDate: null
    };
  },
  emits: [
    'updateModal',
    'onConfirmSelectedDate'
  ],
  components: {
    Botao
  }
}
</script>

<template>
  <v-dialog width="auto" v-model="dialog" @update:model-value="updateModal()">
    <div class="container">
      <div class="container-btn">
        <button @click="changeMode('default')" :class="['btn-select', { selected: selectMode == 'default' }]">
          Dia único
        </button>
        <button @click="changeMode('range')" :class="['btn-select', { selected: selectMode == 'range' }]">
          Período
        </button>
      </div>
      <div class="date-container">
        <span class="label">Data selecionada</span>
        <span class="date">
          {{ presentDate(selectedDate) }}
        </span>
      </div>
      <v-date-picker :border="false" v-model="selectedDate" :hide-header="true"
        :multiple="selectMode == 'range' ? selectMode : false"></v-date-picker>
      <Botao
        :disabled="
        (selectMode == 'range' && selectedDate !== null && Array.isArray(selectedDate) && selectedDate.length < 2) ||
        (selectedDate == null)"
        :content="selectMode == 'range' ? 'Selecionar período' : 'Selecionar data'" 
        @click="confirmSelectedDate()"
      />
    </div>
  </v-dialog>
</template>

<style scoped>
.container {
  background-color: white;
  padding: 18px 32px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  /* gap: 24px */
}

.container-btn {
  display: flex;
  margin-bottom: 24px;
}

.btn-select {
  flex: 1;
  transition: all 0.25s;
  color: var(--light-gray-100)
}

.btn-select:first-child {
  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: var(--light-gray-100);
}

.selected {
  color: var(--blue);
  font-weight: bold;
}

.date-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-weight: bold;
}

.date {
  border-bottom: 1px solid var(--blue);
  padding-block: 8px;
  padding-inline: 12px;
}
</style>