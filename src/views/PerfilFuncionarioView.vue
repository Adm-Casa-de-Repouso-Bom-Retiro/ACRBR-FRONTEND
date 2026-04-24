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

    telefoneFormatado() {
      const tel = (this.administrador.telefone || '').replace(/\D/g, '')
      if (tel.length === 11) {
        return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`
      } else if (tel.length === 10) {
        return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`
      }
      return this.administrador.telefone || '...'
    },

    dataFormatada() {
      const data = this.administrador.data_registro
      if (!data) return '...'
      const [ano, mes, dia] = data.split('-')
      return `${dia}/${mes}/${ano}`
    },
  },
  async created() {
    try {
      const response = await api.get('/administradores/me/')
      this.administrador = response.data
    } catch (error) {
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
        <div class="divider"></div>
        <div class="info-section">
          <div class="info-item">
            <span class="info-label">E-MAIL:</span>
            <span class="info-valor">{{ administrador.email || '...' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">TELEFONE:</span>
            <span class="info-valor">{{ telefoneFormatado }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">DATA DE REGISTRO:</span>
            <span class="info-valor">{{ dataFormatada }}</span>
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
  height: 6px;
  background: #1e3e1e;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  min-height: calc(100vh - 146px); /* header ~80px + top-line 6px + footer ~60px */
}

.perfil-card {
  width: min(700px, 90vw);
  border: 2px solid #1e3e1e;
  border-radius: 16px;
  padding: 40px 48px;
  display: flex;
  gap: 40px;
  align-items: center;
}

/* ── DIVISOR VERTICAL ─────────────────────────────────── */
.divider {
  width: 1px;
  align-self: stretch;
  background: #d0d0d0;
  flex-shrink: 0;
}

/* ── AVATAR ───────────────────────────────────────────── */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 150px;
}

.avatar-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.nome {
  font-size: 16px;
  font-weight: bold;
  color: #1e3e1e;
  text-align: center;
}

.cargo {
  font-size: 14px;
  color: #555;
  text-align: center;
}

/* ── INFO ─────────────────────────────────────────────── */
.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 13px;
  font-weight: bold;
  color: #1e3e1e;
}

.info-valor {
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #ccc;
  padding-bottom: 6px;
}

/* ── BOTÕES ───────────────────────────────────────────── */
.botoes {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.btn-editar {
  background: #1e3e1e;
  color: white;
  border: none;
  padding: 9px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.btn-editar:hover {
  background: #163216;
}

.btn-sair {
  background: transparent;
  color: #1e3e1e;
  border: 2px solid #1e3e1e;
  padding: 9px 20px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.btn-sair:hover {
  background: #f0f0f0;
}
</style>