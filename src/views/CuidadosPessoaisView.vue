<template>
  <div class="cuidados-page">
    <main class="main-content">
      <BotaoVoltar :to="{ name: 'residente', params: { id: idResidente } }" />

      <section class="cuidados-painel">
        <div class="card-header">
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

            <h1 class="section-title">Cuidados Pessoais - {{ residente.nome }}</h1>
          </div>

          <button class="btn-editar" @click="abrirModal">EDITAR DADOS</button>
        </div>

        <div class="grid-sections">
          <div class="coluna">
            <section class="box">
              <div class="box-header">
                <h2>Higiene:</h2>

                <div class="col-labels">
                  <span>Sim</span>
                  <span>Nao</span>
                </div>
              </div>

              <div v-for="item in higieneItems" :key="item.key" class="check-row">
                <span>{{ item.label }}</span>

                <div class="check-pair">
                  <button
                    type="button"
                    class="check-box"
                    :class="{ active: cuidados.higiene[item.key] === true }"
                    disabled
                  ></button>

                  <button
                    type="button"
                    class="check-box"
                    :class="{ active: cuidados.higiene[item.key] === false }"
                    disabled
                  ></button>
                </div>
              </div>
            </section>
          </div>

          <div class="coluna">
            <section class="box">
              <div class="box-header">
                <h2>Locomocao:</h2>

                <div class="col-labels">
                  <span>Sim</span>
                  <span>Nao</span>
                </div>
              </div>

              <div v-for="item in locomocaoItems" :key="item.key" class="check-row">
                <span>{{ item.label }}</span>

                <div class="check-pair">
                  <button
                    type="button"
                    class="check-box"
                    :class="{ active: cuidados.locomocao[item.key] === true }"
                    disabled
                  ></button>

                  <button
                    type="button"
                    class="check-box"
                    :class="{ active: cuidados.locomocao[item.key] === false }"
                    disabled
                  ></button>
                </div>
              </div>
            </section>

            <section class="box">
              <div class="box-header">
                <h2>Alimentacao:</h2>

                <div class="col-labels">
                  <span>Sim</span>
                  <span>Nao</span>
                </div>
              </div>

              <div v-for="item in alimentacaoItems" :key="item.key" class="check-row">
                <span>{{ item.label }}</span>

                <div class="check-pair">
                  <button
                    type="button"
                    class="check-box"
                    :class="{ active: cuidados.alimentacao[item.key] === true }"
                    disabled
                  ></button>

                  <button
                    type="button"
                    class="check-box"
                    :class="{ active: cuidados.alimentacao[item.key] === false }"
                    disabled
                  ></button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section class="box box-observacoes">
          <h2>Observacoes:</h2>

          <textarea
            :value="cuidados.observacoes"
            disabled
            rows="4"
            placeholder="Observacoes gerais sobre os cuidados pessoais do residente..."
          ></textarea>
        </section>

        <p
          v-if="mensagem"
          :class="mensagemTipo === 'sucesso' ? 'success-message' : 'error-message'"
        >
          {{ mensagem }}
        </p>
      </section>
    </main>

    <div v-if="mostrarModal" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-box">
        <button class="btn-fechar" type="button" @click="fecharModal">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="#1f2d1c"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <h3 class="modal-titulo">Editar cuidados pessoais</h3>

        <div class="modal-body">
          <div class="grid-sections">
            <div class="coluna">
              <section class="box">
                <div class="box-header">
                  <h2>Higiene:</h2>

                  <div class="col-labels">
                    <span>Sim</span>
                    <span>Nao</span>
                  </div>
                </div>

                <div v-for="item in higieneItems" :key="item.key" class="check-row">
                  <span>{{ item.label }}</span>

                  <div class="check-pair">
                    <button
                      type="button"
                      class="check-box"
                      :class="{ active: cuidados.higiene[item.key] === true }"
                      :disabled="salvando"
                      @click="alternarValor('higiene', item.key, true)"
                    ></button>

                    <button
                      type="button"
                      class="check-box"
                      :class="{ active: cuidados.higiene[item.key] === false }"
                      :disabled="salvando"
                      @click="alternarValor('higiene', item.key, false)"
                    ></button>
                  </div>
                </div>
              </section>
            </div>

            <div class="coluna">
              <section class="box">
                <div class="box-header">
                  <h2>Locomocao:</h2>

                  <div class="col-labels">
                    <span>Sim</span>
                    <span>Nao</span>
                  </div>
                </div>

                <div v-for="item in locomocaoItems" :key="item.key" class="check-row">
                  <span>{{ item.label }}</span>

                  <div class="check-pair">
                    <button
                      type="button"
                      class="check-box"
                      :class="{ active: cuidados.locomocao[item.key] === true }"
                      :disabled="salvando"
                      @click="alternarValor('locomocao', item.key, true)"
                    ></button>

                    <button
                      type="button"
                      class="check-box"
                      :class="{ active: cuidados.locomocao[item.key] === false }"
                      :disabled="salvando"
                      @click="alternarValor('locomocao', item.key, false)"
                    ></button>
                  </div>
                </div>
              </section>

              <section class="box">
                <div class="box-header">
                  <h2>Alimentacao:</h2>

                  <div class="col-labels">
                    <span>Sim</span>
                    <span>Nao</span>
                  </div>
                </div>

                <div v-for="item in alimentacaoItems" :key="item.key" class="check-row">
                  <span>{{ item.label }}</span>

                  <div class="check-pair">
                    <button
                      type="button"
                      class="check-box"
                      :class="{ active: cuidados.alimentacao[item.key] === true }"
                      :disabled="salvando"
                      @click="alternarValor('alimentacao', item.key, true)"
                    ></button>

                    <button
                      type="button"
                      class="check-box"
                      :class="{ active: cuidados.alimentacao[item.key] === false }"
                      :disabled="salvando"
                      @click="alternarValor('alimentacao', item.key, false)"
                    ></button>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <section class="box box-observacoes">
            <h2>Observacoes:</h2>

            <textarea
              v-model="cuidados.observacoes"
              :disabled="salvando"
              rows="4"
              placeholder="Observacoes gerais sobre os cuidados pessoais do residente..."
            ></textarea>
          </section>
        </div>

        <p
          v-if="mensagem"
          :class="mensagemTipo === 'sucesso' ? 'success-message' : 'error-message'"
        >
          {{ mensagem }}
        </p>

        <div class="modal-footer">
          <button class="btn-cancelar" type="button" :disabled="salvando" @click="fecharModal">
            CANCELAR
          </button>

          <button class="btn-salvar" type="button" :disabled="salvando" @click="salvarDados">
            {{ salvando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { useCuidadosPessoaisStore } from '@/stores/cuidadospessoais'
import BotaoVoltar from '@/components/BotaoVoltar.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
})

