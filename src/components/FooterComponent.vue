<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-col footer-identity">
          <span class="footer-brand">ACRBR</span>
          <p class="footer-text">Sistema de gestão da Casa de Repouso Bom Retiro</p>
        </div>

        <span class="footer-divider" aria-hidden="true"></span>

        <div class="footer-col footer-center">
          <nav class="footer-nav" aria-label="Links rápidos">
            <router-link to="/">Início</router-link>
            <router-link to="/prontuario">Prontuários</router-link>
            <router-link to="/cadastroresidente">Cadastro de residente</router-link>
          </nav>
          <p class="footer-copy">© {{ ano }} ACRBR</p>
        </div>

        <p class="footer-version">Versão [0.0.0]</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const ano = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: #ffffff;
  border-top: 1px solid #dde7d8;
  box-shadow: 0 -4px 16px rgba(47, 90, 43, 0.06);
  font-family: inherit;
}

.footer-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 24px;
}

.footer-top {
  display: flex;
  align-items: center;
  gap: 24px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-brand {
  color: #2f5a2b;
  font-size: 22px;
  font-weight: 800;
}

.footer-text {
  margin: 0;
  color: #4a5a47;
  font-size: 13px;
  line-height: 1.5;
}

.footer-divider {
  width: 1px;
  min-height: 44px;
  align-self: stretch;
  background: #dde7d8;
}

.footer-center {
  flex: 1;
  gap: 4px;
}

.footer-nav {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-nav a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: #3e7a2b;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.footer-nav a:hover {
  color: #2f5a2b;
  text-decoration: underline;
}

.footer-copy,
.footer-version {
  margin: 0;
  color: #4a5a47;
  font-size: 12px;
}

@media (max-width: 900px) {
  .footer-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .footer-divider {
    display: none;
  }
}
</style>
