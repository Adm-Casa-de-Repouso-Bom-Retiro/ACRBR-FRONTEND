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

          <div class="acoes-header">
            <button v-if="!editando" class="btn-editar" @click="iniciarEdicao">EDITAR DADOS</button>

            <template v-else>
              <button class="btn-cancelar" type="button" @click="cancelarEdicao">CANCELAR</button>

              <button class="btn-salvar" type="button" @click="handleSalvar">SALVAR</button>
            </template>
          </div>
        </div>

        <p v-if="store.error" class="error-message">{{ store.error }}</p>
        <p v-if="sucesso" class="success-message">{{ sucesso }}</p>
        <p v-if="store.loading" class="loading-message">
          {{ editando ? 'Salvando dados...' : 'Carregando dados...' }}
        </p>

        <div class="form-grid">
          <!-- CONDIÇÕES MÉDICAS -->
          <div class="form-group">
            <label>CONDIÇÕES MÉDICAS:</label>

            <template v-if="!editando">
              <div v-if="condicoes.length" class="chip-lista">
                <span v-for="item in condicoes" :key="item" class="chip-item">{{ item }}</span>
              </div>

              <p v-else class="valor-vazio">Nenhuma condição registrada</p>
            </template>

            <template v-else>
              <div v-if="condicoes.length" class="chip-lista">
                <span v-for="(item, index) in condicoes" :key="index" class="chip-item">
                  {{ item }}
                  <button
                    type="button"
                    class="chip-remover"
                    title="Remover"
                    @click="removerCondicao(index)"
                  >
                    &times;
                  </button>
                </span>
              </div>

              <div class="chip-add">
                <input
                  v-model="novaCondicao"
                  type="text"
                  class="campo-texto"
                  placeholder="Nova condição médica"
                  @keyup.enter="adicionarCondicao"
                />

                <button type="button" class="btn-adicionar-item" @click="adicionarCondicao">
                  Adicionar
                </button>
              </div>
            </template>
          </div>

          <!-- ALERGIAS -->
          <div class="form-group">
            <label>ALERGIAS:</label>

            <template v-if="!editando">
              <span v-if="semAlergiasConhecidas" class="chip-item chip-item--alergia">
                Sem alergias conhecidas
              </span>

              <template v-else>
                <div v-if="alergias.length" class="chip-lista">
                  <span v-for="item in alergias" :key="item" class="chip-item chip-item--alergia">
                    {{ item }}
                  </span>
                </div>

                <p v-else class="valor-vazio">Nenhuma alergia registrada</p>
              </template>
            </template>

            <template v-else>
              <label class="checkbox-alergias">
                <input v-model="semAlergiasConhecidas" type="checkbox" />
                <span>Sem alergias conhecidas</span>
              </label>

              <template v-if="!semAlergiasConhecidas">
                <div v-if="alergias.length" class="chip-lista">
                  <span
                    v-for="(item, index) in alergias"
                    :key="index"
                    class="chip-item chip-item--alergia"
                  >
                    {{ item }}
                    <button
                      type="button"
                      class="chip-remover"
                      title="Remover"
                      @click="removerAlergia(index)"
                    >
                      &times;
                    </button>
                  </span>
                </div>

                <div class="chip-add">
                  <input
                    v-model="novaAlergia"
                    type="text"
                    class="campo-texto"
                    placeholder="Nova alergia"
                    @keyup.enter="adicionarAlergia"
                  />

                  <button type="button" class="btn-adicionar-item" @click="adicionarAlergia">
                    Adicionar
                  </button>
                </div>
              </template>
            </template>
          </div>

          <!-- PESO E ALTURA -->
          <div class="form-group">
            <label>PESO E ALTURA:</label>

            <template v-if="!editando">
              <div class="medida-linha">
                <div class="medida">
                  <span class="medida-valor">{{ peso ? `${formatarNumero(peso)} kg` : '—' }}</span>
                  <span class="medida-rotulo">Peso</span>
                </div>

                <div class="medida">
                  <span class="medida-valor">{{
                    altura ? `${formatarNumero(altura)} cm` : '—'
                  }}</span>
                  <span class="medida-rotulo">Altura</span>
                </div>
              </div>

              <p v-if="mostrarPesoAlturaLegado" class="valor-legado">
                Registro anterior: {{ pesoAlturaLegado }}
              </p>
            </template>

            <template v-else>
              <div class="medida-linha">
                <div class="campo-medida">
                  <label for="campo-peso">PESO (KG)</label>

                  <div class="input-unidade">
                    <input
                      id="campo-peso"
                      v-model="peso"
                      type="number"
                      min="1"
                      max="400"
                      step="0.1"
                      class="campo-numero"
                      placeholder="—"
                      title="Aceita ponto ou vírgula nos decimais"
                      @keydown="tratarTeclaNumero"
                      @paste="colarNumero"
                    />

                    <span class="unidade">kg</span>
                  </div>
                </div>

                <div class="campo-medida">
                  <label for="campo-altura">ALTURA (CM)</label>

                  <div class="input-unidade">
                    <input
                      id="campo-altura"
                      v-model="altura"
                      type="number"
                      min="30"
                      max="250"
                      step="0.1"
                      class="campo-numero"
                      placeholder="—"
                      title="Aceita ponto ou vírgula nos decimais"
                      @keydown="tratarTeclaNumero"
                      @paste="colarNumero"
                    />

                    <span class="unidade">cm</span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- OBSERVAÇÕES -->
          <div class="form-group">
            <label>OBSERVAÇÕES:</label>

            <template v-if="!editando">
              <div class="bloco-texto">
                <p v-if="observacoes" class="texto-observacoes">{{ observacoes }}</p>
                <p v-else class="valor-vazio">Sem observações</p>
              </div>
            </template>

            <template v-else>
              <textarea
                id="campo-observacoes"
                v-model="observacoes"
                class="campo-area"
                maxlength="500"
                rows="4"
                placeholder="Registre observações relevantes"
              ></textarea>

              <span class="contador">{{ observacoes.length }}/500</span>
            </template>
          </div>
        </div>

        <div class="medicamentos-section">
          <table class="medicamentos-table">
            <thead>
              <tr>
                <th>MEDICAMENTOS</th>
                <th>DOSAGEM</th>
                <th>HORÁRIO</th>
                <th v-if="editando" class="th-acao"></th>
              </tr>
            </thead>

            <tbody v-if="!editando">
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

            <tbody v-else>
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

          <button v-if="editando" class="btn-adicionar" type="button" @click="adicionarMedicamento">
            + ADICIONAR MEDICAMENTO
          </button>
        </div>
      </section>
    </main>
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

