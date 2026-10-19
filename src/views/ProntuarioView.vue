<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useResidentesStore } from '@/stores/residentes.js'
import ResidenteCard from '@/components/ResidenteCard.vue'
import BotaoVoltar from '@/components/BotaoVoltar.vue'

const store = useResidentesStore()

const residentesFiltrados = ref([])
const termoBusca = ref('')
const mostrarFiltros = ref(false)

const filtroIdade = ref(null)

const faixasIdade = [
  { rotulo: '60-70 anos', min: 60, max: 70 },
  { rotulo: '71-80 anos', min: 71, max: 80 },
  { rotulo: '81-90 anos', min: 81, max: 90 },
  { rotulo: '90+ anos', min: 91, max: Infinity },
]

const temFiltrosAtivos = computed(() => filtroIdade.value !== null)

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null

  const [ano, mes, dia] = String(dataNascimento).slice(0, 10).split('-').map(Number)

  if (!ano || !mes || !dia) return null

  const hoje = new Date()
  let idade = hoje.getFullYear() - ano
  const aniversarioPassou =
    hoje.getMonth() + 1 > mes || (hoje.getMonth() + 1 === mes && hoje.getDate() >= dia)

  if (!aniversarioPassou) idade -= 1

  return idade >= 0 ? idade : null
}

function correspondeAhIdade(residente) {
  if (!filtroIdade.value) return true

  const idade = calcularIdade(residente.data_nascimento)

  return idade !== null && idade >= filtroIdade.value.min && idade <= filtroIdade.value.max
}

function filtrarResidentes() {
  const termo = termoBusca.value.trim().toLowerCase()

  residentesFiltrados.value = store.residentes.filter(
    (residente) =>
      (!termo || residente.nome_completo.toLowerCase().includes(termo)) &&
      correspondeAhIdade(residente),
  )
}

function limparFiltros() {
  filtroIdade.value = null
}

function limparBuscaEFiltros() {
  termoBusca.value = ''
  limparFiltros()
  filtrarResidentes()
}

watch(() => store.residentes, filtrarResidentes, { immediate: true })

watch(filtroIdade, filtrarResidentes)

onMounted(() => {
  store.fetchResidentes()
})
</script>

<template>
  <div class="prontuarios-page">
    <main class="main-content">
      <BotaoVoltar to="/" />

      <div class="barra-topo">
        <div class="campo-busca">
          <input
            v-model="termoBusca"
            type="text"
            placeholder="Buscar residente..."
            @input="filtrarResidentes"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3e7a2b"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <button
          class="btn-filtros"
          :class="{ ativo: temFiltrosAtivos }"
          @click="mostrarFiltros = !mostrarFiltros"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          FILTROS
        </button>
      </div>

      <transition name="filtros">
        <div v-if="mostrarFiltros" class="painel-filtros">
          <div class="filtro-grupo">
            <span class="filtro-titulo">IDADE</span>
            <div class="filtro-opcoes">
              <button
                type="button"
                class="filtro-btn"
                :class="{ ativo: filtroIdade === null }"
                @click="filtroIdade = null"
              >
                TODAS
              </button>
              <button
                v-for="faixa in faixasIdade"
                :key="faixa.rotulo"
                type="button"
                class="filtro-btn"
                :class="{ ativo: filtroIdade === faixa }"
                @click="filtroIdade = faixa"
              >
                {{ faixa.rotulo }}
              </button>
            </div>
          </div>

          <button
            v-if="temFiltrosAtivos"
            type="button"
            class="btn-limpar-filtros"
            @click="limparFiltros"
          >
            LIMPAR FILTROS ✕
          </button>
        </div>
      </transition>

      <p v-if="store.error" class="error-message">{{ store.error }}</p>

      <div v-if="store.loading" class="loading-message">Carregando residentes...</div>

      <div v-else-if="residentesFiltrados.length === 0" class="estado-vazio">
        <svg
          class="icone-vazio"
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#3e7a2b"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <template v-if="temFiltrosAtivos || termoBusca.trim()">
          <p class="msg-vazio">Nenhum residente encontrado.</p>
          <p class="msg-vazio-sub">Ajuste os filtros ou o termo de busca para ver resultados.</p>
          <button class="btn-cadastrar" @click="limparBuscaEFiltros">LIMPAR BUSCA E FILTROS</button>
        </template>

        <template v-else>
          <p class="msg-vazio">Nenhum residente cadastrado ainda.</p>
          <p class="msg-vazio-sub">Comece adicionando o primeiro residente da casa de repouso.</p>
          <button class="btn-cadastrar" @click="$router.push('/cadastroresidente')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            CADASTRAR PRIMEIRO RESIDENTE
          </button>
        </template>
      </div>

      <div v-else class="residentes-grid">
        <ResidenteCard
          v-for="residente in residentesFiltrados"
          :key="residente.id"
          :residente="residente"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.prontuarios-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f2f7f0;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 24px 48px 24px;
  display: flex;
  flex-direction: column;
}

