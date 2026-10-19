<template>
  <div class="perfil-view">
    <div class="topo-voltar">
      <BotaoVoltar to="/prontuario" />
    </div>

    <div class="faixa-verde">
      <h1 class="faixa-titulo">Perfil do Residente</h1>
    </div>

    <main class="main-content">
      <p v-if="erro" class="error-message">{{ erro }}</p>

      <div v-if="carregando" class="loading-message">Carregando dados do residente...</div>

      <section v-else-if="residente" class="perfil-card">
        <div class="foto-coluna">
          <div class="foto-box" :class="{ 'foto-box--vazia': !residente.foto }">
            <img
              v-if="residente.foto"
              :src="residente.foto.url"
              alt="Foto do residente"
              class="foto-img"
            />

            <svg
              v-else
              class="icone-foto-vazia"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 2.1c-3.5 0-7 1.76-7 5.25V21h14v-1.65c0-3.49-3.5-5.25-7-5.25Z"
                fill="#3e7a2b"
                opacity="0.75"
              />
            </svg>
          </div>

          <h2 class="section-title">{{ residente.nome_completo || '...' }}</h2>

          <div class="grau-badge">
            <span>{{ grauFormatado }}</span>
          </div>

          <div class="acoes-coluna">
            <button class="btn-editar" @click="abrirModal">EDITAR DADOS</button>
          </div>
        </div>

        <div class="info-coluna">
          <h3 class="bloco-titulo">Informações do residente</h3>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-icone">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="3.5"
                    y="5"
                    width="17"
                    height="15"
                    rx="2"
                    stroke="#3e7a2b"
                    stroke-width="1.6"
                  />
                  <path
                    d="M3.5 9.5h17M8 3.5v3M16 3.5v3"
                    stroke="#3e7a2b"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                </svg>
              </span>

              <div class="info-texto">
                <span class="info-label">Nascimento</span>
                <span class="info-valor">{{ formatarData(residente.data_nascimento) }}</span>
              </div>
            </div>

            <div class="info-item">
              <span class="info-icone">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8.5" stroke="#3e7a2b" stroke-width="1.6" />
                  <path
                    d="M12 7.5V12l3 1.8"
                    stroke="#3e7a2b"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>

              <div class="info-texto">
                <span class="info-label">Idade</span>
                <span class="info-valor">
                  {{ calcularIdade(residente.data_nascimento) ?? '—' }} anos
                </span>
              </div>
            </div>

            <div class="info-item">
              <span class="info-icone">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="3.5"
                    y="5"
                    width="17"
                    height="15"
                    rx="2"
                    stroke="#3e7a2b"
                    stroke-width="1.6"
                  />
                  <path
                    d="M8 3.5v3M16 3.5v3M8 13.5l2.5 2.5 5-5"
                    stroke="#3e7a2b"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>

              <div class="info-texto">
                <span class="info-label">Data de entrada</span>
                <span class="info-valor">{{ formatarData(residente.data_admissao) }}</span>
              </div>
            </div>

            <div class="info-item">
              <span class="info-icone">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 20v-9M20 20v-9M4 14h16v6M4 20h16"
                    stroke="#3e7a2b"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 11V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"
                    stroke="#3e7a2b"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                </svg>
              </span>

              <div class="info-texto">
                <span class="info-label">Quarto</span>
                <span class="info-valor">{{ residente.quarto || '—' }}</span>
              </div>
            </div>
          </div>

          <div class="grupo-grau">
            <h3 class="dependencia-titulo">Grau de Dependência</h3>

            <div class="dependencia-item">
              <span
                class="dependencia-marcador"
                :class="{ ativo: numeroGrau(residente.grau_dependencia) === 1 }"
              ></span>
              Grau 1 - Independente
            </div>

            <div class="dependencia-item">
              <span
                class="dependencia-marcador"
                :class="{ ativo: numeroGrau(residente.grau_dependencia) === 2 }"
              ></span>
              Grau 2 - Necessita auxílio parcial
            </div>

            <div class="dependencia-item">
              <span
                class="dependencia-marcador"
                :class="{ ativo: numeroGrau(residente.grau_dependencia) === 3 }"
              ></span>
              Grau 3 - Dependência total
            </div>
          </div>

          <nav class="perfil-menu">
            <button class="btn-menu" @click="irPara('perfildadosmedicos')">DADOS MÉDICOS</button>

            <button
              class="btn-menu"
              @click="irPara('contatosprontuario', { params: { id: residente.id } })"
            >
              CONTATOS
            </button>

            <button class="btn-menu" @click="irPara('cuidadospessoais')">CUIDADOS PESSOAIS</button>

            <button class="btn-menu" @click="irPara('historico')">HISTÓRICO</button>

            <button class="btn-menu" @click="irPara('calendario')">CALENDÁRIO</button>

            <button class="btn-menu" @click="irPara('nutricao')">NUTRIÇÃO</button>
          </nav>

          <div class="observacoes-box">
            <span class="label">Observações:</span>
            <p class="observacoes-texto">{{ residente.observacoes || '—' }}</p>
          </div>
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

        <div class="modal-esquerda">
          <button type="button" class="modal-foto" @click="abrirSeletorFoto">
            <img v-if="fotoAtual" :src="fotoAtual" alt="Foto do residente" class="modal-foto-img" />

            <span class="modal-foto-overlay">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 8a2 2 0 0 1 2-2h1.17a2 2 0 0 0 1.63-.84l.4-.57A2 2 0 0 1 10.8 3.6h2.4a2 2 0 0 1 1.6.98l.4.57A2 2 0 0 0 16.83 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
                  stroke="#ffffff"
                  stroke-width="1.5"
                />
                <circle cx="12" cy="13" r="3.2" stroke="#ffffff" stroke-width="1.5" />
              </svg>
              <span>Clique para trocar a foto</span>
            </span>
          </button>

          <input
            ref="inputFoto"
            type="file"
            accept="image/*"
            class="input-foto-oculto"
            @change="selecionarFoto"
          />

          <nav class="modal-tabs">
            <button
              type="button"
              class="modal-tab"
              :class="{ 'modal-tab--ativa': abaAtiva === 'dados' }"
              @click="abaAtiva = 'dados'"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 2.1c-3.5 0-7 1.76-7 5.25V21h14v-1.65c0-3.49-3.5-5.25-7-5.25Z"
                  fill="currentColor"
                />
              </svg>
              <span>Dados pessoais</span>
            </button>

            <button
              type="button"
              class="modal-tab"
              :class="{ 'modal-tab--ativa': abaAtiva === 'info' }"
              @click="abaAtiva = 'info'"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
                <path
                  d="M12 11v5"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
                <circle cx="12" cy="8" r="1" fill="currentColor" />
              </svg>
              <span>Informações</span>
            </button>
          </nav>
        </div>

        <div class="modal-direita">
          <h3 class="modal-titulo">
            {{ abaAtiva === 'dados' ? 'Dados pessoais' : 'Informações' }}
          </h3>

          <div v-if="abaAtiva === 'dados'" class="modal-form">
            <div class="form-group">
              <label for="modal-nome">NOME COMPLETO</label>
              <input id="modal-nome" v-model="form.nome_completo" type="text" />
            </div>

            <div class="form-group">
              <label for="modal-nascimento">DATA DE NASCIMENTO</label>
              <input id="modal-nascimento" v-model="form.data_nascimento" type="date" />
            </div>

            <div class="form-group">
              <label for="modal-quarto">QUARTO</label>
              <input id="modal-quarto" v-model="form.quarto" type="text" />
            </div>

            <div class="form-group">
              <span class="campo-label">GRAU DE DEPENDÊNCIA</span>

              <div class="opcoes-grau">
                <label class="opcao-grau">
                  <input v-model="form.grau_dependencia" type="radio" value="grau_1" name="grau" />
                  <span class="marcador"></span>
                  <span class="opcao-texto">Grau 1 - Independente</span>
                </label>

                <label class="opcao-grau">
                  <input v-model="form.grau_dependencia" type="radio" value="grau_2" name="grau" />
                  <span class="marcador"></span>
                  <span class="opcao-texto">Grau 2 - Necessita auxílio parcial</span>
                </label>

                <label class="opcao-grau">
                  <input v-model="form.grau_dependencia" type="radio" value="grau_3" name="grau" />
                  <span class="marcador"></span>
                  <span class="opcao-texto">Grau 3 - Dependência total</span>
                </label>
              </div>
            </div>
          </div>

          <div v-else-if="abaAtiva === 'info'" class="modal-form">
            <div class="form-group">
              <label for="modal-entrada">DATA DE ENTRADA</label>
              <input id="modal-entrada" v-model="form.data_admissao" type="date" />
            </div>

            <div class="form-group">
              <label for="modal-idade">IDADE</label>
              <input
                id="modal-idade"
                :value="`${calcularIdade(residente.data_nascimento) ?? '—'} anos`"
                type="text"
                readonly
                class="campo-readonly"
              />
            </div>

            <div class="form-group">
              <label for="modal-observacoes">OBSERVAÇÕES</label>
              <textarea id="modal-observacoes" v-model="form.observacoes" rows="3"></textarea>
            </div>
          </div>

          <p v-if="store.error" class="error-message">{{ store.error }}</p>
          <p v-if="store.loading" class="loading-message">Salvando...</p>
          <p v-if="sucesso" class="success-message">{{ sucesso }}</p>

          <div class="modal-footer">
            <button class="btn-atualizar" type="button" @click="handleAtualizar">ATUALIZAR</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api, { uploadImagem } from '@/services/api'
