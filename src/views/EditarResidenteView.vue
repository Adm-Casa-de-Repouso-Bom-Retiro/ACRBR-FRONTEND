<template>
  <div class="editar-residente-page">
    <main class="main-content">
      <section class="editar-painel">
        <div class="editar-card">
          <div class="foto-coluna">
            <button
              type="button"
              class="foto-box"
              :class="{ 'foto-box--preenchida': fotoPreview || fotoAtual }"
              :style="fotoPreview ? { backgroundImage: `url(${fotoPreview})` } : fotoAtual ? { backgroundImage: `url(${fotoAtual})` } : {}"
              @click="abrirSeletorFoto"
            >
              <svg
                v-if="!fotoPreview && !fotoAtual"
                class="icone-camera"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8a2 2 0 0 1 2-2h1.17a2 2 0 0 0 1.63-.84l.4-.57A2 2 0 0 1 10.8 3.6h2.4a2 2 0 0 1 1.6.98l.4.57A2 2 0 0 0 16.83 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
                  stroke="#ffffff"
                  stroke-width="1.4"
                />
                <circle cx="12" cy="13" r="3.2" stroke="#ffffff" stroke-width="1.4" />
              </svg>
            </button>

            <input
              ref="inputFoto"
              type="file"
              accept="image/*"
              class="input-foto-oculto"
              @change="selecionarFoto"
            />

            <span class="foto-dica">ALTERAR FOTO</span>
          </div>

          <div class="info-coluna">
            <div class="titulo-pill">
              <span>Editar Dados - {{ residente.nome_completo || '...' }}</span>
            </div>

            <p v-if="erro" class="msg-erro">{{ erro }}</p>
            <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>

            <div class="form-grid">
              <div class="form-group campo-nome">
                <label for="nome">NOME COMPLETO:</label>
                <input id="nome" v-model="form.nome_completo" type="text" class="campo-input" />
              </div>

              <div class="form-group">
                <label for="nascimento">DATA DE NASCIMENTO:</label>
                <input
                  id="nascimento"
                  v-model="form.data_nascimento"
                  type="date"
                  class="campo-input"
                />
              </div>

              <div class="form-group">
                <label for="entrada">DATA DE ENTRADA:</label>
                <input
                  id="entrada"
                  v-model="form.data_admissao"
                  type="date"
                  class="campo-input"
                />
              </div>

              <div class="form-group">
                <label for="quarto">QUARTO:</label>
                <input id="quarto" v-model="form.quarto" type="text" class="campo-input" />
              </div>

              <div class="form-group campo-grau">
                <span class="campo-label">GRAU DE DEPENDÊNCIA</span>

                <div class="opcoes-grau">
                  <label class="opcao-grau">
                    <input
                      v-model="form.grau_dependencia"
                      type="radio"
                      value="grau_1"
                      name="grau"
                    />
                    <span class="marcador"></span>
                    <span class="opcao-texto">Grau 1 - Independente</span>
                  </label>

                  <label class="opcao-grau">
                    <input
                      v-model="form.grau_dependencia"
                      type="radio"
                      value="grau_2"
                      name="grau"
                    />
                    <span class="marcador"></span>
                    <span class="opcao-texto">Grau 2 - Necessita auxílio parcial</span>
                  </label>

                  <label class="opcao-grau">
                    <input
                      v-model="form.grau_dependencia"
                      type="radio"
                      value="grau_3"
                      name="grau"
                    />
                    <span class="marcador"></span>
                    <span class="opcao-texto">Grau 3 - Dependência total</span>
                  </label>
                </div>
              </div>

              <div class="form-group campo-observacoes">
                <label for="observacoes">OBSERVAÇÕES:</label>
                <textarea
                  id="observacoes"
                  v-model="form.observacoes"
                  class="campo-input campo-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="form-footer">
              <button
                class="btn-salvar"
                type="button"
                :disabled="carregando"
                @click="salvar"
              >
                {{ carregando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES' }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <div class="linha-divisoria"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const residente = ref({})
const carregando = ref(false)
const erro = ref('')
const sucesso = ref('')
const fotoArquivo = ref(null)
const fotoPreview = ref('')
const fotoAtual = ref('')
const inputFoto = ref(null)

const form = ref({
  nome_completo: '',
  data_nascimento: '',
  data_admissao: '',
  quarto: '',
  grau_dependencia: 'grau_1',
  observacoes: '',
})

function abrirSeletorFoto() {
  inputFoto.value.click()
}

function selecionarFoto(event) {
  const arquivo = event.target.files[0]
  if (!arquivo) return

  fotoArquivo.value = arquivo
  fotoPreview.value = URL.createObjectURL(arquivo)
}

async function uploadFoto() {
  if (!fotoArquivo.value) return null

  const formData = new FormData()
  formData.append('file', fotoArquivo.value)
  formData.append('description', form.value.nome_completo || 'foto-residente')

  const resposta = await api.post('/media/images/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return resposta.data.attachment_key
}

function formatarData(valor) {
  if (!valor) return ''
  return String(valor).slice(0, 10)
}

async function carregarResidente() {
  carregando.value = true
  erro.value = ''

  try {
    const resposta = await api.get(`/residentes/${route.params.id}/`)
    residente.value = resposta.data

    form.value.nome_completo = resposta.data.nome_completo || ''
    form.value.data_nascimento = formatarData(resposta.data.data_nascimento)
    form.value.data_admissao = formatarData(resposta.data.data_admissao)
    form.value.quarto = resposta.data.quarto || ''
    form.value.grau_dependencia = resposta.data.grau_dependencia || 'grau_1'
    form.value.observacoes = resposta.data.observacoes || ''

    if (resposta.data.foto?.url) {
      fotoAtual.value = resposta.data.foto.url
    }
  } catch (error) {
    erro.value = 'Erro ao carregar dados do residente.'
  } finally {
    carregando.value = false
  }
}

async function salvar() {
  erro.value = ''
  sucesso.value = ''

  if (!form.value.nome_completo.trim()) {
    erro.value = 'Informe o nome completo do residente.'
    return
  }

  carregando.value = true

  try {
    let fotoKey = null

    if (fotoArquivo.value) {
      fotoKey = await uploadFoto()
    }

    const dados = {
      nome_completo: form.value.nome_completo,
      data_nascimento: form.value.data_nascimento || null,
      data_admissao: form.value.data_admissao || null,
      quarto: form.value.quarto,
      grau_dependencia: form.value.grau_dependencia,
      observacoes: form.value.observacoes,
    }

    if (fotoKey) {
      dados.foto_attachment_key = fotoKey
    }

    await api.patch(`/residentes/${route.params.id}/`, dados)

    sucesso.value = 'Dados salvos com sucesso!'
    setTimeout(() => router.push(`/residente/${route.params.id}`), 1500)
  } catch (error) {
    if (error.response?.data) {
      const erros = error.response.data
      const primeiroErro = Object.values(erros)[0]
      erro.value = Array.isArray(primeiroErro) ? primeiroErro[0] : primeiroErro
    } else {
      erro.value = 'Erro ao salvar. Tente novamente.'
    }
  } finally {
    carregando.value = false
  }
}

onMounted(carregarResidente)
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.editar-residente-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: #2e5d2e;
  padding: 48px 60px 56px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editar-painel {
  width: 100%;
  max-width: 1080px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.045);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  padding: 52px 58px;
}

.editar-card {
  display: flex;
  gap: 56px;
  align-items: flex-start;
}

.foto-coluna {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  flex-shrink: 0;
}

.foto-box {
  width: 260px;
  height: 290px;
  border: none;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.14);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.foto-box:hover {
  background-color: rgba(255, 255, 255, 0.22);
}

.foto-box--preenchida {
  background-color: #d9d9d9;
}

.foto-box--preenchida:hover {
  filter: brightness(1.08);
}

.icone-camera {
  width: 52px;
  height: 52px;
  opacity: 0.75;
}

.input-foto-oculto {
  display: none;
}

.foto-dica {
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
}

.info-coluna {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
}

.titulo-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  background: #6ba13f;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 10px 26px;
  border-radius: 6px;
}

.msg-erro {
  color: #ffdada;
  font-size: 13px;
  margin: 0;
}

.msg-sucesso {
  color: #d9f2c2;
  font-size: 13px;
  font-weight: 700;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.campo-nome,
.campo-observacoes {
  grid-column: 1 / -1;
}

.form-group label,
.campo-label {
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.campo-input,
.campo-textarea {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 9px 12px;
  font-size: 14px;
  font-family: inherit;
  color: #1e3e1e;
  outline: none;
  background: #ffffff;
  transition: box-shadow 0.15s ease;
}

.campo-input:focus,
.campo-textarea:focus {
  border-color: #8fbe4a;
  box-shadow: 0 0 0 3px rgba(143, 190, 74, 0.35);
}

.campo-textarea {
  resize: vertical;
  min-height: 64px;
}

.opcoes-grau {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  min-height: 38px;
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
  border: 1px solid #78a84b;
  flex-shrink: 0;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.opcao-grau input:checked + .marcador {
  background: #8fbe4a;
  border-color: #8fbe4a;
}

.opcao-grau input:focus-visible + .marcador {
  outline: 2px solid rgba(143, 190, 74, 0.7);
  outline-offset: 2px;
}

.opcao-texto {
  color: #ffffff;
  font-size: 14px;
  white-space: nowrap;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-salvar {
  background: #6ba13f;
  border: none;
  color: #ffffff;
  font-family: inherit;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  padding: 13px 36px;
  border-radius: 7px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.btn-salvar:hover:not(:disabled) {
  background: #7caf49;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.btn-salvar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.linha-divisoria {
  height: 8px;
  background: #ffffff;
  width: 100%;
}

@media (max-width: 900px) {
  .main-content {
    padding: 28px 20px 40px 20px;
  }

  .editar-painel {
    padding: 32px 26px;
  }

  .editar-card {
    flex-direction: column;
    align-items: center;
  }

  .foto-coluna {
    width: 100%;
    max-width: 260px;
  }

  .foto-box {
    width: 100%;
    height: 220px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
