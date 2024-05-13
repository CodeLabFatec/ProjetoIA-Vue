<script lang="ts">
import type { PropType } from 'vue';
import SeletorDataModal from './SeletorDataModal.vue';
export default {
  data():
  {
    modal: boolean,
    selectedDate: Date | Date[] | null
  } 
  {
    return {
      modal: false,
      selectedDate: null
    }
  },
  props: {
    label: String,
    value: Object as PropType<Date | Date[] | null>,
    width: {
      type: Number,
      default: 380
    },
  },
  components: {
    SeletorDataModal
  },
  methods: {
    updateModal() {
      this.modal = !this.modal;
    },
    presentDate(date: Date | Date[] | null) {
      if (date !== null) {
        if (Array.isArray(date)) {
          if (date[0] == null) {
            return 'dd/mm/aaaa'
          }
          return `${date[0].toLocaleDateString('pt-BR')} - ${date.length > 1 ? date[date.length - 1].toLocaleDateString('pt-BR') : ''}`
        } else {
          return date.toLocaleDateString('pt-BR')
        }
      } else {
        return 'dd/mm/aaaa'
      }
    },
    updateSelectedDate(date: Date | Date[] | null) {
      this.selectedDate = date;
      this.$emit('onChange', date);
    }
  },
  watch: {
    value(newValue) {
      this.selectedDate = newValue;
    }
  },
  emits: [
    'onChange'
  ]
}
</script>

<template>
  <button class="container" :style="{width: `${width}px`}"@click="updateModal()">
    <span class="label">{{ label }}</span>
    <span class="content">{{ presentDate(selectedDate) }}</span>
  </button>
  <SeletorDataModal 
    @on-confirm-selected-date="updateSelectedDate($event)"
    @update-modal="updateModal()" 
    :visible="modal" 
  />
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--light-gray);
  margin-block: 8px;
}

.label {
  font-weight: bold;
}

.content {
  padding: 8px;
  padding-left: 4px;
}
</style>