.barra-topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
}

.campo-busca {
  position: relative;
  flex: 1;
  max-width: 500px;
}

.campo-busca input {
  width: 100%;
  height: 44px;
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 10px;
  padding: 0 40px 0 16px;
  font-family: inherit;
  font-size: 14px;
  color: #1f2d1c;
  outline: none;
  transition: border-color 0.15s ease;
}

.campo-busca input:focus {
  border-color: #3e7a2b;
}

.campo-busca svg {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.btn-filtros {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #3e7a2b;
  border-radius: 10px;
  padding: 10px 18px;
  color: #3e7a2b;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-filtros:hover {
  background: #f2f7f0;
}

.btn-filtros.ativo {
  background: #3e7a2b;
  border-color: #3e7a2b;
  color: #ffffff;
}

.painel-filtros {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 18px 36px;
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(47, 90, 43, 0.06);
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filtro-titulo {
  color: #4a5a47;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
}

.filtro-opcoes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filtro-btn {
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 20px;
  padding: 6px 14px;
  color: #4a5a47;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.filtro-btn:hover {
  border-color: #3e7a2b;
  color: #3e7a2b;
}

.filtro-btn.ativo {
  background: #3e7a2b;
  border-color: #3e7a2b;
  color: #ffffff;
}

.btn-limpar-filtros {
  margin-left: auto;
  background: none;
  border: none;
  color: #3e7a2b;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 8px 4px;
  cursor: pointer;
}

.btn-limpar-filtros:hover {
  text-decoration: underline;
}

.filtros-enter-active,
.filtros-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.filtros-enter-from,
.filtros-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.error-message {
  margin: 0 0 16px 0;
  padding: 10px 14px;
  background: #fbe9e9;
  border: 1px solid #e4b4b4;
  border-radius: 8px;
  color: #8a1f1f;
  font-size: 14px;
  font-weight: 700;
}

.loading-message {
  margin: 40px 0 0 0;
  color: #4a5a47;
  font-size: 14px;
  text-align: center;
}

.estado-vazio {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  padding: 40px 0;
}

.icone-vazio {
  margin-bottom: 8px;
}

.msg-vazio {
  color: #1f2d1c;
  font-size: 17px;
  font-weight: 700;
  margin: 0;
}

.msg-vazio-sub {
  color: #4a5a47;
  font-size: 13px;
  margin: 0 0 14px 0;
}

.btn-cadastrar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #3e7a2b;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-cadastrar:hover {
  background: #2f5a2b;
}

.residentes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

@media (max-width: 900px) {
  .barra-topo {
    flex-direction: column;
    align-items: stretch;
  }

  .campo-busca {
    max-width: none;
  }

  .btn-filtros {
    justify-content: center;
  }
}
</style>