import { useResidentesStore } from '@/stores/residentes'
import BotaoVoltar from '@/components/BotaoVoltar.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const router = useRouter()
const store = useResidentesStore()

const residente = ref(null)
const carregando = ref(false)
const erro = ref('')

const mostrarModal = ref(false)
const abaAtiva = ref('dados')
const sucesso = ref('')
const fotoArquivo = ref(null)
const fotoPreview = ref('')
const inputFoto = ref(null)

const form = ref({
  nome_completo: '',
  data_nascimento: '',
  data_admissao: '',
  quarto: '',
  grau_dependencia: 'grau_1',
  observacoes: '',
})

const grauTextos = {
  1: 'Grau 1 - Independente',
  2: 'Grau 2 - Necessita auxílio parcial',
  3: 'Grau 3 - Dependência total',
}

const grauFormatado = computed(
  () => grauTextos[numeroGrau(residente.value?.grau_dependencia)] || '—',
)

const fotoAtual = computed(() => fotoPreview.value || residente.value?.foto?.url || '')

// A API pode devolver datas como "AAAA-MM-DD" ou datetime ISO completo;
// fatiamos a parte da data para evitar deslocamento de fuso horário.
function formatarData(valor) {
  if (!valor) return '—'

  const [ano, mes, dia] = String(valor).slice(0, 10).split('-')

  if (!ano || !mes || !dia) return valor

  return `${dia}/${mes}/${ano}`
}

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

