<script setup>
import FooterComponent from './components/FooterComponent.vue';
import HeaderComponent from './components/HeaderComponent.vue';
</script>

<template>
  <div class="app-wrapper">
    <HeaderComponent />
    <main class="app-main">
      <router-view />
    </main>
    <FooterComponent />
  </div>
</template>

<style>
/* Reset global */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
}

#app {
  height: 100%;
}

/* Layout principal */
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>