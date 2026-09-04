<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import api from '@/services/api'
import ResidenteCard from '@/components/ResidenteCard.vue'

const residentes = ref([])
const residentesFiltrados = ref([])
const termoBusca = ref('')
const mostrarFiltros = ref(false)
const carregando = ref(false)
const erro = ref('')

const filtroSexo = ref('')
const filtroIdade = ref(null)

const faixasIdade = [
  { rotulo: '60-70 anos', min: 60, max: 70 },
  { rotulo: '71-80 anos', min: 71, max: 80 },
  { rotulo: '81-90 anos', min: 81, max: 90 },
  { rotulo: '90+ anos', min: 91, max: Infinity },
]

const temFiltrosAtivos = computed(() => filtroSexo.value !== '' || filtroIdade.value !== null)

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

function correspondeAoSexo(residente) {
  if (!filtroSexo.value) return true

  const sexo = String(residente.sexo ?? residente.genero ?? '')
    .trim()
    .toUpperCase()

  if (!sexo) return false

  return (
    sexo[0] === filtroSexo.value ||
    (filtroSexo.value === 'M' ? sexo.startsWith('MAS') : sexo.startsWith('FEM'))
  )
}

function correspondeAhIdade(residente) {
  if (!filtroIdade.value) return true

  const idade = calcularIdade(residente.data_nascimento)

  return idade !== null && idade >= filtroIdade.value.min && idade <= filtroIdade.value.max
}

async function buscarResidentes() {
  carregando.value = true
  erro.value = ''

  try {
    // TODO: ajustar endpoint quando o backend estiver pronto
    const resposta = await api.get('/residentes/')
    residentes.value = resposta.data.results
    filtrarResidentes()
  } catch (error) {
    erro.value = 'Erro ao carregar residentes. Tente novamente.'
    residentes.value = []
    residentesFiltrados.value = []
  } finally {
    carregando.value = false
  }
}

function filtrarResidentes() {
  const termo = termoBusca.value.trim().toLowerCase()

  residentesFiltrados.value = residentes.value.filter(
    (residente) =>
      (!termo || residente.nome_completo.toLowerCase().includes(termo)) &&
      correspondeAoSexo(residente) &&
      correspondeAhIdade(residente),
  )
}

function limparFiltros() {
  filtroSexo.value = ''
  filtroIdade.value = null
}

function limparBuscaEFiltros() {
  termoBusca.value = ''
  limparFiltros()
  filtrarResidentes()
}

watch([filtroSexo, filtroIdade], filtrarResidentes)

onMounted(buscarResidentes)
</script>
<template>
  <div class="prontuarios-page">
    <main class="main-content">
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
            stroke="#2e5d2e"
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
            stroke="white"
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
            <span class="filtro-titulo">SEXO</span>
            <div class="filtro-opcoes">
              <button
                type="button"
                class="filtro-btn"
                :class="{ ativo: filtroSexo === '' }"
                @click="filtroSexo = ''"
              >
                TODOS
              </button>
              <button
                type="button"
                class="filtro-btn"
                :class="{ ativo: filtroSexo === 'M' }"
                @click="filtroSexo = 'M'"
              >
                MASCULINO
              </button>
              <button
                type="button"
                class="filtro-btn"
                :class="{ ativo: filtroSexo === 'F' }"
                @click="filtroSexo = 'F'"
              >
                FEMININO
              </button>
            </div>
          </div>

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

      <p v-if="erro" class="msg-erro">{{ erro }}</p>

      <div v-if="carregando" class="msg-carregando">Carregando residentes...</div>

      <div v-else-if="residentesFiltrados.length === 0" class="estado-vazio">
        <svg
          class="icone-vazio"
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
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
              stroke="#305126"
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

    <div class="linha-divisoria"></div>
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
}

.main-content {
  flex: 1;
  background: linear-gradient(160deg, #2e5d2e 0%, #3c7039 40%, #6ba13f 100%);
  padding: 28px 16px 24px;
  display: flex;
  flex-direction: column;
}

.barra-topo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
}