const editando = ref(false)
const nomeResidente = ref('')
const residente = ref({ foto: null })
const condicoes = ref([])
const alergias = ref([])
const observacoes = ref('')
const peso = ref('')
const altura = ref('')
const semAlergiasConhecidas = ref(false)
const pesoAlturaLegado = ref('')
const medicamentos = ref([])
const novaCondicao = ref('')
const novaAlergia = ref('')
const sucesso = ref('')

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

const mostrarPesoAlturaLegado = computed(
  () => !!pesoAlturaLegado.value && !peso.value && !altura.value,
)

function textoParaLista(texto) {
  if (!texto) return []

  return String(texto)
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item !== '')
}

function normalizar(texto) {
  return texto.trim().toLowerCase()
}

function formatarNumero(valor) {
  const numero = Number(valor)

  if (Number.isNaN(numero)) return ''

  return numero.toLocaleString('pt-BR')
}

function paraNumero(valor) {
  if (valor === null || valor === undefined || String(valor).trim() === '') return null

  const numero = Number(valor)

  return Number.isNaN(numero) ? null : numero
}

/* O campo type="number" descarta a vírgula e zera o valor, então ela é
   transformada em ponto antes de chegar no navegador. */
let virgulaPendente = false

function tratarTeclaNumero(evento) {
  const campo = evento.target

  if (evento.key === ',') {
    evento.preventDefault()

    if (campo.value && !campo.value.includes('.')) {
      virgulaPendente = true
    }

    return
  }

  if (virgulaPendente && /^[0-9]$/.test(evento.key)) {
    evento.preventDefault()
    campo.value = `${campo.value}.${evento.key}`
    campo.dispatchEvent(new Event('input'))
    virgulaPendente = false
    return
  }

  virgulaPendente = false
}

