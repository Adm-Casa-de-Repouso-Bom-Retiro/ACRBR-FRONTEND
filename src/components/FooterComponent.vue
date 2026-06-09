<script setup></script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="left">
        <p>
          <span>Desenvolvido por:</span> Ana Paula Dominoni, Anna Flávia S. Carneiro, Emily V. D.
          Ropelato, Kelly P. Alves, Pietra G. S. Lavina
        </p>
      </div>

      <div class="divider"></div>

      <div class="center">
        <h2>ACRBR</h2>
      </div>

      <div class="divider"></div>

      <div class="right">
        <div class="links">
          <router-link to="/">INÍCIO</router-link>
          <router-link to="/prontuarios">PRONTUÁRIOS</router-link>
          <router-link to="/cadastro-residente">CADASTRO DE RESIDENTE</router-link>
          <router-link to="/login">ADMINISTRADOR</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #2e5d2e;
  padding: 55px 40px;
  color: #fff;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* colunas */
.left {
  width: 30%;
  font-size: 12px;
  line-height: 1.4;
}
.left span {
  font-weight: bold;
  font-size: 14px;
}

.center {
  width: 20%;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.right {
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.divider {
  width: 1.5px;
  height: 60px;
  background: #ffffff;
}

.links {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 5px;
}

.links a {
  text-decoration: none;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}
</style>