.campo-busca {
  position: relative;
  width: 100%;
}

.campo-busca input {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 14px;
  padding: 0 44px 0 16px;
  font-size: 14px;
  color: #1e3e1e;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.14);
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
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: rgba(255, 255, 255, 0.14);
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  border-radius: 14px;
  padding: 11px 18px;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-filtros:hover {
  background: rgba(255, 255, 255, 0.22);
}

.btn-filtros.ativo {
  background: #6ba13f;
  border-color: #6ba13f;
}

.painel-filtros {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filtro-titulo {
  color: #6ba13f;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.8px;
}

.filtro-opcoes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filtro-btn {
  background: #eef4ec;
  border: 1.5px solid transparent;
  border-radius: 20px;
  padding: 7px 14px;
  color: #4a5f4e;
  font-family: inherit;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.filtro-btn:hover {
  background: #e2ecdf;
}

.filtro-btn.ativo {
  background: #6ba13f;
  border-color: #6ba13f;
  color: #ffffff;
}

.btn-limpar-filtros {
  align-self: flex-end;
  background: none;
  border: none;
  color: #6ba13f;
  font-family: inherit;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.5px;
  padding: 8px 4px;
  opacity: 0.85;
  cursor: pointer;
}

.btn-limpar-filtros:hover {
  opacity: 1;
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

.msg-erro {
  color: #c0392b;
  font-size: 13px;
  margin-bottom: 16px;
}

.msg-carregando {
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  margin-top: 40px;
}

.estado-vazio {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  padding: 20px 0;
}

.icone-vazio {
  opacity: 0.6;
  margin-bottom: 8px;
}

.msg-vazio {
  color: #ffffff;
  font-size: 17px;
  font-weight: bold;
  margin: 0;
}

.msg-vazio-sub {
  color: #e4eee2;
  font-size: 13px;
  margin: 0 0 14px 0;
}

.btn-cadastrar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #6ba13f;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: bold;
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.btn-cadastrar:hover {
  background: #7caf49;
  transform: translateY(-2px);
}

.residentes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.linha-divisoria {
  height: 1vw;
  background: #ffffff;
  width: 100%;
}

@media (min-width: 768px) {
  .main-content {
    background: #2e5d2e;
    padding: 30px 50px;
  }

  .barra-topo {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    gap: 20px;
  }

  .campo-busca {
    flex: 1;
    max-width: 500px;
  }

  .campo-busca input {
    height: 38px;
    border-radius: 20px;
    padding: 0 40px 0 16px;
    font-size: 13px;
    box-shadow: none;
  }

  .btn-filtros {
    width: auto;
    justify-content: flex-start;
    background: transparent;
    border: 1.5px solid #ffffff;
    border-radius: 20px;
    padding: 8px 18px;
  }

  .btn-filtros:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .btn-filtros.ativo {
    background: #6ba13f;
    border-color: #6ba13f;
  }

  .painel-filtros {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 18px 36px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 14px;
    padding: 16px 20px;
    box-shadow: none;
  }

  .filtro-titulo {
    color: #cfe0cd;
  }

  .filtro-btn {
    background: transparent;
    border: 1.5px solid rgba(255, 255, 255, 0.5);
    color: #ffffff;
  }

  .filtro-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .filtro-btn.ativo {
    background: #6ba13f;
    border-color: #6ba13f;
    color: #ffffff;
  }

  .btn-limpar-filtros {
    margin-left: auto;
    align-self: auto;
    color: #ffffff;
  }

  .msg-erro {
    color: #ffdada;
  }

  .msg-vazio-sub {
    color: #d7e3d4;
  }

  .btn-cadastrar {
    background: #ffffff;
    color: #305126;
    border-radius: 6px;
  }

  .btn-cadastrar:hover {
    background: #e8f0e8;
  }

  .residentes-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 26px;
  }
}
</style>