function colarNumero(evento) {
  const texto = (evento.clipboardData?.getData('text') || '').trim().replace(',', '.')

  if (!texto) return

  evento.preventDefault()

  const campo = evento.target
  campo.value = texto.endsWith('.') ? `${texto}0` : texto
  campo.dispatchEvent(new Event('input'))
}

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

  if (store.error) return

  const dados = store.dadosMedicos

  if (!dados) return

  condicoes.value = textoParaLista(dados.condicoes_medicas)
  alergias.value = textoParaLista(dados.alergias)
  observacoes.value = dados.observacoes || ''
  peso.value = dados.peso === null || dados.peso === undefined ? '' : String(dados.peso)
  altura.value = dados.altura === null || dados.altura === undefined ? '' : String(dados.altura)
  semAlergiasConhecidas.value = !!dados.sem_alergias_conhecidas
  pesoAlturaLegado.value = dados.peso_altura || ''

  medicamentos.value = (dados.medicacoes || []).map((med) => ({
    nome: med.nome || '',
    dosagem: med.dosagem || '',
    horario: med.horario || '',
    selecionado: false,
  }))
}

function iniciarEdicao() {
  snapshot = {
    condicoes: [...condicoes.value],
    alergias: [...alergias.value],
    observacoes: observacoes.value,
    peso: peso.value,
    altura: altura.value,
    semAlergiasConhecidas: semAlergiasConhecidas.value,
    medicamentos: medicamentos.value.map((med) => ({ ...med })),
  }

  novaCondicao.value = ''
  novaAlergia.value = ''
  sucesso.value = ''
  editando.value = true
}

function cancelarEdicao() {
  if (snapshot) {
    condicoes.value = [...snapshot.condicoes]
    alergias.value = [...snapshot.alergias]
    observacoes.value = snapshot.observacoes
    peso.value = snapshot.peso
    altura.value = snapshot.altura
    semAlergiasConhecidas.value = snapshot.semAlergiasConhecidas
    medicamentos.value = snapshot.medicamentos.map((med) => ({ ...med }))
  }

  novaCondicao.value = ''
  novaAlergia.value = ''
  sucesso.value = ''
  editando.value = false
}

function adicionarCondicao() {
  const item = novaCondicao.value.trim()

  if (!item) return
  if (condicoes.value.some((condicao) => normalizar(condicao) === normalizar(item))) return

  condicoes.value.push(item)
  novaCondicao.value = ''
}

function removerCondicao(index) {
  condicoes.value.splice(index, 1)
}

function adicionarAlergia() {
  const item = novaAlergia.value.trim()

  if (!item) return
  if (alergias.value.some((alergia) => normalizar(alergia) === normalizar(item))) return

  alergias.value.push(item)
  novaAlergia.value = ''
}

