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
      }

      if (tel.length === 10) {
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
            <span class="info-valor">
              {{ administrador.email || '...' }}
            </span>
          </div>

          <div class="info-item">
            <span class="info-label">TELEFONE:</span>
            <span class="info-valor">
              {{ telefoneFormatado }}
            </span>
          </div>

          <div class="info-item">
            <span class="info-label">DATA DE REGISTRO:</span>
            <span class="info-valor">
              {{ dataFormatada }}
            </span>
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
  background: #2e5d2e;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 20px;
}

.perfil-card {
  width: 100%;
  max-width: 70vw;
  min-height: 450px;

  border: 3px solid #3a7d44;
  border-radius: 12px;

  padding: 28px 36px 24px 36px;

  display: flex;
  gap: 40px;
  align-items: center;
}

.divider {
  width: 1px;
  align-self: stretch;
  background: #d0d0d0;
  flex-shrink: 0;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-width: 220px;
  gap: 10px;
}

.avatar-circle {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 110px;
  height: 110px;
  object-fit: contain;
}

.nome {
  font-size: 20px;
  font-weight: bold;
  color: #1e3e1e;
  text-align: center;
  margin: 0;
}

.cargo {
  font-size: 15px;
  color: #555;
  text-align: center;
  margin: 0;
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  font-weight: 700;
  color: #1e3e1e;
  letter-spacing: 0.6px;
}

.info-valor {
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
}

.botoes {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.btn-editar {
  background: #1e3e1e;
  color: white;
  border: none;
  padding: 10px 22px;
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
  padding: 10px 22px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.btn-sair:hover {
  background: #f0f0f0;
}

@media (max-width: 768px) {
  .perfil-card {
    max-width: 95vw;
    flex-direction: column;
    gap: 24px;
  }

  .divider {
    width: 100%;
    height: 1px;
  }

  .avatar-section {
    min-width: auto;
  }

  .botoes {
    flex-direction: column;
  }

  .btn-editar,
  .btn-sair {
    width: 100%;
  }
}
</style>
```
