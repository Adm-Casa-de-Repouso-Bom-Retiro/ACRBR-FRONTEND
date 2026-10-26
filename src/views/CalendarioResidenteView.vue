<template>
  <div class="calendario-page">
    <main class="main-content">
      <BotaoVoltar
        :to="{ name: 'residente', params: { id: idResidente } }"
        label="VOLTAR AO PERFIL"
      />

      <section class="calendario-painel">
        <header class="card-header">
          <div class="header-left">
            <div class="avatar" :class="{ 'avatar--foto': residente.foto }">
              <img
                v-if="residente.foto"
                :src="residente.foto.url"
                alt="Foto do residente"
                class="avatar-img"
              />

              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="avatar-icone"
              >
                <path
                  d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 2.1c-3.5 0-7 1.76-7 5.25V21h14v-1.65c0-3.49-3.5-5.25-7-5.25Z"
                  fill="#3e7a2b"
                  opacity="0.75"
                />
              </svg>
            </div>

            <div class="header-texto">
              <h1 class="section-title">Calendário - {{ residente.nome_completo || '...' }}</h1>
              <span class="aba-ativa">CALENDÁRIO</span>
            </div>
          </div>
        </header>

        <p v-if="store.error" class="error-message">{{ store.error }}</p>
        <p v-if="store.loading" class="loading-message">Carregando anotações...</p>

        <div class="layout-calendario">
          <aside class="coluna-lateral">
            <MiniCalendario
              :selected-date="dataSelecionada"
              :dias-com-anotacao="diasComAnotacao"
              @select="handleSelecionarData"
            />

            <section class="dia-destaque">
              <span class="dia-destaque-rotulo">Dia selecionado</span>
              <strong class="dia-destaque-data">{{ dataSelecionadaPorExtenso }}</strong>
              <span class="dia-destaque-total">
                {{ anotacoesDoDia.length }}
                {{ anotacoesDoDia.length === 1 ? 'anotação' : 'anotações' }}
              </span>
            </section>

            <section class="filtros">
              <h2 class="filtros-titulo">Filtros</h2>

              <label
                v-for="categoria in CATEGORIAS_ANOTACAO"
                :key="categoria.valor"
                class="filtro-item"
              >
                <input v-model="categoriasAtivas" type="checkbox" :value="categoria.valor" />
                <span>{{ categoria.rotulo }}</span>
              </label>
            </section>
          </aside>

          <div class="coluna-principal">
            <div class="barra-periodo">
              <div class="nav-periodo">
                <button
                  type="button"
                  class="nav-botao"
                  aria-label="Período anterior"
                  @click="periodoAnterior"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="nav-botao"
                  aria-label="Próximo período"
                  @click="periodoProximo"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <h2 class="periodo-titulo">{{ tituloPeriodo }}</h2>

              <div class="alternador-visao">
                <button
                  type="button"
                  :class="{ ativo: visao === 'semana' }"
                  @click="visao = 'semana'"
                >
                  Semana
                </button>

                <button type="button" :class="{ ativo: visao === 'mes' }" @click="visao = 'mes'">
                  Mês
                </button>
              </div>

              <button v-if="podeEditar" type="button" class="btn-nova" @click="handleNovaAnotacao">
                Nova anotação
              </button>
            </div>

            <div v-if="visao === 'semana'" class="grade-semana">
              <div v-for="dia in diasDaSemana" :key="dia.iso" class="coluna-dia">
                <button
                  type="button"
                  class="cabecalho-dia"
                  :class="{
                    hoje: dia.iso === hojeIso,
                    selecionado: dia.iso === dataSelecionada,
                  }"
                  @click="handleSelecionarData(dia.iso)"
                >
                  <span class="dia-semana">{{ dia.semana }}</span>
                  <span class="dia-numero">{{ dia.numero }}</span>
                </button>

                <div class="lista-cards">
                  <article
                    v-for="anotacao in anotacoesFiltradasDoDia(dia.iso)"
                    :key="anotacao.id"
                    class="card-semana"
                    :class="classeCategoria(anotacao.categoria)"
                  >
                    <div class="card-semana-topo">
                      <span v-if="anotacao.hora" class="card-hora">
                        {{ formatarHora(anotacao.hora) }}
                      </span>
                      <span class="card-categoria">
                        {{ rotuloCategoria(anotacao.categoria) }}
                      </span>
                    </div>

                    <strong class="card-titulo">{{ anotacao.titulo }}</strong>
                    <span class="card-autor">{{ anotacao.autor_nome || 'Equipe' }}</span>
                  </article>

                  <p v-if="!anotacoesFiltradasDoDia(dia.iso).length" class="sem-anotacao">—</p>
                </div>
              </div>
            </div>

            <div v-else class="grade-mes">
              <div class="mes-cabecalho">
                <span v-for="dia in DIAS_SEMANA_CURTOS" :key="dia">{{ dia }}</span>
              </div>

              <div class="mes-semanas">
                <div v-for="(semana, indice) in semanasDoMes" :key="indice" class="mes-semana">
                  <button
                    v-for="dia in semana"
                    :key="dia.iso"
                    type="button"
                    class="celula-mes"
                    :class="{
                      'fora-do-mes': !dia.doMes,
                      hoje: dia.iso === hojeIso,
                      selecionado: dia.iso === dataSelecionada,
                    }"
                    @click="handleSelecionarDiaMes(dia.iso)"
                  >
                    <span class="celula-numero">{{ dia.numero }}</span>

                    <div class="celula-anotacoes">
                      <span
                        v-for="anotacao in anotacoesFiltradasDoDia(dia.iso).slice(0, 2)"
                        :key="anotacao.id"
                        class="celula-anotacao"
                        :class="classeCategoria(anotacao.categoria)"
                      >
                        {{ anotacao.titulo }}
                      </span>

                      <span v-if="anotacoesFiltradasDoDia(dia.iso).length > 2" class="celula-mais">
                        +{{ anotacoesFiltradasDoDia(dia.iso).length - 2 }}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <section class="painel-dia">
              <div class="painel-dia-topo">
                <h2 class="painel-dia-titulo">Anotações do dia selecionado</h2>
                <span class="painel-dia-data">{{ dataSelecionadaPorExtenso }}</span>
              </div>

              <p v-if="!anotacoesDoDia.length" class="empty-message">
                {{
                  podeEditar
                    ? 'Nenhuma anotação neste dia. Adicione uma acima.'
                    : 'Nenhuma anotação neste dia.'
                }}
              </p>

              <div v-else class="lista-anotacoes">
                <AnotacaoItem
                  v-for="anotacao in anotacoesDoDia"
                  :key="anotacao.id"
                  :anotacao="anotacao"
                  :pode-editar="podeEditar"
                  @edit="handleEdit"
                  @remove="handleRemove"
                />
              </div>

              <p v-if="!podeEditar" class="permission-message">
                Seu cargo permite apenas visualizar as anotações.
              </p>

              <AnotacaoForm
                v-else
                :key="formKey"
                :editing-anotacao="anotacaoEmEdicao"
                :data-selecionada="dataSelecionada"
                @add="handleAdd"
                @update="handleUpdate"
                @cancel="handleCancel"
              />
            </section>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { useAnotacoesStore } from '@/stores/anotacoes'
