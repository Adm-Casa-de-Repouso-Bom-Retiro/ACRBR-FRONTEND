<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-col footer-identity">
          <span class="footer-brand">ACRBR</span>
          <p class="footer-text">Sistema de gestão da Casa de Repouso Bom Retiro</p>
        </div>

        <nav class="footer-nav" aria-label="Links rápidos">
          <h2 class="footer-heading">Links rápidos</h2>
          <router-link to="/">Início</router-link>
          <router-link to="/prontuario">Prontuários</router-link>
          <router-link to="/cadastroresidente">Cadastro de residente</router-link>
          <router-link to="/perfilfuncionario">Administrador</router-link>
        </nav>

        <div class="footer-col footer-contact">
          <h2 class="footer-heading">Contato</h2>
          <p class="footer-text">[TELEFONE]</p>
          <p class="footer-text">[E-MAIL]</p>
          <p class="footer-text">[ENDEREÇO]</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copy">© {{ ano }} ACRBR</p>
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
  font-family: inherit;
}

.footer-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 40px 24px 24px 24px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 32px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-brand {
  color: #2f5a2b;
  font-size: 20px;
  font-weight: 800;
}

.footer-heading {
  margin: 0 0 4px 0;
  color: #1f2d1c;
  font-size: 14px;
  font-weight: 700;
}

.footer-text {
  margin: 0;
  color: #4a5a47;
  font-size: 14px;
  line-height: 1.5;
}

.footer-nav {
  display: flex;
  flex-direction: column;
}

.footer-nav a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: #3e7a2b;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.footer-nav a:hover {
  text-decoration: underline;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid #dde7d8;
}

.footer-copy,
.footer-version {
  margin: 0;
  color: #4a5a47;
  font-size: 13px;
}

@media (max-width: 900px) {
  .footer-top {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
