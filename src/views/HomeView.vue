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
        <p v-if="anotacoesStore.error" class="error-message">{{ anotacoesStore.error }}</p>
        <p v-if="aplicacoesStore.error" class="error-message">{{ aplicacoesStore.error }}</p>

        <div class="summary-grid">
          <button
            type="button"
            class="summary-card summary-card-clickable"
            @click="abrirModal('residentes')"
          >
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
          </button>

          <button
            type="button"
            class="summary-card summary-card-clickable"
            @click="abrirModal('prontuarios')"
          >
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
            <strong class="summary-value">
              {{ store.loading || anotacoesStore.loading ? 'Carregando...' : prontuariosHoje }}
            </strong>
            <span class="summary-label">Prontuários atualizados hoje</span>
          </button>

          <button
            type="button"
            class="summary-card summary-card-clickable"
            @click="abrirModal('medicacoes')"
          >
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
            <strong class="summary-value">
              {{
                aplicacoesStore.loading || anotacoesStore.loading ? 'Carregando...' : medicacoesHoje
              }}
            </strong>
            <span class="summary-label">Medicações do dia</span>
          </button>

          <button
            type="button"
            class="summary-card summary-card-clickable"
            @click="abrirModal('aniversariantes')"
          >
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
          </button>
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

    <div v-if="modalAberto" class="modal-overlay" @click.self="fecharModal">
      <section
        class="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-resumo-title"
      >
        <header class="modal-header">
          <h2 id="modal-resumo-title" class="section-title">{{ tituloModal }}</h2>
          <button type="button" class="modal-close" aria-label="Fechar" @click="fecharModal">
            ×
          </button>
        </header>

        <p v-if="modalErro" class="error-message">{{ modalErro }}</p>

        <p v-if="modalCarregando" class="loading-message">Carregando...</p>

        <template v-else>
          <div v-if="modalAberto === 'residentes'" class="modal-section">
            <p v-if="!residentesAtivos.length" class="empty-message">
              Nenhum residente cadastrado.
            </p>

            <ul v-else class="modal-list">
              <li v-for="residente in residentesAtivos" :key="residente.id" class="modal-list-item">
                <div class="modal-list-info">
                  <strong class="modal-list-title">{{ residente.nome_completo }}</strong>
                  <span class="modal-list-meta">
                    Quarto {{ residente.quarto || '—' }}
                    <template v-if="residente.grau_dependencia">
                      · {{ rotuloGrau(residente.grau_dependencia) }}
                    </template>
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div v-else-if="modalAberto === 'prontuarios'" class="modal-section">
            <p v-if="!residentesAtualizadosHoje.length" class="empty-message">
              Nenhum prontuário atualizado hoje.
            </p>

            <ul v-else class="modal-list">
              <li
                v-for="residente in residentesAtualizadosHoje"
                :key="residente.id"
                class="modal-list-item"
              >
                <div class="modal-list-info">
                  <strong class="modal-list-title">{{ residente.nome_completo }}</strong>
                  <span class="modal-list-meta">{{ residente.motivo }}</span>
                </div>
              </li>
            </ul>
          </div>

          <div v-else-if="modalAberto === 'medicacoes'" class="modal-section">
            <div class="modal-subsection">
              <h3 class="modal-subtitle">Aplicações de medicamentos</h3>

              <p v-if="!aplicacoesHoje.length" class="empty-message">
                Nenhuma aplicação prevista para hoje.
              </p>

              <ul v-else class="modal-list">
                <li v-for="aplicacao in aplicacoesHoje" :key="aplicacao.id" class="modal-list-item">
                  <div class="modal-list-info">
                    <strong class="modal-list-title">
                      {{ aplicacao.medicamento_nome || 'Medicamento' }}
                    </strong>
                    <span class="modal-list-meta">
                      {{ horaAplicacao(aplicacao.data_hora_prevista) }}
                      <template v-if="aplicacao.dosagem"> · {{ aplicacao.dosagem }}</template>
                      <template v-if="aplicacao.residente_nome">
                        · {{ aplicacao.residente_nome }}
                      </template>
                    </span>
                  </div>

                  <span class="modal-list-status" :class="statusAplicacao(aplicacao).classe">
                    {{ statusAplicacao(aplicacao).rotulo }}
                  </span>
                </li>
              </ul>
            </div>

            <div class="modal-subsection">
              <h3 class="modal-subtitle">Medicações do calendário</h3>

              <p v-if="!medicacoesCalendarioHoje.length" class="empty-message">
                Nenhuma medicação registrada no calendário hoje.
              </p>

              <ul v-else class="modal-list">
                <li
                  v-for="anotacao in medicacoesCalendarioHoje"
                  :key="anotacao.id"
                  class="modal-list-item"
                >
                  <div class="modal-list-info">
                    <strong class="modal-list-title">{{ anotacao.titulo }}</strong>
                    <span class="modal-list-meta">
                      {{ horaAnotacao(anotacao.hora) }} · {{ nomeResidente(anotacao.residente) }}
                    </span>
                  </div>

                  <span
                    class="modal-list-status"
                    :class="obterStatusAnotacao(anotacao.status).classe"
                  >
                    {{ obterStatusAnotacao(anotacao.status).rotulo }}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div v-else-if="modalAberto === 'aniversariantes'" class="modal-section">
            <p v-if="!aniversariantesLista.length" class="empty-message">
              Nenhum aniversariante neste mês.
            </p>

            <ul v-else class="modal-list">
              <li
                v-for="residente in aniversariantesLista"
                :key="residente.id"
                class="modal-list-item"
              >
                <div class="modal-list-info">
                  <strong class="modal-list-title">{{ residente.nome_completo }}</strong>
                  <span class="modal-list-meta">
                    Aniversário em {{ diaMesNascimento(residente) }}
                  </span>
                </div>

                <span class="modal-list-badge">{{ diaMesNascimento(residente) }}</span>
              </li>
            </ul>
          </div>
        </template>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useResidentesStore } from '../stores/residentes.js'