// A API devolve o grau como texto ("grau_1", "grau_2", "grau_3");
// extraímos o número para tolerar também o formato numérico.
function numeroGrau(grau) {
  if (grau === null || grau === undefined) return null

  const numero = parseInt(String(grau).replace(/\D/g, ''), 10)

  return Number.isNaN(numero) ? null : numero
}

async function buscarResidente() {
  carregando.value = true
  erro.value = ''

  try {
    const resposta = await api.get(`/residentes/${props.id}/`)
    residente.value = resposta.data
  } catch (error) {
    erro.value = 'Erro ao carregar dados do residente.'
    residente.value = null
  } finally {
    carregando.value = false
  }
}

function irPara(nomeRota) {
  router.push({ name: nomeRota, params: { id: props.id } })
}

function abrirModal() {
  form.value.nome_completo = residente.value?.nome_completo || ''
  form.value.data_nascimento = String(residente.value?.data_nascimento || '').slice(0, 10)
  form.value.data_admissao = String(residente.value?.data_admissao || '').slice(0, 10)
  form.value.quarto = residente.value?.quarto || ''
  form.value.grau_dependencia = residente.value?.grau_dependencia || 'grau_1'
  form.value.observacoes = residente.value?.observacoes || ''

  abaAtiva.value = 'dados'
  sucesso.value = ''
  fotoArquivo.value = null
  fotoPreview.value = ''
  store.error = ''
  mostrarModal.value = true
}

function fecharModal() {
  mostrarModal.value = false
}

function abrirSeletorFoto() {
  inputFoto.value.click()
}

function selecionarFoto(evento) {
  const arquivo = evento.target.files[0]

  if (!arquivo) return

  fotoArquivo.value = arquivo
  fotoPreview.value = URL.createObjectURL(arquivo)
}