import { useAuthStore } from '@/stores/auth'
import { CARGOS_COM_EDICAO, CATEGORIAS_ANOTACAO } from '@/constants/anotacoes'
import BotaoVoltar from '@/components/BotaoVoltar.vue'
import MiniCalendario from '@/components/MiniCalendario.vue'
import AnotacaoItem from '@/components/AnotacaoItem.vue'
import AnotacaoForm from '@/components/AnotacaoForm.vue'

const route = useRoute()
const store = useAnotacoesStore()
const authStore = useAuthStore()

const DIAS_SEMANA_CURTOS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const idResidente = computed(() => route.params.id)
const residente = ref({
  nome_completo: '',
  foto: null,
})

const hojeIso = ref(paraISO(new Date()))
const dataSelecionada = ref(hojeIso.value)
const dataReferencia = ref(paraData(hojeIso.value))
const visao = ref('semana')
const categoriasAtivas = ref(CATEGORIAS_ANOTACAO.map((categoria) => categoria.valor))
const anotacaoEmEdicao = ref(null)
const formKey = ref(0)

const podeEditar = computed(() => {
  const usuario = authStore.usuario

  if (!usuario) return false

  return usuario.is_superuser === true || CARGOS_COM_EDICAO.includes(usuario.cargo)
})

const anotacoesDoResidente = computed(() => {
  return store.anotacoesPorResidente(idResidente.value)
})