import { useAnotacoesStore } from '../stores/anotacoes.js'
import { useAplicacoesStore } from '../stores/aplicacoes.js'
import { useAuthStore } from '../stores/auth.js'
import { obterStatusAnotacao } from '@/constants/anotacoes'

const store = useResidentesStore()
const anotacoesStore = useAnotacoesStore()
const aplicacoesStore = useAplicacoesStore()
const authStore = useAuthStore()

const modalAberto = ref('')

const titulosModal = {
  residentes: 'Residentes ativos',
  prontuarios: 'Prontuários atualizados hoje',
  medicacoes: 'Medicações do dia',
  aniversariantes: 'Aniversariantes do mês',
}

const tituloModal = computed(() => titulosModal[modalAberto.value] || '')

function dataDeHoje() {
  const agora = new Date()
  const dia = String(agora.getDate()).padStart(2, '0')
  const mes = String(agora.getMonth() + 1).padStart(2, '0')

  return `${agora.getFullYear()}-${mes}-${dia}`
}

const residentesAtivos = computed(() => store.residentes)

const residentesAtualizadosHoje = computed(() => {
  const hoje = dataDeHoje()
  const residentes = new Map()

  store.residentes.forEach((residente) => {
    if (String(residente.atualizado_em || '').slice(0, 10) === hoje) {
      residentes.set(String(residente.id), {
        id: residente.id,
        nome_completo: residente.nome_completo,
        motivo: 'Cadastro atualizado',
      })
    }
  })

  anotacoesStore.anotacoesAtualizadasHoje.forEach((anotacao) => {
    if (!anotacao.residente) return

    const chave = String(anotacao.residente)

    if (!residentes.has(chave)) {
      const residente = store.residentes.find((item) => String(item.id) === chave)

      residentes.set(chave, {
        id: anotacao.residente,
        nome_completo: residente ? residente.nome_completo : `Residente #${anotacao.residente}`,
        motivo: 'Anotação atualizada',
      })
    }
  })

  return Array.from(residentes.values())
})

const prontuariosHoje = computed(() => residentesAtualizadosHoje.value.length)

const aplicacoesHoje = computed(() => {
  const hoje = dataDeHoje()

  return aplicacoesStore.aplicacoes.filter(
    (aplicacao) => String(aplicacao.data_hora_prevista || '').slice(0, 10) === hoje,
  )
})

const medicacoesCalendarioHoje = computed(() => anotacoesStore.medicacoesDoDia)

const medicacoesHoje = computed(
  () => aplicacoesHoje.value.length + medicacoesCalendarioHoje.value.length,
)

const aniversariantesLista = computed(() => {
  const mesAtual = new Date().getMonth() + 1

  return store.residentes.filter((residente) => {
    if (!residente.data_nascimento) return false

    const mes = Number(String(residente.data_nascimento).slice(5, 7))

    return mes === mesAtual
  })
})

const aniversariantes = computed(() => aniversariantesLista.value.length)

const modalCarregando = computed(() => {
  if (modalAberto.value === 'medicacoes') {
    return aplicacoesStore.loading || anotacoesStore.loading
  }

  if (modalAberto.value === 'prontuarios') {
    return store.loading || anotacoesStore.loading
  }

  return store.loading
})

