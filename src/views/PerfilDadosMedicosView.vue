<template>
  <div class="dados-medicos-page">
    <main class="main-content">
      <BotaoVoltar :to="{ name: 'residente', params: { id: idResidente } }" />

      <section class="dados-painel">
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

            <h1 class="section-title">Dados Médicos - {{ nomeResidente }}</h1>
          </div>

          <button class="btn-editar" @click="abrirModal">EDITAR DADOS</button>
        </div>

        <p v-if="erro" class="error-message">{{ erro }}</p>
        <p v-if="sucesso" class="success-message">{{ sucesso }}</p>

        <div class="form-grid">
          <div class="form-group">
            <label>CONDIÇÕES MÉDICAS:</label>
            <textarea :value="condicoesMedicas" disabled></textarea>
          </div>

          <div class="form-group">
            <label>ALERGIAS:</label>
            <textarea :value="alergias" disabled></textarea>
          </div>

          <div class="form-group">
            <label>OBSERVAÇÕES:</label>
            <textarea :value="observacoes" disabled></textarea>
          </div>

          <div class="form-group">
            <label>PESO E ALTURA:</label>
            <textarea :value="pesoAltura" disabled></textarea>
          </div>
        </div>

        <div class="medicamentos-section">
          <table class="medicamentos-table">
            <thead>
              <tr>
                <th>MEDICAMENTOS</th>
                <th>DOSAGEM</th>
                <th>HORÁRIO</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(med, index) in medicamentos"
                :key="index"
                @click="toggleSelecionado(index)"
              >
                <td>
                  <span class="checkbox-icon" :class="{ marcado: med.selecionado }"></span>
                  {{ med.nome || '—' }}
                </td>

                <td>{{ med.dosagem || '—' }}</td>

                <td>{{ med.horario || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
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

        <h3 class="modal-titulo">Editar dados médicos</h3>

        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label for="modal-condicoes">CONDIÇÕES MÉDICAS:</label>
              <textarea id="modal-condicoes" v-model="condicoesMedicas"></textarea>
            </div>

            <div class="form-group">
              <label for="modal-alergias">ALERGIAS:</label>
              <textarea id="modal-alergias" v-model="alergias"></textarea>
            </div>

            <div class="form-group">
              <label for="modal-observacoes">OBSERVAÇÕES:</label>
              <textarea id="modal-observacoes" v-model="observacoes"></textarea>
            </div>

            <div class="form-group">
              <label for="modal-peso">PESO E ALTURA:</label>
              <textarea id="modal-peso" v-model="pesoAltura"></textarea>
            </div>
          </div>

          <div class="medicamentos-section">
            <table class="medicamentos-table">
              <thead>
                <tr>
                  <th>MEDICAMENTOS</th>
                  <th>DOSAGEM</th>
                  <th>HORÁRIO</th>
                  <th class="th-acao"></th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(med, index) in medicamentos" :key="index">
                  <td>
                    <input v-model="med.nome" class="med-input" placeholder="Nome do medicamento" />
                  </td>

                  <td>
                    <input v-model="med.dosagem" class="med-input" placeholder="Dosagem" />
                  </td>

                  <td>
                    <input v-model="med.horario" class="med-input" placeholder="Horário" />
                  </td>

                  <td class="td-acao">
                    <button
                      type="button"
                      class="btn-remover"
                      title="Excluir medicamento"
                      @click="removerMedicamento(index)"
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
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <button class="btn-adicionar" type="button" @click="adicionarMedicamento">
              + ADICIONAR MEDICAMENTO
            </button>
          </div>
        </div>

        <p v-if="erro" class="error-message">{{ erro }}</p>

        <div class="modal-footer">
          <button class="btn-cancelar" type="button" :disabled="carregando" @click="fecharModal">
            CANCELAR
          </button>

          <button class="btn-salvar" type="button" :disabled="carregando" @click="handleSalvar">
            {{ carregando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES' }}
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
import { useDadosMedicosStore } from '@/stores/dadosmedicos'
import BotaoVoltar from '@/components/BotaoVoltar.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
})

const route = useRoute()
const store = useDadosMedicosStore()

const nomeResidente = ref('')
const residente = ref({ foto: null })
const mostrarModal = ref(false)
const condicoesMedicas = ref('')
const alergias = ref('')
const observacoes = ref('')
const pesoAltura = ref('')
const medicamentos = ref([])
const erro = ref('')
const sucesso = ref('')
const carregando = ref(false)

let snapshot = null

const idResidente = computed(() => {
  if (props.id !== null && props.id !== undefined && props.id !== '') {
    return props.id
  }

  const params = route.params || {}
  if (params.id !== undefined && params.id !== '') {
    return params.id
  }

  return null
})

async function carregarResidente() {
  const id = idResidente.value

  if (!id) return

  try {
    const resposta = await api.get(`/residentes/${id}/`)
    nomeResidente.value = resposta.data?.nome_completo || resposta.data?.nome || ''
    residente.value.foto = resposta.data?.foto || null
  } catch (erroCarregar) {
    console.error('Erro ao carregar residente:', erroCarregar)
  }
}

async function carregarDadosMedicos() {
  const id = idResidente.value

  if (!id) return

  await store.fetchPorResidente(id)

  if (store.error) {
    erro.value = store.error
    return
  }

  const dados = store.dadosMedicos

  if (!dados) return

  condicoesMedicas.value = dados.condicoes_medicas || ''
  alergias.value = dados.alergias || ''
  observacoes.value = dados.observacoes || ''
  pesoAltura.value = dados.peso_altura || ''

  medicamentos.value = (dados.medicacoes || []).map((med) => ({
    nome: med.nome || '',
    dosagem: med.dosagem || '',
    horario: med.horario || '',
    selecionado: false,
  }))
}

function abrirModal() {
  snapshot = {
    condicoesMedicas: condicoesMedicas.value,
    alergias: alergias.value,
    observacoes: observacoes.value,
    pesoAltura: pesoAltura.value,
    medicamentos: medicamentos.value.map((med) => ({ ...med })),
  }

  erro.value = ''
  sucesso.value = ''
  mostrarModal.value = true
}

function fecharModal() {
  if (snapshot) {
    condicoesMedicas.value = snapshot.condicoesMedicas
    alergias.value = snapshot.alergias
    observacoes.value = snapshot.observacoes
    pesoAltura.value = snapshot.pesoAltura
    medicamentos.value = snapshot.medicamentos
  }

  erro.value = ''
  mostrarModal.value = false
}

function toggleSelecionado(index) {
  medicamentos.value[index].selecionado = !medicamentos.value[index].selecionado
}

function adicionarMedicamento() {
  medicamentos.value.push({ nome: '', dosagem: '', horario: '', selecionado: false })
}

function removerMedicamento(index) {
  medicamentos.value.splice(index, 1)
}

async function handleSalvar() {
  erro.value = ''
  sucesso.value = ''
  carregando.value = true

  const dados = {
    residente: Number(idResidente.value),
    condicoes_medicas: condicoesMedicas.value,
    alergias: alergias.value,
    observacoes: observacoes.value,
    peso_altura: pesoAltura.value,
    medicacoes: medicamentos.value
      .filter((med) => med.nome && med.nome.trim() !== '')
      .map((med) => ({
        nome: med.nome,
        dosagem: med.dosagem,
        horario: med.horario,
      })),
  }

  try {
    let sucessoSalvamento

    if (store.dadosMedicos?.id) {
      sucessoSalvamento = await store.atualizarDadosMedicos(store.dadosMedicos.id, dados)
    } else {
      sucessoSalvamento = await store.criarDadosMedicos(dados)
    }

    if (!sucessoSalvamento) {
      erro.value = store.error || 'Erro ao salvar. Tente novamente.'
      return
    }

    sucesso.value = 'Dados salvos com sucesso!'
    mostrarModal.value = false
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarResidente()
  carregarDadosMedicos()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.dados-medicos-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: #f2f7f0;
  padding: 28px 24px 48px 24px;
}

/* Painel: card branco que agrupa os dados médicos do residente. */
.dados-painel {
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
  margin-bottom: 28px;
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
  display: flex;
  align-items: center;
  margin: 0;
  color: #1f2d1c;
  font-size: 22px;
  font-weight: 800;
}

.btn-editar {
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

.btn-editar:hover {
  background: #2f5a2b;
}

/* Mensagens */
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

.success-message {
  color: #2f5a2b;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

/* Grid 2x2 */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 32px;
  margin-bottom: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  color: #1f2d1c;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.form-group textarea {
  width: 100%;
  min-height: 100px;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 13px;
  color: #1f2d1c;
  resize: vertical;
  outline: none;
  background: #ffffff;
  transition: border-color 0.15s ease;
}

.form-group textarea:disabled {
  background: #f2f7f0;
  border-color: #dde7d8;
  color: #4a5a47;
  cursor: default;
}

.form-group textarea:focus:not(:disabled) {
  border-color: #3e7a2b;
}

/* Tabela de medicamentos */
.medicamentos-section {
  border: 1px solid #dde7d8;
  border-radius: 10px;
  overflow: hidden;
}

.medicamentos-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.medicamentos-table th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: #1f2d1c;
  background: #e8f1e3;
  border-bottom: 1px solid #dde7d8;
}

.medicamentos-table td {
  padding: 11px 16px;
  color: #1f2d1c;
  border-bottom: 1px solid #dde7d8;
}

.medicamentos-table tbody tr:last-child td {
  border-bottom: none;
}

.medicamentos-table tbody tr {
  cursor: pointer;
  transition: background 0.15s ease;
}

.medicamentos-table tbody tr:hover {
  background: #f2f7f0;
}

.checkbox-icon {
  display: inline-block;
  width: 16px;
  height: 13px;
  margin-right: 10px;
  vertical-align: middle;
  border-radius: 4px;
  border: 1px solid #dde7d8;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.checkbox-icon.marcado {
  background: #3e7a2b;
  border-color: #3e7a2b;
}

.med-input {
  width: calc(100% - 26px);
  border: none;
  border-bottom: 1px solid #dde7d8;
  background: transparent;
  color: #1f2d1c;
  font-family: inherit;
  font-size: 13px;
  padding: 2px 4px;
  outline: none;
}

.med-input::placeholder {
  color: #8fa093;
}

.med-input:focus {
  border-bottom-color: #3e7a2b;
}

/* Botão adicionar medicamento */
.btn-adicionar {
  display: block;
  width: 100%;
  background: #e8f1e3;
  border: none;
  border-top: 1px solid #dde7d8;
  color: #2f5a2b;
  font-family: inherit;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.6px;
  padding: 13px 14px;
  cursor: pointer;
  text-align: center;
  transition: background 0.2s ease;
}

.btn-adicionar:hover {
  background: #f2f7f0;
}

.th-acao {
  width: 48px;
}

.td-acao {
  text-align: center;
  width: 48px;
}

.btn-remover {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #8fa093;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    color 0.15s ease,
    background 0.15s ease;
}

.btn-remover:hover {
  color: #8a1f1f;
  background: #fbe9e9;
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
  max-width: 820px;
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

.modal-body {
  display: flex;
  flex-direction: column;
}

/* No modal as linhas da tabela não são clicáveis. */
.modal-box .medicamentos-table tbody tr {
  cursor: default;
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
  border: none;
  color: #ffffff;
  font-family: inherit;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  padding: 12px 34px;
  border-radius: 8px;
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

  .dados-painel {
    padding: 28px 20px;
  }

  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-editar {
    align-self: flex-start;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .medicamentos-section {
    overflow-x: auto;
  }

  .btn-salvar {
    width: 100%;
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
</style>