const anotacoesVisiveis = computed(() => {
  return anotacoesDoResidente.value.filter((anotacao) =>
    categoriasAtivas.value.includes(anotacao.categoria),
  )
})

const anotacoesDoDia = computed(() => {
  return store
    .anotacoesDoDia(dataSelecionada.value)
    .filter(
      (anotacao) =>
        String(anotacao.residente) === String(idResidente.value) &&
        categoriasAtivas.value.includes(anotacao.categoria),
    )
    .sort(ordenarPorHora)
})

const diasComAnotacao = computed(() => {
  return [...new Set(anotacoesVisiveis.value.map((anotacao) => anotacao.data))]
})

const dataSelecionadaObj = computed(() => paraData(dataSelecionada.value))

const dataSelecionadaPorExtenso = computed(() => {
  return dataSelecionadaObj.value.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const diasDaSemana = computed(() => {
  const referencia = dataReferencia.value
  const deslocamento = (referencia.getDay() + 6) % 7
  const inicio = new Date(
    referencia.getFullYear(),
    referencia.getMonth(),
    referencia.getDate() - deslocamento,
    12,
  )
  const dias = []

  for (let indice = 0; indice < 7; indice += 1) {
    const data = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + indice, 12)

    dias.push({
      iso: paraISO(data),
      semana: data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      numero: data.getDate(),
    })
  }

  return dias
})

const semanasDoMes = computed(() => {
  const referencia = dataReferencia.value
  const ano = referencia.getFullYear()
  const mes = referencia.getMonth()
  const primeiroDia = new Date(ano, mes, 1, 12)
  const deslocamento = (primeiroDia.getDay() + 6) % 7
  const inicio = new Date(ano, mes, 1 - deslocamento, 12)
  const semanas = []

  for (let semana = 0; semana < 6; semana += 1) {
    const dias = []

    for (let dia = 0; dia < 7; dia += 1) {
      const data = new Date(
        inicio.getFullYear(),
        inicio.getMonth(),
        inicio.getDate() + semana * 7 + dia,
        12,
      )

      dias.push({
        iso: paraISO(data),
        numero: data.getDate(),
        doMes: data.getMonth() === mes,
      })
    }

    semanas.push(dias)
  }

  return semanas
})

const tituloPeriodo = computed(() => {
  if (visao.value === 'mes') {
    return capitalizar(
      dataReferencia.value.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      }),
    )
  }

  const inicio = paraData(diasDaSemana.value[0].iso)
  const fim = paraData(diasDaSemana.value[6].iso)
  const mesInicio = inicio.toLocaleDateString('pt-BR', { month: 'long' })
  const mesFim = fim.toLocaleDateString('pt-BR', { month: 'long' })

  if (inicio.getMonth() === fim.getMonth() && inicio.getFullYear() === fim.getFullYear()) {
    return `${inicio.getDate()} a ${fim.getDate()} de ${mesFim} de ${fim.getFullYear()}`
  }

  return `${inicio.getDate()} de ${mesInicio} a ${fim.getDate()} de ${mesFim} de ${fim.getFullYear()}`
})

function paraData(valor) {
  const [ano, mes, dia] = String(valor).slice(0, 10).split('-').map(Number)

  if (!ano || !mes || !dia) return new Date()

  return new Date(ano, mes - 1, dia, 12)
}

