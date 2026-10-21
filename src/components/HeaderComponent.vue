<template>
  <header class="header">
    <div class="header-inner">
      <div class="brand">
        <img src="@/assets/images/logo.png" alt="" aria-hidden="true" />
      </div>

      <nav v-if="store.usuario || store.estaLogado()" class="menu">
        <router-link to="/">INÍCIO</router-link>
        <router-link to="/prontuario">PRONTUÁRIOS</router-link>
        <router-link to="/cadastroresidente" class="link-cadastro">
          + Cadastro de residente
        </router-link>
      </nav>

      <div v-if="store.usuario || store.estaLogado()" class="user">
        <router-link
          :to="{ name: 'perfilfuncionario' }"
          class="user-profile"
          aria-label="Ir para perfil do administrador"
        >
          <img
            v-if="store.usuario && store.usuario.foto_url"
            :src="store.usuario.foto_url"
            class="user-photo"
            :alt="'Foto de ' + (store.usuario.nome || '')"
          />
          <span v-else class="user-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z" fill="#2F5A2B" />
              <path
                d="M12 14.1c-3.5 0-7 1.76-7 5.25V21h14v-1.65c0-3.49-3.5-5.25-7-5.25Z"
                fill="#2F5A2B"
              />
            </svg>
          </span>
          <span class="user-name">{{ store.usuario ? store.usuario.nome : '' }}</span>
        </router-link>
        <div class="user-info">
          <button type="button" class="user-logout" @click="handleLogout">Sair</button>
        </div>
      </div>

      <div v-else class="auth-actions">
        <router-link to="/login" class="btn-auth btn-secondary">Entrar</router-link>
        <router-link to="/cadastro" class="btn-auth btn-primary">
          Cadastrar administrador
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const store = useAuthStore()

function handleLogout() {
  store.logout()
  router.push('/login')
}

watch(
  () => store.estaLogado(),
  (logado) => {
    if (logado && !store.usuario) {
      store.fetchUsuario()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #ffffff;
  border-bottom: 1px solid #dde7d8;
}

.header-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

/* ── MARCA ────────────────────────────────────────────── */
.brand {
  display: flex;
  align-items: center;
}

.brand img {
  height: 52px;
  width: auto;
}

/* ── MENU ─────────────────────────────────────────────── */
.menu {
  display: flex;
  align-items: center;
  gap: 26px;
}

.menu a {
  position: relative;
  text-decoration: none;
  color: #4a5a47;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.4px;
}

.menu a:hover {
  color: #2f5a2b;
}

.menu a::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #3e7a2b;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.menu a:hover::after,
.menu a.router-link-exact-active::after,
.menu a.router-link-active::after {
  transform: scaleX(1);
}

.menu a.router-link-exact-active,
.menu a.router-link-active {
  color: #2f5a2b;
}

.link-cadastro {
  background: #3e7a2b;
  color: #ffffff !important;
  padding: 10px 18px;
  border-radius: 8px;
  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.link-cadastro:hover {
  background: #2f5a2b;
  transform: translateY(-1px);
}

.link-cadastro::after {
  display: none;
}

/* ── AÇÕES DE AUTENTICAÇÃO ────────────────────────────── */
.auth-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-auth {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.btn-secondary {
  background: #ffffff;
  border: 1px solid #3e7a2b;
  color: #3e7a2b;
}

.btn-secondary:hover {
  background: #f2f7f0;
}

.btn-primary {
  background: #3e7a2b;
  border: 1px solid #3e7a2b;
  color: #ffffff;
}

.btn-primary:hover {
  background: #2f5a2b;
}

/* ── USUÁRIO ──────────────────────────────────────────── */
.user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  padding: 2px 4px;
  border-radius: 999px;
}

.user-avatar,
.user-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #dde7d8;
  flex-shrink: 0;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8f1e3;
}

.user-photo {
  object-fit: cover;
}

.user-avatar svg {
  width: 22px;
  height: 22px;
}

.user-profile.router-link-active .user-avatar,
.user-profile.router-link-active .user-photo {
  outline: 2px solid #3e7a2b;
  outline-offset: 2px;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  justify-content: center;
}

.user-name {
  color: #1f2d1c;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
}

.user-logout {
  align-self: flex-start;
  background: none;
  border: none;
  padding: 0;
  color: #3e7a2b;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 2px;
}

.user-logout:hover {
  text-decoration: underline;
}

/* ── RESPONSIVO ───────────────────────────────────────── */
@media (max-width: 900px) {
  .header-inner {
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
  }

  .menu {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