function removerAlergia(index) {
  alergias.value.splice(index, 1)
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
  sucesso.value = ''

  const dados = {
    residente: Number(idResidente.value),
    condicoes_medicas: condicoes.value.join('\n'),
    alergias: semAlergiasConhecidas.value ? '' : alergias.value.join('\n'),
    observacoes: observacoes.value,
    peso: paraNumero(peso.value),
    altura: paraNumero(altura.value),
    sem_alergias_conhecidas: semAlergiasConhecidas.value,
    medicacoes: medicamentos.value
      .filter((med) => med.nome && med.nome.trim() !== '')
      .map((med) => ({
        nome: med.nome,
        dosagem: med.dosagem,
        horario: med.horario,
      })),
  }

  let salvou

  if (store.dadosMedicos?.id) {
    salvou = await store.atualizarDadosMedicos(store.dadosMedicos.id, dados)
  } else {
    salvou = await store.criarDadosMedicos(dados)
  }

  if (!salvou) return

  const salvo = store.dadosMedicos

  if (salvo) {
    condicoes.value = textoParaLista(salvo.condicoes_medicas)
    alergias.value = textoParaLista(salvo.alergias)
    observacoes.value = salvo.observacoes || ''
    peso.value = salvo.peso === null || salvo.peso === undefined ? '' : String(salvo.peso)
    altura.value = salvo.altura === null || salvo.altura === undefined ? '' : String(salvo.altura)
    semAlergiasConhecidas.value = !!salvo.sem_alergias_conhecidas
  }

  sucesso.value = 'Dados salvos com sucesso!'
  snapshot = null
  editando.value = false
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

.acoes-header {
  display: flex;
  align-items: center;
  gap: 10px;
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

.btn-salvar {
  background: #3e7a2b;
  border: none;
  color: #ffffff;
  font-family: inherit;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 11px 26px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-salvar:hover {
  background: #2f5a2b;
}

.btn-cancelar {
  background: transparent;
  color: #3e7a2b;
  border: 1.5px solid #3e7a2b;
  padding: 10px 22px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-cancelar:hover {
  background: #f2f7f0;
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

.loading-message {
  color: #4a5a47;
  font-size: 13px;
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

/* Chips de condições e alergias */
.chip-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 0;
}

.chip-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e8f1e3;
  color: #2f5a2b;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
}

.chip-item--alergia {
  background: #fff4e0;
  color: #7a4b00;
}

.chip-remover {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font-family: inherit;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.65;
}

.chip-remover:hover {
  opacity: 1;
}

.chip-add {
  display: flex;
  gap: 8px;
  align-items: center;
}

.campo-texto {
  flex: 1;
  min-width: 0;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  padding: 9px 12px;
  font-family: inherit;
  font-size: 13px;
  color: #1f2d1c;
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s ease;
}

.campo-texto:focus {
  border-color: #3e7a2b;
}

.btn-adicionar-item {
  background: #e8f1e3;
  border: 1px solid #dde7d8;
  color: #2f5a2b;
  font-family: inherit;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.4px;
  padding: 9px 16px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;
}

.btn-adicionar-item:hover {
  background: #f2f7f0;
}

/* Checkbox de alergias conhecidas */
.form-group .checkbox-alergias {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1f2d1c;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
  cursor: pointer;
}

.checkbox-alergias input {
  width: 16px;
  height: 16px;
  accent-color: #3e7a2b;
  cursor: pointer;
}

/* Peso e altura */
.medida-linha {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  padding: 10px 0;
}

.medida {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.medida-valor {
  color: #1f2d1c;
  font-size: 18px;
  font-weight: 700;
}

.medida-rotulo {
  color: #4a5a47;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.valor-legado {
  margin: 0;
  color: #4a5a47;
  font-size: 12px;
  font-style: italic;
}

.campo-medida {
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
  min-width: 150px;
}

.input-unidade {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  padding: 0 12px;
  background: #ffffff;
  transition: border-color 0.15s ease;
}

.input-unidade:focus-within {
  border-color: #3e7a2b;
}

.campo-numero {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  padding: 9px 0;
  font-family: inherit;
  font-size: 13px;
  color: #1f2d1c;
  background: transparent;
}

.unidade {
  color: #4a5a47;
  font-size: 12px;
  font-weight: 700;
}

/* Observações */
.bloco-texto {
  border: 1px solid #dde7d8;
  border-radius: 8px;
  padding: 12px 14px;
  background: #ffffff;
}

.texto-observacoes {
  margin: 0;
  color: #1f2d1c;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.campo-area {
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

.campo-area:focus {
  border-color: #3e7a2b;
}

.contador {
  align-self: flex-end;
  color: #4a5a47;
  font-size: 12px;
  font-weight: 600;
}

/* Valores vazios */
.valor-vazio {
  margin: 0;
  padding: 10px 0;
  color: #4a5a47;
  font-size: 13px;
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
    border 0.15s ease;
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

  .acoes-header {
    flex-wrap: wrap;
  }

  .btn-editar {
    align-self: flex-start;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .medida-linha {
    flex-direction: column;
    gap: 16px;
  }

  .chip-add {
    flex-direction: column;
    align-items: stretch;
  }

  .medicamentos-section {
    overflow-x: auto;
  }

  .btn-salvar {
    flex: 1;
  }
}
</style>