const modalErro = computed(() => {
  if (modalAberto.value === 'medicacoes') {
    return aplicacoesStore.error || anotacoesStore.error
  }

  if (modalAberto.value === 'prontuarios') {
    return store.error || anotacoesStore.error
  }

  return store.error
})

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

function statusAplicacao(aplicacao) {
  if (aplicacao.aplicado) {
    return { rotulo: 'Concluída', classe: 'status-concluido' }
  }

  if (aplicacao.motivo_nao_aplicado) {
    return { rotulo: 'Não concluída', classe: 'status-nao-concluido' }
  }

  return { rotulo: 'Pendente', classe: 'status-pendente' }
}

function nomeResidente(id) {
  const residente = store.residentes.find((item) => String(item.id) === String(id))

  return residente ? residente.nome_completo : 'Residente'
}

function horaAplicacao(valor) {
  return String(valor || '').slice(11, 16)
}

function horaAnotacao(valor) {
  return String(valor || '').slice(0, 5)
}

function rotuloGrau(valor) {
  const numero = String(valor || '').replace(/\D/g, '')

  return numero ? `Grau ${numero}` : 'Sem grau'
}

function diaMesNascimento(residente) {
  const data = String(residente.data_nascimento || '')

  if (!data) return '—'

  return `${data.slice(8, 10)}/${data.slice(5, 7)}`
}

function abrirModal(tipo) {
  modalAberto.value = tipo

  if (tipo === 'medicacoes') {
    anotacoesStore.fetchResumoDoDia(dataDeHoje())
    aplicacoesStore.fetchAplicacoes(dataDeHoje())
  }
}

function fecharModal() {
  modalAberto.value = ''
}

onMounted(() => {
  store.fetchResidentes()
  anotacoesStore.fetchResumoDoDia(dataDeHoje())
  aplicacoesStore.fetchAplicacoes(dataDeHoje())

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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

.summary-card-clickable {
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: left;
}

.summary-card-clickable:hover {
  border-color: #3e7a2b;
  box-shadow: 0 16px 34px rgba(31, 45, 28, 0.16);
}

.summary-card-clickable:focus-visible {
  outline: 2px solid #3e7a2b;
  outline-offset: 2px;
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
  max-width: 100%;
  color: #1f2d1c;
  font-size: 36px;
  font-weight: 800;
  line-height: 1.1;
  overflow-wrap: anywhere;
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

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(20, 32, 18, 0.55);
}

.modal-dialog {
  width: 100%;
  max-width: 720px;
  max-height: 85vh;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 24px 60px rgba(20, 32, 18, 0.28);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.modal-header .section-title {
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  background: #f4f8f2;
  color: #1f2d1c;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.modal-close:hover {
  border-color: #3e7a2b;
}

.modal-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.modal-section:first-of-type {
  margin-top: 0;
}

.modal-subtitle {
  margin: 0;
  color: #1f2d1c;
  font-size: 16px;
  font-weight: 800;
}

.modal-subsection {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-subsection + .modal-subsection {
  margin-top: 20px;
}

.modal-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.modal-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid #dde7d8;
  border-radius: 10px;
  padding: 12px 14px;
  background: #fbfdf9;
}

.modal-list-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.modal-list-title {
  color: #1f2d1c;
  font-size: 15px;
  font-weight: 800;
}

.modal-list-meta {
  color: #4a5a47;
  font-size: 13px;
  font-weight: 600;
}

.modal-list-status {
  flex-shrink: 0;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.modal-list-badge {
  flex-shrink: 0;
  border: 1px solid #b9dbc8;
  border-radius: 999px;
  padding: 4px 10px;
  background: #dff0e7;
  color: #173d2a;
  font-size: 12px;
  font-weight: 800;
}

.status-pendente {
  background: #f8ecd4;
  border-color: #e6d3ae;
  color: #4a3510;
}

.status-concluido {
  background: #dff0e7;
  border-color: #b9dbc8;
  color: #173d2a;
}

.status-nao-concluido {
  background: #fbe0e0;
  border-color: #e4b4b4;
  color: #8a1f1f;
}

.empty-message {
  margin: 0;
  color: #4a5a47;
  font-size: 14px;
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

  .summary-card {
    padding: 20px;
  }

  .summary-value {
    font-size: 30px;
  }

  .quick-cards {
    grid-template-columns: 1fr;
  }

  .modal-overlay {
    padding: 16px;
  }

  .modal-dialog {
    padding: 20px;
  }
}

@media (max-width: 600px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .summary-value {
    font-size: 28px;
  }

  .modal-list-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