function paraISO(data) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate(), 12)
    .toISOString()
    .slice(0, 10)
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function formatarHora(hora) {
  if (!hora) return ''

  return String(hora).slice(0, 5)
}

function ordenarPorHora(anotacaoA, anotacaoB) {
  const horaA = anotacaoA.hora || '99:99:99'
  const horaB = anotacaoB.hora || '99:99:99'

  return horaA.localeCompare(horaB)
}

function encontrarCategoria(valor) {
  return CATEGORIAS_ANOTACAO.find((categoria) => categoria.valor === valor)
}

function rotuloCategoria(valor) {
  const categoria = encontrarCategoria(valor)

  return categoria ? categoria.rotulo : 'Geral'
}

function classeCategoria(valor) {
  const categoria = encontrarCategoria(valor)

  return categoria ? categoria.classe : 'categoria-geral'
}

function anotacoesFiltradasDoDia(iso) {
  return anotacoesVisiveis.value.filter((anotacao) => anotacao.data === iso).sort(ordenarPorHora)
}

async function carregarResidente() {
  if (!idResidente.value) return

  try {
    const resposta = await api.get(`/residentes/${idResidente.value}/`)
    const dados = resposta.data || {}

    residente.value = {
      nome_completo: dados.nome_completo || dados.nome || '',
      foto: dados.foto || null,
    }
  } catch (erro) {
    residente.value = {
      nome_completo: '',
      foto: null,
    }
  }
}

function handleSelecionarData(iso) {
  dataSelecionada.value = iso
  dataReferencia.value = paraData(iso)
  anotacaoEmEdicao.value = null
  formKey.value += 1
}

function handleSelecionarDiaMes(iso) {
  handleSelecionarData(iso)
  visao.value = 'semana'
}

function periodoAnterior() {
  if (visao.value === 'mes') {
    dataReferencia.value = new Date(
      dataReferencia.value.getFullYear(),
      dataReferencia.value.getMonth() - 1,
      1,
      12,
    )
    return
  }

  dataReferencia.value = new Date(
    dataReferencia.value.getFullYear(),
    dataReferencia.value.getMonth(),
    dataReferencia.value.getDate() - 7,
    12,
  )
}

function periodoProximo() {
  if (visao.value === 'mes') {
    dataReferencia.value = new Date(
      dataReferencia.value.getFullYear(),
      dataReferencia.value.getMonth() + 1,
      1,
      12,
    )
    return
  }

  dataReferencia.value = new Date(
    dataReferencia.value.getFullYear(),
    dataReferencia.value.getMonth(),
    dataReferencia.value.getDate() + 7,
    12,
  )
}

function handleNovaAnotacao() {
  anotacaoEmEdicao.value = null
  formKey.value += 1
}

function handleEdit(anotacao) {
  anotacaoEmEdicao.value = anotacao
}

function handleCancel() {
  anotacaoEmEdicao.value = null
  formKey.value += 1
}

async function handleAdd(dados) {
  const salvou = await store.addAnotacao({
    ...dados,
    residente: Number(idResidente.value),
  })

  if (!salvou) return

  dataSelecionada.value = dados.data
  dataReferencia.value = paraData(dados.data)
  anotacaoEmEdicao.value = null
  formKey.value += 1
}

async function handleUpdate(evento) {
  const salvou = await store.updateAnotacao(evento.id, evento.dados)

  if (!salvou) return

  dataSelecionada.value = evento.dados.data
  dataReferencia.value = paraData(evento.dados.data)
  anotacaoEmEdicao.value = null
  formKey.value += 1
}

async function handleRemove(anotacao) {
  const salvou = await store.removeAnotacao(anotacao.id)

  if (!salvou) return

  if (anotacaoEmEdicao.value?.id === anotacao.id) {
    anotacaoEmEdicao.value = null
    formKey.value += 1
  }
}

