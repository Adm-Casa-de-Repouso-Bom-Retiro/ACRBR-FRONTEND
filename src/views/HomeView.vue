<template>
  <main class="home">
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <p class="hero-date">{{ dataExtenso }}</p>

          <h1 class="hero-title">
            {{ saudacao
            }}<template v-if="authStore.usuario">, {{ authStore.usuario.nome }}</template>
          </h1>

          <p class="hero-description">
            Cadastre, organize e acompanhe as informações dos residentes de forma prática e segura,
            apoiando a rotina de cuidados.
          </p>
        </div>

        <div class="hero-image-box">
          <span class="hero-ground" aria-hidden="true"></span>
          <img src="@/assets/images/idoso4k.png" alt="Casal de idosos" class="hero-image" />
        </div>
      </div>

      <svg class="hero-waves" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0,70 C240,130 480,20 720,60 C960,100 1200,10 1440,60 L1440,120 L0,120 Z"
          fill="rgba(255, 255, 255, 0.10)"
        />
        <path
          d="M0,100 C240,40 480,120 720,85 C960,50 1200,120 1440,80 L1440,120 L0,120 Z"
          fill="rgba(255, 255, 255, 0.18)"
        />
      </svg>
    </section>

    <section class="summary">
      <div class="summary-inner">
        <p v-if="store.error" class="error-message">{{ store.error }}</p>

        <div class="summary-grid">
          <div class="summary-card">
            <span class="summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                  stroke="#2F5A2B"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle cx="9" cy="7" r="4" stroke="#2F5A2B" stroke-width="1.7" />
              </svg>
            </span>
            <strong class="summary-value">
              {{ store.loading ? 'Carregando...' : store.residentes.length }}
            </strong>
            <span class="summary-label">Residentes ativos</span>
          </div>

          <div class="summary-card">
            <span class="summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
                  stroke="#2F5A2B"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 3v5h5"
                  stroke="#2F5A2B"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <strong class="summary-value">{{ store.loading ? 'Carregando...' : '—' }}</strong>
            <span class="summary-label">Prontuários atualizados hoje</span>
          </div>

          <div class="summary-card">
            <span class="summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect
                  x="3"
                  y="8"
                  width="18"
                  height="12"
                  rx="2"
                  transform="rotate(-45 12 14)"
                  stroke="#2F5A2B"
                  stroke-width="1.7"
                />
                <path
                  d="M8.5 11.5l4 4"
                  stroke="#2F5A2B"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <strong class="summary-value">{{ store.loading ? 'Carregando...' : '—' }}</strong>
            <span class="summary-label">Medicações do dia</span>
          </div>

          <div class="summary-card">
            <span class="summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 20h16v-4a8 8 0 0 0-16 0v4Z"
                  stroke="#2F5A2B"
                  stroke-width="1.7"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 8v4M10 10h4"
                  stroke="#2F5A2B"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <strong class="summary-value">
              {{ store.loading ? 'Carregando...' : aniversariantes }}
            </strong>
            <span class="summary-label">Aniversariantes do mês</span>
          </div>
        </div>
      </div>
    </section>

    <section class="quick-access">
      <div class="quick-inner">
        <h2 class="section-title">Acesso rápido</h2>

        <p v-if="store.loading" class="loading-message">Carregando residentes...</p>

        <div class="quick-cards">
          <router-link to="/prontuario" class="quick-card">
            <span class="quick-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"
                  stroke="#ffffff"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 3v5h5"
                  stroke="#ffffff"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <h3 class="quick-title">Prontuários</h3>
            <p class="quick-text">Consulte e acompanhe as informações dos residentes.</p>
            <span class="quick-link">Abrir →</span>
          </router-link>

          <router-link to="/cadastroresidente" class="quick-card">
            <span class="quick-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                  stroke="#ffffff"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle cx="9" cy="7" r="4" stroke="#ffffff" stroke-width="1.7" />
                <path
                  d="M19 8v6M16 11h6"
                  stroke="#ffffff"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <h3 class="quick-title">Cadastro de residente</h3>
            <p class="quick-text">Cadastre um novo residente de forma simples e segura.</p>
            <span class="quick-link">Cadastrar →</span>
          </router-link>

          <router-link to="/perfilfuncionario" class="quick-card">
            <span class="quick-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"
                  stroke="#ffffff"
                  stroke-width="1.7"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.5 12l1.8 1.8 3.5-3.6"
                  stroke="#ffffff"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <h3 class="quick-title">Administrador</h3>
            <p class="quick-text">Acesse o perfil e as configurações da conta.</p>
            <span class="quick-link">Acessar →</span>
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useResidentesStore } from '../stores/residentes.js'
import { useAuthStore } from '../stores/auth.js'

