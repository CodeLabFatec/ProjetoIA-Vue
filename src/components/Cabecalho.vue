<template>
  <v-app theme="">
    <v-navigation-drawer class="sidebar" v-model="isDrawerOpen">
      <div class="nav-icon-container">
        <v-app-bar-nav-icon @click="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
      </div>
      <v-list active-class="active-item">
        <v-list-item prepend-icon="mdi-home">Home</v-list-item>
        <v-list-group value="Redzones">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-plus-circle"
            >RedZones</v-list-item>
          </template>

          <v-list-item>Cadastro de áreas</v-list-item>
          <v-list-item>Cadastro de redzones</v-list-item>
          <v-list-item>Relatórios</v-list-item>
        </v-list-group>
        <v-list-item prepend-icon="mdi-account">Cadastros</v-list-item>
      </v-list>
    </v-navigation-drawer>

    <header class="container">
      <v-app-bar-nav-icon @click="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
      <img src="../assets/logo.png" alt="Altave" />
    </header>

    <slot></slot>
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      isDrawerOpen: false,
    };
  },
};
</script>

<style scoped>
.container {
  box-sizing: border-box;
  padding: 8px 16px;
  background-color: var(--gray);
  display: flex;
  align-items: center;
  color: white;
}

.container img {
  height: 52px;
  width: auto;
  margin-left: 8px;
}

.nav-icon-container {
  display: flex;
  align-items: center;
  justify-content: flex-end; 
  padding-right: 16px; 
}
.sidebar {
  background-color: var(--gray);
  color: white;
  display: flex;
  
}
</style>