const route = useRoute()
const store = useCuidadosPessoaisStore()

const mostrarModal = ref(false)
const salvando = ref(false)

const mensagem = ref('')
const mensagemTipo = ref('')

const residente = ref({
  nome: '',
  foto: null,
})

const cuidadosId = ref(null)

const cuidados = ref({
  higiene: {
    ajudaBanho: null,
    ajudaHigieneIntima: null,
    ajudaHigieneBucal: null,
    ajudaUsarBanheiro: null,
    ajudaVestirRoupas: null,
  },

  locomocao: {
    ajudaLocomocao: null,
    riscoQueda: null,
  },

  alimentacao: {
    ajudaAlimentar: null,
    possuiRestricoes: null,
  },

  observacoes: '',
})

let snapshot = null

const higieneItems = [
  { key: 'ajudaBanho', label: 'Ajuda no banho?' },
  { key: 'ajudaHigieneIntima', label: 'Ajuda na higiene intima?' },
  { key: 'ajudaHigieneBucal', label: 'Ajuda na higiene bucal?' },
  { key: 'ajudaUsarBanheiro', label: 'Ajuda ao usar o banheiro?' },
  { key: 'ajudaVestirRoupas', label: 'Ajuda para vestir roupas' },
]

const locomocaoItems = [
  { key: 'ajudaLocomocao', label: 'Ajuda na locomocao?' },
  { key: 'riscoQueda', label: 'Possui risco de queda?' },
]

const alimentacaoItems = [
  { key: 'ajudaAlimentar', label: 'Ajuda ao se alimentar?' },
  { key: 'possuiRestricoes', label: 'Possui restricoes?' },
]

const idResidente = computed(() => {
  if (props.id !== null && props.id !== undefined && props.id !== '') {
    return props.id
  }

  const params = route.params || {}
  const query = route.query || {}

  if (params.id !== undefined && params.id !== '') {
    return params.id
  }

  if (query.id !== undefined && query.id !== '') {
    return query.id
  }

  return null
})

function mostrarMensagem(texto, tipo = 'sucesso') {
  mensagem.value = texto
  mensagemTipo.value = tipo

  setTimeout(() => {
    mensagem.value = ''
    mensagemTipo.value = ''
  }, 3000)
}