const store = useResidentesStore()
const authStore = useAuthStore()

const agora = new Date()

const dataExtenso = agora
  .toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  .toUpperCase()

const hora = agora.getHours()
const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

const aniversariantes = computed(() => {
  const mesAtual = new Date().getMonth() + 1

  return store.residentes.filter((residente) => {
    if (!residente.data_nascimento) return false

    const mes = Number(String(residente.data_nascimento).slice(5, 7))

    return mes === mesAtual
  }).length
})

onMounted(() => {
  store.fetchResidentes()

  if (authStore.estaLogado() && !authStore.usuario) {
    authStore.fetchUsuario()
  }
})
</script>

<style scoped>
.home {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f4f8f2;
}

/* ── HERO ─────────────────────────────────────────────── */
.hero {
  position: relative;
  overflow: hidden;
  background: #2f5a2b;
  padding: 48px 24px 140px 24px;
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
}

.hero-text {
  flex: 1;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.hero-date {
  margin: 0;
  color: #cfe0cd;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
}

.hero-title {
  margin: 0;
  color: #ffffff;
  font-size: 38px;
  font-weight: 800;
  line-height: 1.2;
}

.hero-description {
  margin: 0;
  color: #ffffff;
  font-size: 17px;
  line-height: 1.6;
}

.hero-image-box {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-ground {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 76%;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0) 70%);
  filter: blur(3px);
}

.hero-image {
  position: relative;
  z-index: 1;
  height: 340px;
  object-fit: contain;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.25));
}

.hero-waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 170px;
}

/* ── CARDS DE RESUMO ──────────────────────────────────── */
.summary {
  padding: 0 24px;
  margin-top: -120px;
  position: relative;
  z-index: 2;
}

.summary-inner {
  max-width: 1240px;
  margin: 0 auto;
}

.error-message {
  margin: 0 0 14px 0;
  padding: 10px 14px;
  background: #fbe9e9;
  border: 1px solid #e4b4b4;
  border-radius: 8px;
  color: #8a1f1f;
  font-size: 14px;
  font-weight: 700;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.summary-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 16px;
  padding: 26px 26px;
  box-shadow: 0 12px 30px rgba(31, 45, 28, 0.1);
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #e8f3dc;
}

.summary-icon svg {
  width: 28px;
  height: 28px;
}

.summary-value {
  color: #1f2d1c;
  font-size: 36px;
  font-weight: 800;
  line-height: 1.1;
}

.summary-label {
  color: #4a5a47;
  font-size: 14px;
  font-weight: 600;
}

/* ── ACESSO RÁPIDO ────────────────────────────────────── */
.quick-access {
  padding: 48px 24px 64px 24px;
}

.quick-inner {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0 0 8px 0;
  color: #1f2d1c;
  font-size: 24px;
  font-weight: 800;
}

.loading-message {
  margin: 0;
  color: #4a5a47;
  font-size: 14px;
}

.quick-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.quick-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  text-decoration: none;
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 14px;
  padding: 24px 26px;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.2s ease;
}

.quick-card:hover {
  transform: translateY(-4px);
  border-color: #3e7a2b;
  box-shadow: 0 14px 30px rgba(31, 45, 28, 0.14);
}

.quick-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #3e7a2b;
}

.quick-icon svg {
  width: 24px;
  height: 24px;
}

.quick-title {
  margin: 0;
  color: #1f2d1c;
  font-size: 18px;
  font-weight: 800;
}

.quick-text {
  margin: 0;
  color: #4a5a47;
  font-size: 14px;
  line-height: 1.6;
}

.quick-link {
  margin-top: 4px;
  color: #3e7a2b;
  font-size: 13px;
  font-weight: 800;
}

/* ── RESPONSIVO ───────────────────────────────────────── */
@media (max-width: 900px) {
  .hero {
    padding: 36px 20px 120px 20px;
  }

  .hero-inner {
    flex-direction: column;
    align-items: stretch;
    gap: 32px;
  }

  .hero-text {
    max-width: none;
    align-items: stretch;
  }

  .hero-title {
    font-size: 30px;
  }

  .hero-image {
    height: 240px;
    align-self: center;
  }

  .summary {
    margin-top: -90px;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
