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

          <p v-if="erro" class="error-message">{{ erro }}</p>

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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const senha = ref('')
const erro = ref('')
const carregando = ref(false)

async function handleLogin() {
  erro.value = ''
  carregando.value = true

  try {
    const response = await api.post('/token/', {
      email: email.value,
      password: senha.value,
    })

    localStorage.setItem('access_token', response.data.access)
    localStorage.setItem('refresh_token', response.data.refresh)

    await authStore.fetchUsuario()

    // Redireciona para a página do perfil do funcionário após o login //
    router.push('/perfilfuncionario')
  } catch (error) {
    if (error.response && error.response.data) {
      const erros = error.response.data
      const primeiroErro = Object.values(erros)[0]
      erro.value = Array.isArray(primeiroErro) ? primeiroErro[0] : primeiroErro
    } else {
      erro.value = 'Erro ao fazer login. Tente novamente.'
    }
  } finally {
    carregando.value = false
  }
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
  background: #2f5a2b;
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

.error-message {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px 14px;
  background: #fbe9e9;
  border: 1px solid #e4b4b4;
  border-radius: 8px;
  color: #8a1f1f;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
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
  color: #1f2d1c;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  height: 38px;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  background: #ffffff;
  padding: 0 12px;
  font-size: 14px;
  color: #1f2d1c;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #3e7a2b;
}

.form-input::placeholder {
  color: #8fa093;
}

.signup-text {
  font-size: 12.5px;
  color: #4a5a47;
  margin-bottom: 1.5rem;
  margin-top: 4px;
  text-align: center;
}

.signup-link {
  color: #3e7a2b;
  font-weight: 700;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

.btn-entrar {
  background: #3e7a2b;
  color: #ffffff;
  border: none;
  padding: 12px 40px;
  border-radius: 8px;
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
  background: #2f5a2b;
}
</style>
