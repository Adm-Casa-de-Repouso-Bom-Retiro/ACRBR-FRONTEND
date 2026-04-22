<template>
  <div class="login-page">
    <div class="login-line"></div>
    <main class="main-content">
      <div class="photo-side">
        <img src="/src/assets/images/tela-login.png" alt="Cuidadora com idoso" class="photo-img" />
      </div>

      <div class="form-side">
        <div class="login-card">
          <div class="avatar-circle">
            <img src="/src/assets/images/icone-login.png" alt="Usuário" class="avatar-img" />
          </div>

          <p v-if="erro" class="msg-erro">{{ erro }}</p>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">E-MAIL:</label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="form-input"
                autocomplete="email"
                required
              />
            </div>

            <div class="form-group">
              <label for="senha" class="form-label">SENHA:</label>
              <input
                id="senha"
                v-model="senha"
                type="password"
                class="form-input"
                autocomplete="current-password"
                required
              />
            </div>

            <p class="signup-text">
              Novo funcionário?
              <router-link to="/cadastro" class="signup-link">Realizar cadastro.</router-link>
            </p>

            <button type="submit" class="btn-entrar" :disabled="carregando">
              {{ carregando ? 'AGUARDE...' : 'ENTRAR' }}
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'LoginView',

  data() {
    return {
      email: '',
      senha: '',
      erro: '',
      carregando: false,
    }
  },

  methods: {
    async handleLogin() {
      this.erro = ''
      this.carregando = true

      try {
        const response = await api.post('/token/', {
          email: this.email,
          password: this.senha,
        })

        // Salva os tokens no localStorage
        localStorage.setItem('access_token', response.data.access)
        localStorage.setItem('refresh_token', response.data.refresh)

        // Redireciona para a página inicial após login
        this.$router.push('/')
      } catch (error) {
        if (error.response && error.response.data) {
          const erros = error.response.data
          const primeiroErro = Object.values(erros)[0]
          this.erro = Array.isArray(primeiroErro) ? primeiroErro[0] : primeiroErro
        } else {
          this.erro = 'Erro ao fazer login. Tente novamente.'
        }
      } finally {
        this.carregando = false
      }
    },
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-line {
  width: 100%;
  height: 1.3vw;
  background: #2e5d2e;
}

.main-content {
  flex: 1;
  width: 100%;
  height: calc(100vh - 140px);
  display: flex;
}

.photo-side {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 2rem;
  background: #ffffff;
}

.login-card {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-img {
  width: 72px;
  height: 72px;
  object-fit: contain;
  display: flex;
  align-items: center;
  justify-content: center;
}

.msg-erro {
  color: #c0392b;
  font-size: 13px;
  margin-bottom: 10px;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 14px;
}

.form-label {
  font-size: 12px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  height: 30px;
  border: 1.5px solid #bbbbbb;
  border-radius: 3px;
  background: #ffffff;
  padding: 0 8px;
  font-size: 13px;
  color: #333333;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #2e5c2e;
}

.signup-text {
  font-size: 12.5px;
  color: #444444;
  margin-bottom: 1.5rem;
  margin-top: 4px;
  text-align: center;
}

.signup-link {
  color: #1a3f1a;
  font-weight: 700;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

.btn-entrar {
  background: #2e5c2e;
  color: #ffffff;
  border: none;
  padding: 10px 40px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s;
}

.btn-entrar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-entrar:hover:not(:disabled) {
  background: #1e3e1e;
}
</style>