function abrirModal() {
  snapshot = {
    higiene: { ...cuidados.value.higiene },
    locomocao: { ...cuidados.value.locomocao },
    alimentacao: { ...cuidados.value.alimentacao },
    observacoes: cuidados.value.observacoes,
  }

  mensagem.value = ''
  mostrarModal.value = true
}

function fecharModal() {
  if (snapshot) {
    cuidados.value.higiene = { ...snapshot.higiene }
    cuidados.value.locomocao = { ...snapshot.locomocao }
    cuidados.value.alimentacao = { ...snapshot.alimentacao }
    cuidados.value.observacoes = snapshot.observacoes
  }

  mensagem.value = ''
  mostrarModal.value = false
}

function alternarValor(secao, chave, valor) {
  if (!mostrarModal.value || salvando.value) {
    return
  }

  const valorAtual = cuidados.value[secao][chave]

  if (valorAtual === valor) {
    cuidados.value[secao][chave] = null
  } else {
    cuidados.value[secao][chave] = valor
  }
}

async function carregarDados() {
  const id = idResidente.value

  if (id === null || id === undefined || id === '') {
    mostrarMensagem('Nao foi possivel identificar o residente.', 'erro')
    return
  }

  try {
    const respostaResidente = await api.get(`/residentes/${id}/`)

    const dadosResidente = respostaResidente.data || {}
    residente.value.nome = dadosResidente.nome_completo || dadosResidente.nome || ''
    residente.value.foto = dadosResidente.foto || null
  } catch (erro) {
    console.error('ERRO AO CARREGAR:', erro.response?.data || erro)

    mostrarMensagem('Erro ao carregar os dados.', 'erro')
    return
  }

  await store.fetchPorResidente(id)

  if (store.error) {
    mostrarMensagem(store.error, 'erro')
    return
  }

  const cuidado = store.cuidadosPessoais

  if (!cuidado) {
    cuidadosId.value = null
    return
  }

  cuidadosId.value = cuidado.id

  cuidados.value.higiene.ajudaBanho = cuidado.ajuda_banho ?? null
  cuidados.value.higiene.ajudaHigieneIntima = cuidado.ajuda_higiene_intima ?? null
  cuidados.value.higiene.ajudaHigieneBucal = cuidado.ajuda_higiene_bucal ?? null
  cuidados.value.higiene.ajudaUsarBanheiro = cuidado.ajuda_usar_banheiro ?? null
  cuidados.value.higiene.ajudaVestirRoupas = cuidado.ajuda_vestir_roupas ?? null

  cuidados.value.locomocao.ajudaLocomocao = cuidado.ajuda_locomocao ?? null
  cuidados.value.locomocao.riscoQueda = cuidado.risco_queda ?? null

  cuidados.value.alimentacao.ajudaAlimentar = cuidado.ajuda_alimentar ?? null
  cuidados.value.alimentacao.possuiRestricoes = cuidado.possui_restricoes ?? null

  cuidados.value.observacoes = cuidado.observacoes || ''
}

async function salvarDados() {
  const id = idResidente.value

  if (id === null || id === undefined || id === '') {
    mostrarMensagem('Nao foi possivel identificar o residente.', 'erro')
    return
  }

  if (salvando.value) {
    return
  }

  salvando.value = true
  mensagem.value = ''

  const dados = {
    residente: Number(id),

    ajuda_banho: cuidados.value.higiene.ajudaBanho,
    ajuda_higiene_intima: cuidados.value.higiene.ajudaHigieneIntima,
    ajuda_higiene_bucal: cuidados.value.higiene.ajudaHigieneBucal,
    ajuda_usar_banheiro: cuidados.value.higiene.ajudaUsarBanheiro,
    ajuda_vestir_roupas: cuidados.value.higiene.ajudaVestirRoupas,

    ajuda_locomocao: cuidados.value.locomocao.ajudaLocomocao,
    risco_queda: cuidados.value.locomocao.riscoQueda,

    ajuda_alimentar: cuidados.value.alimentacao.ajudaAlimentar,
    possui_restricoes: cuidados.value.alimentacao.possuiRestricoes,

    observacoes: cuidados.value.observacoes,
  }

  let sucessoSalvamento

  try {
    if (cuidadosId.value) {
      sucessoSalvamento = await store.atualizarCuidadosPessoais(cuidadosId.value, dados)
    } else {
      sucessoSalvamento = await store.criarCuidadosPessoais(dados)
    }

    if (!sucessoSalvamento) {
      mostrarMensagem(store.error || 'Nao foi possivel salvar os dados.', 'erro')
      return
    }

    if (store.cuidadosPessoais?.id) {
      cuidadosId.value = store.cuidadosPessoais.id
    }

    mostrarModal.value = false
    mostrarMensagem('Dados salvos com sucesso!', 'sucesso')
  } finally {
    salvando.value = false
  }
}