async function handleAtualizar() {
  sucesso.value = ''
  store.error = ''

  if (!form.value.nome_completo.trim()) {
    store.error = 'Informe o nome completo do residente.'
    return
  }

  const dados = {
    nome_completo: form.value.nome_completo,
    data_nascimento: form.value.data_nascimento || null,
    data_admissao: form.value.data_admissao || null,
    quarto: form.value.quarto,
    grau_dependencia: form.value.grau_dependencia,
    observacoes: form.value.observacoes,
  }

  if (fotoArquivo.value) {
    try {
      const imagem = await uploadImagem(fotoArquivo.value, form.value.nome_completo)

      if (imagem?.attachment_key) {
        dados.foto_attachment_key = imagem.attachment_key
      }
    } catch (erroUpload) {
      store.error = 'Erro ao enviar a foto.'
      return
    }
  }

  const atualizado = await store.atualizarResidente(props.id, dados)

  if (atualizado) {
    await buscarResidente()

    sucesso.value = 'Dados salvos com sucesso!'
    fotoArquivo.value = null
    fotoPreview.value = ''
    mostrarModal.value = false
  }
}

onMounted(buscarResidente)
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.perfil-view {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topo-voltar {
  background: #f2f7f0;
  padding: 20px 24px 0 24px;
}

/* Faixa verde escura no topo do conteúdo. */
.faixa-verde {
  background: #2f5a2b;
  padding: 32px 24px 64px 24px;
}

.faixa-titulo {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  color: #ffffff;
  font-size: 24px;
  font-weight: 800;
}

.main-content {
  flex: 1;
  background: #f2f7f0;
  padding: 0 24px 48px 24px;
}

/* Card branco que sobe sobre a faixa verde. */
.perfil-card {
  width: 100%;
  max-width: 1240px;
  margin: -48px auto 0 auto;
  display: flex;
  gap: 56px;
  align-items: flex-start;
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(47, 90, 43, 0.06);
  padding: 40px 48px;
}

.foto-coluna {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.foto-box {
  width: 240px;
  height: 240px;
  border-radius: 20px;
  border: 1px solid #dde7d8;
  overflow: hidden;
  background-color: #e8f1e3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icone-foto-vazia {
  width: 72px;
  height: 72px;
  opacity: 0.55;
}

.section-title {
  margin: 8px 0 0 0;
  color: #1f2d1c;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.15;
  text-align: center;
}

.grau-badge {
  display: inline-flex;
  align-items: center;
  background: #e8f1e3;
  color: #2f5a2b;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  padding: 8px 16px;
  border-radius: 999px;
  text-align: center;
}

.acoes-coluna {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.btn-editar {
  width: 100%;
  background: #3e7a2b;
  color: #ffffff;
  border: none;
  padding: 12px 0;
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

.info-coluna {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.bloco-titulo {
  margin: 0;
  color: #1f2d1c;
  font-size: 18px;
  font-weight: 800;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 24px;
  border-top: 1px solid #dde7d8;
  padding-top: 22px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.info-icone {
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #e8f1e3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icone svg {
  width: 22px;
  height: 22px;
}

.info-texto {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.info-label {
  color: #4a5a47;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.info-valor {
  color: #1f2d1c;
  font-size: 15px;
  font-weight: 500;
  overflow-wrap: anywhere;
}

.grupo-grau {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.dependencia-titulo {
  color: #1f2d1c;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.dependencia-item {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #4a5a47;
  font-size: 14px;
}

.dependencia-marcador {
  width: 20px;
  height: 15px;
  border-radius: 4px;
  border: 1px solid #dde7d8;
  background: #ffffff;
  flex-shrink: 0;
}

.dependencia-marcador.ativo {
  background: #3e7a2b;
  border-color: #3e7a2b;
}

.perfil-menu {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
}

.btn-menu {
  background-color: #3e7a2b;
  color: #ffffff;
  font-family: inherit;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  border: none;
  border-radius: 8px;
  padding: 14px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-menu:hover {
  background-color: #2f5a2b;
}

.observacoes-box {
  border: 1px solid #dde7d8;
  border-radius: 10px;
  background: #f2f7f0;
  padding: 16px 20px;
  min-height: 110px;
}

.observacoes-box .label {
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1f2d1c;
}

.observacoes-texto {
  margin: 0;
  font-size: 13px;
  color: #4a5a47;
  white-space: pre-line;
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
  margin: 0;
  padding: 20px 0;
  color: #4a5a47;
  font-size: 15px;
  text-align: center;
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
  overflow: hidden;
  display: flex;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 18px 48px rgba(31, 45, 28, 0.28);
}

.btn-fechar {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
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

.modal-esquerda {
  width: 300px;
  flex-shrink: 0;
  background: #f2f7f0;
  padding: 32px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-right: 1px solid #dde7d8;
}

.modal-foto {
  position: relative;
  width: 100%;
  height: 170px;
  border: 1px solid #dde7d8;
  border-radius: 16px;
  overflow: hidden;
  background: #e8f1e3;
  cursor: pointer;
  padding: 0;
}

.modal-foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-foto-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(31, 45, 28, 0.5);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  padding: 0 12px;
}

.modal-foto-overlay svg {
  width: 28px;
  height: 28px;
}

.input-foto-oculto {
  display: none;
}

.modal-tabs {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-tab {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 14px;
  border: none;
  border-left: 3px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: #4a5a47;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.modal-tab svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.modal-tab:hover {
  background: #e8f1e3;
}

.modal-tab--ativa {
  background: #ffffff;
  border-left-color: #3e7a2b;
  color: #2f5a2b;
}

.modal-direita {
  flex: 1;
  min-width: 0;
  padding: 32px 32px 24px 32px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.modal-titulo {
  margin: 0 0 24px 0;
  color: #2f5a2b;
  font-size: 18px;
  font-weight: 800;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label,
.campo-label {
  color: #4a5a47;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  padding: 0 12px;
  height: 42px;
  font-size: 14px;
  font-family: inherit;
  color: #1f2d1c;
  background: #f2f7f0;
  outline: none;
  transition: border-color 0.15s ease;
}

.form-group textarea {
  height: auto;
  min-height: 84px;
  padding: 10px 12px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #3e7a2b;
}

.form-group input::placeholder {
  color: #8fa093;
}

.form-group .campo-readonly {
  color: #4a5a47;
  cursor: default;
}

.opcoes-grau {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}

.opcao-grau {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.opcao-grau input[type='radio'] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.marcador {
  width: 20px;
  height: 15px;
  border-radius: 4px;
  border: 1px solid #dde7d8;
  background: #f2f7f0;
  flex-shrink: 0;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.opcao-grau input:checked + .marcador {
  background: #3e7a2b;
  border-color: #3e7a2b;
}

.opcao-grau input:focus-visible + .marcador {
  outline: 2px solid rgba(62, 122, 43, 0.4);
  outline-offset: 2px;
}

.opcao-texto {
  color: #1f2d1c;
  font-size: 14px;
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

.loading-message {
  margin: 16px 0 0 0;
  color: #4a5a47;
  font-size: 13px;
  font-weight: 700;
}

.success-message {
  margin: 16px 0 0 0;
  color: #2f5a2b;
  font-size: 13px;
  font-weight: 700;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 24px;
}

.btn-atualizar {
  background: #3e7a2b;
  color: #ffffff;
  border: none;
  padding: 12px 34px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-atualizar:hover {
  background: #2f5a2b;
}

@media (max-width: 900px) {
  .faixa-verde {
    padding: 28px 16px 56px 16px;
  }

  .main-content {
    padding: 0 16px 40px 16px;
  }

  .perfil-card {
    flex-direction: column;
    align-items: center;
    gap: 28px;
    padding: 32px 20px;
  }

  .foto-coluna {
    width: 100%;
    max-width: 260px;
  }

  .btn-editar,
  .btn-menu {
    width: 100%;
  }

  .info-coluna {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .perfil-menu {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-box {
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }

  .modal-esquerda {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #dde7d8;
    padding: 24px 20px 16px 20px;
    gap: 16px;
  }

  .modal-foto {
    height: 140px;
  }

  .modal-tabs {
    flex-direction: row;
  }

  .modal-tab {
    flex: 1;
    justify-content: center;
    border-left: none;
    border-bottom: 3px solid transparent;
  }

  .modal-tab--ativa {
    border-left-color: transparent;
    border-bottom-color: #3e7a2b;
  }

  .modal-direita {
    flex: 1;
    padding: 24px 20px;
  }
}
</style>
