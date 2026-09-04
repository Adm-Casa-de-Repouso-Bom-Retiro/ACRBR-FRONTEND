<template>
  <div class="login-page">
    <main class="main-content">
      <div class="photo-side">
        <img :src="telaLogin" alt="Cuidadora com idoso" class="photo-img" />
      </div>

      <div class="form-side">
        <div class="login-card">
          <div class="avatar-circle">
            <img :src="iconeLogin" alt="Usuário" class="avatar-img" />
          </div>

          <h1 class="login-titulo">Entrar na conta</h1>
          <p class="login-sub">Acesse a área administrativa da ACRBR</p>

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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import iconeLogin from '@/assets/images/icone-login.png'
import telaLogin from '@/assets/images/tela-login.png'

const router = useRouter()

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

.login-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #2e5d2e 0%, #3c7039 100%);
  padding: 32px 20px;
}

.login-card {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.3);
  padding: 32px 26px;
}

.avatar-circle {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #e8f0e8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.avatar-img {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.login-titulo {
  color: #2e5d2e;
  font-size: 22px;
  font-weight: 800;
}

.login-sub {
  color: #6b7d6f;
  font-size: 13px;
  margin: 4px 0 18px;
}

.msg-erro {
  color: var(--erro);
  font-size: 13px;
  margin-bottom: 12px;
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
  text-align: left;
}

.form-label {
  font-size: 12px;
  font-weight: 700;
  color: #2e5d2e;
  margin-bottom: 6px;
  letter-spacing: 0.6px;
}

.form-input {
  width: 100%;
  height: 46px;
  border: 1.5px solid #d9d9d9;
  border-radius: 12px;
  background: #ffffff;
  padding: 0 14px;
  font-size: 14px;
  color: #1e3e1e;
  outline: none;
  font-family: inherit;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.form-input:focus {
  border-color: #8fbe4a;
  box-shadow: 0 0 0 3px rgba(143, 190, 74, 0.25);
}

.signup-text {
  font-size: 12.5px;
  color: #4a5f4e;
  margin-bottom: 20px;
  margin-top: 4px;
  text-align: center;
}

.signup-link {
  color: #6ba13f;
  font-weight: 700;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

.btn-entrar {
  width: 100%;
  background: #6ba13f;
  color: #ffffff;
  border: none;
  padding: 14px 0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.2s,
    transform 0.15s ease;
}

.btn-entrar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-entrar:hover:not(:disabled) {
  background: #7caf49;
  transform: translateY(-1px);
}

.photo-side {
  display: none;
}

.form-side {
  width: 100%;
}

/* ── DESKTOP: layout com foto ───────────────────────── */
@media (min-width: 768px) {
  .main-content {
    height: calc(100vh - 140px);
    min-height: 0;
    align-items: stretch;
    justify-content: stretch;
    padding: 0;
    background: transparent;
  }

  .photo-side {
    display: block;
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
    max-width: 340px;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
  }
}
</style>