onMounted(carregarDados)
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.cuidados-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: #f2f7f0;
  padding: 28px 24px 48px 24px;
}

.cuidados-painel {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(47, 90, 43, 0.06);
  padding: 40px 44px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
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

.section-title {
  margin: 0;
  color: #1f2d1c;
  font-size: 22px;
  font-weight: 800;
}

.btn-editar {
  flex-shrink: 0;
  background: #3e7a2b;
  color: #ffffff;
  border: none;
  padding: 11px 26px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-editar:hover:not(:disabled) {
  background: #2f5a2b;
}

.grid-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
  align-items: start;
  margin-bottom: 28px;
}

.coluna {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.box {
  border: 1px solid #dde7d8;
  border-radius: 10px;
  padding: 16px 20px;
}

.box h2 {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: #1f2d1c;
  line-height: 1.2;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #dde7d8;
}

.col-labels {
  display: flex;
  gap: 18px;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.6px;
  color: #4a5a47;
  flex-shrink: 0;
}

.col-labels span {
  width: 18px;
  text-align: center;
}

.check-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  min-height: 32px;
  font-size: 13px;
  font-weight: 600;
  color: #1f2d1c;
  padding: 5px 0;
}

.check-row > span {
  flex: 1;
}

.check-pair {
  display: flex;
  gap: 18px;
  flex-shrink: 0;
}

.check-box {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: block;
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  max-width: 18px;
  max-height: 18px;
  flex: 0 0 auto;
  aspect-ratio: 1 / 1;
  border: 1.5px solid #dde7d8;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  outline: none;
  line-height: 0;
  font-size: 0;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.check-box:hover:not(:disabled) {
  background: #f2f7f0;
}

.check-box.active {
  background: #3e7a2b;
  border-color: #3e7a2b;
}

.check-box:disabled {
  cursor: default;
  opacity: 0.65;
}

.box-observacoes {
  margin-top: 4px;
}

.box-observacoes h2 {
  margin-bottom: 10px;
}

textarea {
  display: block;
  width: 100%;
  min-height: 80px;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
  color: #1f2d1c;
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s ease;
}

textarea:focus:not(:disabled) {
  border-color: #3e7a2b;
}

textarea::placeholder {
  color: #8fa093;
}

textarea:disabled {
  background: #f2f7f0;
  border-color: #dde7d8;
  color: #4a5a47;
  cursor: default;
}

.error-message {
  margin: 16px 0 0 0;
  padding: 10px 14px;
  background: #fbe9e9;
  border: 1px solid #e4b4b4;
  border-radius: 8px;
  color: #8a1f1f;
  font-size: 13px;
  font-weight: 700;
}

.success-message {
  color: #2f5a2b;
  font-size: 13px;
  font-weight: 700;
  margin: 16px 0 0 0;
}

/* ---------- Modal ---------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(31, 45, 28, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-box {
  position: relative;
  width: 100%;
  max-width: 900px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 18px 48px rgba(31, 45, 28, 0.28);
  padding: 32px;
}

.btn-fechar {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-fechar:hover {
  background: #f2f7f0;
}

.btn-fechar svg {
  width: 20px;
  height: 20px;
}

.modal-titulo {
  margin: 0 0 24px 0;
  color: #2f5a2b;
  font-size: 18px;
  font-weight: 800;
}

.modal-body .grid-sections {
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 24px;
}

.btn-cancelar {
  background: transparent;
  color: #3e7a2b;
  border: 1.5px solid #3e7a2b;
  padding: 10px 20px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-cancelar:hover:not(:disabled) {
  background: #f2f7f0;
}

.btn-salvar {
  background: #3e7a2b;
  color: #ffffff;
  border: none;
  padding: 11px 26px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-salvar:hover:not(:disabled) {
  background: #2f5a2b;
}

.btn-salvar:disabled,
.btn-cancelar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .main-content {
    padding: 20px 16px 40px 16px;
  }

  .cuidados-painel {
    padding: 28px 20px;
  }

  .grid-sections {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-editar {
    align-self: flex-start;
  }

  .grid-sections {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 700px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-box {
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }
}

@media (max-width: 480px) {
  .cuidados-painel {
    padding: 20px 16px;
  }

  .section-title {
    font-size: 18px;
  }

  .box {
    padding: 12px;
  }

  .col-labels {
    gap: 10px;
  }

  .check-pair {
    gap: 10px;
  }

  .check-row {
    gap: 10px;
    font-size: 12px;
  }
}
</style>
