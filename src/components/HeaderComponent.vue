<script setup></script>

<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/images/logo.png" alt="Logo" />
    </div>

    <nav class="menu">
      <router-link to="/">INÍCIO</router-link>
      <router-link to="/prontuarios">PRONTUÁRIOS</router-link>
      <router-link to="/cadastro-residente">CADASTRO DE RESIDENTE</router-link>
      <router-link to="/login">ADMINISTRADOR</router-link>
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 10px 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
}

.logo img {
  height: 60px;
}

.menu {
  display: flex;
  gap: 30px;
}

.menu a {
  position: relative;
  text-decoration: none;
  color: #2e5d2e;
  font-weight: 600;
  font-size: 14px;
}

.menu a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%;
  height: 2px;
  background: #2e5d2e;
  transition: transform 0.25s ease;
}

.menu a:hover::after {
  transform: translateX(-50%) scaleX(1);
}
</style>