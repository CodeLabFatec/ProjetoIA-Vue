<script lang="ts">
import type { PropType } from 'vue';

export default {
  props: {
    items: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  methods: {
    onSelect(item: string) {
      this.$emit('onSelect', item);
    }
  },
  emits: ['onSelect'],
}
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <button v-bind="props">
        <v-icon icon="mdi-dots-horizontal"></v-icon>
      </button>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in $props.items"
        :key="index"
        :value="index"
        @click="onSelect(item)"
      >
        <v-list-item-title>
          {{ item }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style>

</style>