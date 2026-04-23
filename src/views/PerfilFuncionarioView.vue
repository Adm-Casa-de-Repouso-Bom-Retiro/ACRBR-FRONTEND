<script>
import api from '@/services/api'

export default {
  name: 'PerfilView',

  data() {
    return {
      administrador: {},
    }
  },

  computed: {
    cargoFormatado() {
      const cargos = {
        chefe: 'Chefe',
        gerente: 'Gerente',
        nutricionista: 'Nutricionista',
        cuidador: 'Cuidador',
      }
      return cargos[this.administrador.cargo] || this.administrador.cargo || '...'
    },
  },

  async created() {
    try {
      const response = await api.get('/administradores/me/')
      this.administrador = response.data
    } catch (error) {
      // O Token está inválido ou expirou — o usuário será redirecionado para o login //
      this.$router.push('/login')
    }
  },

  methods: {
    sair() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      this.$router.push('/login')
    },
  },
}
</script>

<template>
  <div class="perfil-page">
    <div class="top-line"></div>

    <main class="main-content">
      <div class="perfil-card">

        <div class="avatar-section">
          <div class="avatar-circle">
           <img src="/src/assets/images/icone-login.png" alt="Foto de perfil" class="avatar-img" />
          </div>
          <h1 class="nome">{{ administrador.nome || '...' }}</h1>
          <p class="cargo">Cargo: {{ cargoFormatado }}</p>
        </div>

        <div class="info-section">
          <div class="info-item">
            <span class="info-label">E-MAIL:</span>
            <span class="info-valor">{{ administrador.email || '...' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">TELEFONE:</span>
            <span class="info-valor">{{ administrador.telefone || '...' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">DATA DE REGISTRO:</span>
            <span class="info-valor">{{ administrador.data_registro || '...' }}</span>
          </div>

          <div class="botoes">
            <button class="btn-editar" @click="$router.push('/editar-perfil')">EDITAR CONTA</button>
            <button class="btn-sair" @click="sair">SAIR DA CONTA</button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.top-line {
  width: 100%;
  height: 1.3vw;
  background: #1e3e1e;
}

.main-content {
  height: calc(100vh - 140px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.perfil-card {
  width: 60vw;
  border: 2px solid #1e3e1e;
  border-radius: 12px;
  padding: 75px;
  display: flex;
  gap: 50px;
  align-items: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 180px;
}


.avatar-img {
  width: 92px;
  height: 92px;
  object-fit: contain;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nome {
  font-size: 18px;
  font-weight: bold;
  color: #1e3e1e;
  text-align: center;
}

.cargo {
  font-size: 16px;
  color: #555;
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 15px;
  font-weight: bold;
  color: #1e3e1e;
}

.info-valor {
  font-size: 15px;
  color: #333;
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
}

.botoes {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}

.btn-editar {
  background: #1e3e1e;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
}

.btn-editar:hover {
  background: #163216;
}

.btn-sair {
  background: transparent;
  color: #1e3e1e;
  border: 2px solid #1e3e1e;
  padding: 10px 24px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
}

.btn-sair:hover {
  background: #f0f0f0;
}
</style>