onMounted(() => {
  if (!authStore.usuario) {
    authStore.fetchUsuario()
  }

  if (!idResidente.value) return

  carregarResidente()
  store.fetchAnotacoes(idResidente.value)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.calendario-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: #f2f7f0;
  padding: 28px 24px 48px 24px;
}

.calendario-painel {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(47, 90, 43, 0.06);
  padding: 32px 36px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #e8f1e3;
  border: 1.5px solid #dde7d8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-icone {
  width: 24px;
  height: 24px;
}

.avatar--foto {
  background: #e8f1e3;
  border-color: #3e7a2b;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.header-texto {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.section-title {
  margin: 0;
  color: #1f2d1c;
  font-size: 22px;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.aba-ativa {
  align-self: flex-start;
  background: #3e7a2b;
  color: #ffffff;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.error-message {
  margin: 0 0 16px 0;
  padding: 10px 14px;
  background: #fbe9e9;
  border: 1px solid #e4b4b4;
  border-radius: 8px;
  color: #8a1f1f;
  font-size: 13px;
  font-weight: 700;
}

.loading-message {
  margin: 0 0 16px 0;
  color: #4a5a47;
  font-size: 13px;
  font-weight: 700;
}

.layout-calendario {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.coluna-lateral {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.dia-destaque {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #2f5a2b;
  color: #ffffff;
  border-radius: 12px;
  padding: 18px;
}

.dia-destaque-rotulo {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  opacity: 0.85;
}

.dia-destaque-data {
  font-size: 15px;
  font-weight: 800;
  line-height: 1.3;
}

.dia-destaque-total {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.9;
}

.filtros {
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 12px;
  padding: 16px;
}

.filtros-titulo {
  margin: 0 0 12px 0;
  color: #1f2d1c;
  font-size: 13px;
  font-weight: 800;
}

.filtro-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  color: #1f2d1c;
  font-size: 13px;
  cursor: pointer;
}

.filtro-item input {
  width: 16px;
  height: 16px;
  accent-color: #3e7a2b;
  cursor: pointer;
}

.coluna-principal {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.barra-periodo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.nav-periodo {
  display: flex;
  gap: 4px;
}

.nav-botao {
  width: 32px;
  height: 32px;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  background: #ffffff;
  color: #3e7a2b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;
}

.nav-botao:hover {
  background: #e8f1e3;
}

.nav-botao svg {
  width: 16px;
  height: 16px;
}

.periodo-titulo {
  margin: 0;
  color: #1f2d1c;
  font-size: 18px;
  font-weight: 800;
}

.alternador-visao {
  display: flex;
  margin-left: auto;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  overflow: hidden;
}

.alternador-visao button {
  border: none;
  background: #ffffff;
  color: #4a5a47;
  padding: 8px 14px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.alternador-visao button.ativo {
  background: #3e7a2b;
  color: #ffffff;
}

.btn-nova {
  border: none;
  background: #3e7a2b;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-nova:hover {
  background: #2f5a2b;
}

.grade-semana {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
}

.coluna-dia {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f7faf5;
  border: 1px solid #dde7d8;
  border-radius: 10px;
  padding: 8px;
}

.cabecalho-dia {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #4a5a47;
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.cabecalho-dia:hover {
  background: #e8f1e3;
}

.cabecalho-dia.hoje {
  background: #e8f1e3;
}

.cabecalho-dia.selecionado {
  background: #3e7a2b;
  color: #ffffff;
}

.dia-semana {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.dia-numero {
  font-size: 16px;
  font-weight: 800;
}

.lista-cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-semana {
  display: flex;
  flex-direction: column;
  gap: 3px;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 8px;
}

.card-semana-topo {
  display: flex;
  justify-content: space-between;
  gap: 4px;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
}

.card-hora {
  white-space: nowrap;
}

.card-categoria {
  text-align: right;
  opacity: 0.85;
}

.card-titulo {
  font-size: 11px;
  font-weight: 800;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.card-autor {
  font-size: 10px;
  opacity: 0.85;
  overflow-wrap: anywhere;
}

.sem-anotacao {
  margin: 8px 0;
  color: #8fa093;
  font-size: 11px;
  text-align: center;
}

.grade-mes {
  border: 1px solid #dde7d8;
  border-radius: 10px;
  overflow: hidden;
}

.mes-cabecalho,
.mes-semana {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.mes-cabecalho {
  background: #e8f1e3;
}

.mes-cabecalho span {
  padding: 8px 4px;
  color: #4a5a47;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}

.mes-semana {
  border-top: 1px solid #dde7d8;
}

.celula-mes {
  min-height: 84px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: none;
  border-right: 1px solid #dde7d8;
  background: #ffffff;
  color: #1f2d1c;
  padding: 6px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

.celula-mes:last-child {
  border-right: none;
}

.celula-mes:hover {
  background: #f7faf5;
}

.celula-mes.fora-do-mes {
  background: #f7faf5;
  color: #8fa093;
}

.celula-mes.hoje .celula-numero {
  color: #3e7a2b;
  font-weight: 800;
}

.celula-mes.selecionado {
  box-shadow: inset 0 0 0 2px #3e7a2b;
}

.celula-numero {
  font-size: 12px;
  font-weight: 700;
}

.celula-anotacoes {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.celula-anotacao {
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 9px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.celula-mais {
  color: #4a5a47;
  font-size: 9px;
  font-weight: 700;
}

.categoria-geral {
  background: #e8f1e3;
  border-color: #c9dfc2;
  color: #1f2d1c;
}

.categoria-saude {
  background: #dff0e7;
  border-color: #b9dbc8;
  color: #173d2a;
}

.categoria-medicacao {
  background: #f8ecd4;
  border-color: #e6d3ae;
  color: #4a3510;
}

.categoria-alimentacao {
  background: #fbe6d2;
  border-color: #efc9a8;
  color: #4a2a10;
}

.categoria-atividade {
  background: #dcecf7;
  border-color: #b8d4e8;
  color: #123247;
}

.categoria-visita {
  background: #e4e9f8;
  border-color: #c3cdec;
  color: #1c2a52;
}

.painel-dia {
  border-top: 1px solid #dde7d8;
  padding-top: 18px;
}

.painel-dia-topo {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.painel-dia-titulo {
  margin: 0;
  color: #1f2d1c;
  font-size: 16px;
  font-weight: 800;
}

.painel-dia-data {
  color: #4a5a47;
  font-size: 12px;
  font-weight: 600;
}

.lista-anotacoes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-message {
  margin: 0;
  padding: 16px;
  background: #f2f7f0;
  border: 1px dashed #dde7d8;
  border-radius: 8px;
  color: #4a5a47;
  font-size: 13px;
  text-align: center;
}

.permission-message {
  margin: 16px 0 0 0;
  padding: 10px 14px;
  background: #f2f7f0;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  color: #4a5a47;
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 900px) {
  .main-content {
    padding: 20px 16px 40px 16px;
  }

  .calendario-painel {
    padding: 24px 18px;
  }

  .layout-calendario {
    grid-template-columns: 1fr;
  }

  .grade-semana {
    grid-template-columns: 1fr;
  }

  .coluna-dia {
    display: grid;
    grid-template-columns: 92px minmax(0, 1fr);
    align-items: start;
  }

  .cabecalho-dia {
    flex-direction: row;
    justify-content: flex-start;
    gap: 8px;
  }

  .alternador-visao {
    margin-left: 0;
  }
}

@media (max-width: 600px) {
  .section-title {
    font-size: 18px;
  }

  .coluna-dia {
    grid-template-columns: 1fr;
  }

  .cabecalho-dia {
    flex-direction: row;
    justify-content: space-between;
  }

  .celula-mes {
    min-height: 64px;
    padding: 4px;
  }

  .celula-anotacao {
    font-size: 8px;
  }

  .celula-mais {
    font-size: 8px;
  }

  .btn-nova {
    width: 100%;
  }
}
</style>
