<script setup lang="ts">
</script>

<template>
  <main class="container">
    <div class="img-container">
      <h1>MONITORAMENTO INTELIGENTE PARA <b>REDZONES</b></h1>
    </div>
    <div class="content-container">
      <slot></slot>
    </div>
  </main>
</template>

<style scoped>
  .container {
    display: flex;
  }

  .img-container .content-container {
    flex: 1;
  }

  .img-container {
    height: 100vh;
    box-sizing: content-box;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('@/assets/external-banner.png');
    background-size: cover;
    width: 50%;
  }
  
  .img-container h1 {
    color: white;
    max-width: 500px;
    text-align: center;
  }
  
  .img-container h1 b {
    color: var(--blue);
  }
  
  .content-container {
    width: 50%;
    background-color: var(--gray);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>