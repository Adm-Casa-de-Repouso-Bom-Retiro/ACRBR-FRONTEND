<template>
  <div class="history-page">
    <main class="main-content">
      <BotaoVoltar
        :to="residenteId ? { name: 'residente', params: { id: residenteId } } : '/prontuario'"
      />

      <section class="history-card">
        <template v-if="residenteId">
          <div class="card-top">
            <div class="header-left">
              <div class="avatar" :class="{ 'avatar--foto': residenteAtual?.foto }">
                <img
                  v-if="residenteAtual?.foto"
                  :src="residenteAtual.foto.url"
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
                <h1 class="section-title">HISTÓRICO DE OCORRÊNCIAS</h1>
                <p class="resident-subtitle">Residente: {{ nomeDoResidente(residenteId) }}</p>
              </div>
            </div>

            <button
              v-if="!mostrarFormulario"
              type="button"
              class="btn-nova"
              @click="abrirFormulario()"
            >
              NOVA OCORRÊNCIA
            </button>
          </div>

          <p v-if="store.error" class="error-message">{{ store.error }}</p>
          <p v-if="sucesso" class="success-message">{{ sucesso }}</p>

          <form
            v-if="mostrarFormulario"
            ref="formularioRef"
            class="occurrence-form"
            @submit.prevent="salvarOcorrencia"
          >
            <p class="form-title">
              {{ ocorrenciaEmEdicao ? 'EDITAR OCORRÊNCIA' : 'NOVA OCORRÊNCIA' }}
            </p>
            <p v-if="erroFormulario" class="error-message">{{ erroFormulario }}</p>

            <div class="form-row">
              <div class="form-group">
                <label for="ocorrencia-tipo">TIPO:</label>
                <input id="ocorrencia-tipo" v-model="tipo" type="text" placeholder="Ex.: Queda" />
              </div>

              <div class="form-group">
                <label for="ocorrencia-gravidade">GRAVIDADE:</label>
                <input
                  id="ocorrencia-gravidade"
                  v-model="gravidade"
                  type="text"
                  placeholder="Ex.: Leve"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="ocorrencia-descricao">DESCRIÇÃO:</label>
              <textarea
                id="ocorrencia-descricao"
                v-model="descricao"
                rows="4"
                placeholder="Descreva o que aconteceu"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="ocorrencia-providencias">PROVIDÊNCIAS:</label>
              <textarea
                id="ocorrencia-providencias"
                v-model="providencias"
                rows="3"
                placeholder="Descreva as providências tomadas"
              ></textarea>
            </div>

            <div class="form-group">
              <label>FOTOS DA OCORRÊNCIA:</label>

              <div class="photo-upload">
                <input
                  ref="inputFoto"
                  type="file"
                  accept="image/*"
                  multiple
                  class="input-foto-oculto"
                  @change="selecionarFotos"
                />

                <input
                  ref="inputCamera"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  class="input-foto-oculto"
                  @change="selecionarFotos"
                />

                <div class="photo-botoes">
                  <button
                    type="button"
                    class="btn-foto"
                    :disabled="enviandoFotos"
                    @click="abrirSeletorFoto"
                  >
                    {{
                      fotosExistentes.length || fotosSelecionadas.length
                        ? 'ADICIONAR MAIS FOTOS'
                        : 'ADICIONAR FOTOS'
                    }}
                  </button>

                  <button
                    type="button"
                    class="btn-foto btn-foto--camera"
                    :disabled="enviandoFotos"
                    @click="abrirCamera"
                  >
                    <svg
                      class="btn-foto-icone"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 8a2 2 0 0 1 2-2h1.17a2 2 0 0 0 1.63-.84l.4-.57A2 2 0 0 1 10.8 3.6h2.4a2 2 0 0 1 1.6.98l.4.57A2 2 0 0 0 16.83 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                      <circle cx="12" cy="13" r="3.2" stroke="currentColor" stroke-width="1.5" />
                    </svg>
                    TIRAR FOTO
                  </button>
                </div>

                <div
                  v-if="fotosExistentes.length || fotosSelecionadas.length"
                  class="photo-preview-wrapper"
                >
                  <div
                    v-for="(foto, index) in fotosExistentes"
                    :key="foto.attachment_key"
                    class="photo-preview-item"
                  >
                    <img :src="foto.url" alt="Foto da ocorrência" class="photo-preview" />
                    <button
                      type="button"
                      class="btn-remover-foto"
                      :disabled="enviandoFotos"
                      @click="removerFotoExistente(index)"
                    >
                      REMOVER
                    </button>
                  </div>

                  <div
                    v-for="(foto, index) in fotosSelecionadas"
                    :key="foto.preview"
                    class="photo-preview-item"
                  >
                    <img
                      :src="foto.preview"
                      alt="Prévia da foto da ocorrência"
                      class="photo-preview"
                    />
                    <button
                      type="button"
                      class="btn-remover-foto"
                      :disabled="enviandoFotos"
                      @click="removerFoto(index)"
                    >
                      REMOVER
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="btn-cancelar"
                :disabled="store.salvando || enviandoFotos"
                @click="fecharFormulario"
              >
                CANCELAR
              </button>
              <button type="submit" class="btn-salvar" :disabled="store.salvando || enviandoFotos">
                {{
                  enviandoFotos
                    ? 'ENVIANDO FOTOS...'
                    : store.salvando
                      ? ocorrenciaEmEdicao
                        ? 'ATUALIZANDO...'
                        : 'SALVANDO...'
                      : ocorrenciaEmEdicao
                        ? 'ATUALIZAR'
                        : 'SALVAR'
                }}
              </button>
            </div>
          </form>

          <p v-if="store.loading" class="loading-message">Carregando ocorrências...</p>
          <p
            v-if="!store.loading && !mostrarFormulario && ocorrenciasFiltradas().length === 0"
            class="empty-message"
          >
            Nenhuma ocorrência registrada.
          </p>

          <div
            v-for="ocorrencia in ocorrenciasFiltradas()"
            :key="ocorrencia.id"
            class="occurrence-card"
          >
            <div class="occurrence-content">
              <div class="occurrence-header">
                <h2 class="resident-name">{{ nomeDoResidente(ocorrencia.residente) }}</h2>

                <div v-if="!mostrarFormulario" class="occurrence-actions">
                  <template v-if="ocorrenciaParaExcluir === ocorrencia.id">
                    <span class="confirmacao-texto">Excluir esta ocorrência?</span>
                    <button
                      type="button"
                      class="btn-confirmar-exclusao"
                      :disabled="store.removendo"
                      @click="confirmarExclusao(ocorrencia)"
                    >
                      {{ store.removendo ? 'EXCLUINDO...' : 'CONFIRMAR' }}
                    </button>
                    <button
                      type="button"
                      class="btn-cancelar-exclusao"
                      :disabled="store.removendo"
                      @click="cancelarExclusao"
                    >
                      CANCELAR
                    </button>
                  </template>

                  <template v-else>
                    <button
                      type="button"
                      class="btn-editar-ocorrencia"
                      :disabled="store.removendo"
                      @click="abrirFormulario(ocorrencia)"
                    >
                      EDITAR
                    </button>
                    <button
                      type="button"
                      class="btn-excluir-ocorrencia"
                      :disabled="store.removendo"
                      @click="solicitarExclusao(ocorrencia)"
                    >
                      EXCLUIR
                    </button>
                  </template>
                </div>
              </div>
              <p v-if="ocorrencia.tipo" class="occurrence-type">{{ ocorrencia.tipo }}</p>
              <p v-if="ocorrencia.gravidade" class="occurrence-severity">
                Gravidade: {{ ocorrencia.gravidade }}
              </p>
              <p class="occurrence-description">{{ ocorrencia.descricao }}</p>
              <p v-if="ocorrencia.providencias" class="occurrence-providencias">
                Providências: {{ ocorrencia.providencias }}
              </p>
            </div>

            <div v-if="ocorrencia.fotos?.length" class="occurrence-photos">
              <img
                v-for="foto in ocorrencia.fotos"
                :key="foto.url"
                :src="foto.url"
                alt="Foto da ocorrência"
                class="occurrence-photo"
              />
            </div>
          </div>
        </template>

        <template v-else>
          <h1 class="section-title">HISTÓRICO DE OCORRÊNCIAS</h1>
          <p class="empty-message">
            Abra o histórico pelo perfil do residente para visualizar ou registrar ocorrências.
          </p>
          <div class="no-resident-actions">
            <router-link to="/prontuario" class="btn-nova">IR PARA PRONTUÁRIOS</router-link>
          </div>
        </template>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BotaoVoltar from '@/components/BotaoVoltar.vue'
import { uploadImagem } from '@/services/api'
import { useOcorrenciasStore } from '../stores/ocorrencias.js'
import { useResidentesStore } from '../stores/residentes.js'

const route = useRoute()
const store = useOcorrenciasStore()
const residentesStore = useResidentesStore()

const residenteId = ref(Number(route.query.residente) || null)
const mostrarFormulario = ref(false)
const tipo = ref('')
const gravidade = ref('')
const descricao = ref('')
const providencias = ref('')
const erroFormulario = ref('')
const sucesso = ref('')
const formularioRef = ref(null)
const inputFoto = ref(null)
const inputCamera = ref(null)
const ocorrenciaEmEdicao = ref(null)
const fotosExistentes = ref([])
const fotosSelecionadas = ref([])
const fotosAlteradas = ref(false)
const enviandoFotos = ref(false)
const ocorrenciaParaExcluir = ref(null)

const residenteAtual = computed(() =>
  residentesStore.residentes.find((item) => item.id === residenteId.value),
)

function nomeDoResidente(id) {
  const residente = residentesStore.residentes.find((item) => item.id === Number(id))
  return residente ? residente.nome_completo : `Residente #${id}`
}

function ocorrenciasFiltradas() {
  if (!residenteId.value) return []

  return store.ocorrencias.filter(
    (ocorrencia) => Number(ocorrencia.residente) === residenteId.value,
  )
}

function abrirFormulario(ocorrencia = null) {
  erroFormulario.value = ''
  sucesso.value = ''
  store.error = ''
  ocorrenciaParaExcluir.value = null
  limparCampos()

  if (ocorrencia) {
    ocorrenciaEmEdicao.value = ocorrencia
    tipo.value = ocorrencia.tipo || ''
    gravidade.value = ocorrencia.gravidade || ''
    descricao.value = ocorrencia.descricao || ''
    providencias.value = ocorrencia.providencias || ''
    fotosExistentes.value = (ocorrencia.fotos || []).filter((foto) => foto.attachment_key)
  }

  mostrarFormulario.value = true

  nextTick(() => {
    formularioRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function fecharFormulario() {
  erroFormulario.value = ''
  store.error = ''
  mostrarFormulario.value = false
  limparCampos()
}

function abrirSeletorFoto() {
  inputFoto.value?.click()
}

function abrirCamera() {
  inputCamera.value?.click()
}

function selecionarFotos(evento) {
  const input = evento.target
  const arquivos = Array.from(input?.files || [])

  if (arquivos.length) {
    fotosAlteradas.value = true
  }

  arquivos.forEach((arquivo) => {
    fotosSelecionadas.value.push({
      arquivo,
      preview: URL.createObjectURL(arquivo),
    })
  })

  if (input) {
    input.value = ''
  }
}

function removerFoto(index) {
  const foto = fotosSelecionadas.value[index]

  if (!foto) return

  fotosAlteradas.value = true
  URL.revokeObjectURL(foto.preview)
  fotosSelecionadas.value.splice(index, 1)
}

function removerFotoExistente(index) {
  if (!fotosExistentes.value[index]) return

  fotosAlteradas.value = true
  fotosExistentes.value.splice(index, 1)
}

function limparFotos() {
  fotosSelecionadas.value.forEach((foto) => URL.revokeObjectURL(foto.preview))
  fotosSelecionadas.value = []

  if (inputFoto.value) {
    inputFoto.value.value = ''
  }

  if (inputCamera.value) {
    inputCamera.value.value = ''
  }
}

function limparCampos() {
  tipo.value = ''
  gravidade.value = ''
  descricao.value = ''
  providencias.value = ''
  limparFotos()
  fotosExistentes.value = []
  fotosAlteradas.value = false
  ocorrenciaEmEdicao.value = null
}

function salvarOcorrencia() {
  erroFormulario.value = ''
  sucesso.value = ''
  store.error = ''

  if (!residenteId.value) {
    erroFormulario.value = 'Residente não identificado.'
    return
  }

  if (!tipo.value.trim() || !descricao.value.trim()) {
    erroFormulario.value = 'Preencha tipo e descrição.'
    return
  }

  const dados = {
    residente: residenteId.value,
    tipo: tipo.value.trim(),
    gravidade: gravidade.value.trim(),
    descricao: descricao.value.trim(),
    providencias: providencias.value.trim(),
  }

  const ocorrenciaEditando = ocorrenciaEmEdicao.value
  const fotosParaEnviar = fotosSelecionadas.value.map((foto) => foto.arquivo)

  const enviar = (novasChaves = []) => {
    const houveAlteracaoFotos = fotosAlteradas.value || novasChaves.length > 0

    if (ocorrenciaEditando) {
      if (houveAlteracaoFotos) {
        dados.fotos_attachment_keys = [
          ...fotosExistentes.value.map((foto) => foto.attachment_key),
          ...novasChaves,
        ]
      }

      return store.atualizarOcorrencia(ocorrenciaEditando.id, dados).then((salva) => {
        if (!salva) return

        sucesso.value = 'Ocorrência atualizada com sucesso!'
        limparCampos()
        mostrarFormulario.value = false
      })
    }

    if (novasChaves.length) {
      dados.fotos_attachment_keys = novasChaves
    }

    return store.addOcorrencia(dados).then((salva) => {
      if (!salva) return

      if (novasChaves.length && (salva.fotos?.length ?? 0) !== novasChaves.length) {
        erroFormulario.value = 'As fotos não foram salvas. Verifique se o backend está atualizado.'
        return
      }

      sucesso.value = 'Ocorrência registrada com sucesso!'
      limparCampos()
      mostrarFormulario.value = false
    })
  }

  if (fotosParaEnviar.length) {
    enviandoFotos.value = true

    Promise.all(fotosParaEnviar.map((arquivo) => uploadImagem(arquivo, 'foto-ocorrencia')))
      .then((imagens) => {
        const chaves = imagens
          .map((imagem) => imagem?.attachment_key)
          .filter((chave) => Boolean(chave))

        if (chaves.length !== fotosParaEnviar.length) {
          erroFormulario.value = 'Não foi possível anexar todas as fotos.'
          return
        }

        return enviar(chaves)
      })
      .catch(() => {
        erroFormulario.value = 'Erro ao enviar as fotos. Tente novamente.'
      })
      .finally(() => {
        enviandoFotos.value = false
      })
  } else {
    enviar()
  }
}

function solicitarExclusao(ocorrencia) {
  sucesso.value = ''
  store.error = ''
  ocorrenciaParaExcluir.value = ocorrencia.id
}

function cancelarExclusao() {
  ocorrenciaParaExcluir.value = null
}

function confirmarExclusao(ocorrencia) {
  sucesso.value = ''
  store.error = ''

  return store.removeOcorrencia(ocorrencia.id).then((excluiu) => {
    if (!excluiu) return

    if (ocorrenciaEmEdicao.value?.id === ocorrencia.id) {
      fecharFormulario()
    }

    ocorrenciaParaExcluir.value = null
    sucesso.value = 'Ocorrência excluída com sucesso!'
  })
}

onMounted(() => {
  if (!residenteId.value) return

  store.fetchOcorrencias()
  residentesStore.fetchResidentes()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.history-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f2f7f0;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 28px 24px 48px 24px;
}

.history-card {
  background: #ffffff;
  border: 1px solid #3a7d44;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(58, 125, 68, 0.08);
  padding: 32px 36px;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
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
  color: #3a7d44;
  font-size: 22px;
  font-weight: 800;
}

.resident-subtitle {
  margin: 6px 0 0 0;
  color: #4a5a47;
  font-size: 14px;
  font-weight: 600;
}

.btn-nova {
  display: inline-block;
  background: #3a7d44;
  color: #ffffff;
  border: none;
  padding: 11px 22px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-nova:hover {
  background: #2f5a2b;
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

.success-message {
  margin: 0 0 16px 0;
  color: #2f5a2b;
  font-size: 13px;
  font-weight: 700;
}

.loading-message {
  margin: 0 0 16px 0;
  color: #4a5a47;
  font-size: 14px;
}

.empty-message {
  margin: 0;
  color: #4a5a47;
  font-size: 14px;
}

.no-resident-actions {
  margin-top: 20px;
}

.occurrence-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #eef7ec;
  border: 1px solid #cfe3cf;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.form-title {
  margin: 0;
  color: #3a7d44;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #3a7d44;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.6px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  border: 1px solid #cfe3cf;
  border-radius: 8px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  color: #1f2d1c;
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s ease;
}

.form-group input,
.form-group select {
  height: 40px;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #3a7d44;
}

.photo-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-foto-oculto {
  display: none;
}

.photo-botoes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-foto {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #ffffff;
  color: #3a7d44;
  border: 1.5px dashed #3a7d44;
  padding: 12px 20px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-foto-icone {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.btn-foto:hover:not(:disabled) {
  background: #e6f2e4;
}

.btn-foto:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.photo-preview-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.photo-preview-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.photo-preview {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #cfe3cf;
}

.btn-remover-foto {
  background: transparent;
  color: #8a1f1f;
  border: 1.5px solid #c98a8a;
  padding: 8px 14px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-remover-foto:hover:not(:disabled) {
  background: #fbe9e9;
}

.btn-remover-foto:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancelar {
  background: transparent;
  color: #3a7d44;
  border: 1.5px solid #3a7d44;
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

.btn-cancelar:hover:not(:disabled) {
  background: #ffffff;
}

.btn-cancelar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-salvar {
  background: #3a7d44;
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

.btn-salvar:hover:not(:disabled) {
  background: #2f5a2b;
}

.btn-salvar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.occurrence-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #ffffff;
  border: 1px solid #d7ead7;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 14px;
}

.occurrence-card:last-child {
  margin-bottom: 0;
}

.occurrence-photos {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.occurrence-photo {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #d7ead7;
  flex-shrink: 0;
}

.occurrence-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.occurrence-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.resident-name {
  margin: 0;
  color: #1f2d1c;
  font-size: 18px;
  font-weight: 800;
}

.btn-editar-ocorrencia {
  background: transparent;
  color: #3a7d44;
  border: 1.5px solid #3a7d44;
  padding: 7px 16px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-editar-ocorrencia:hover:not(:disabled) {
  background: #e6f2e4;
}

.btn-editar-ocorrencia:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.occurrence-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.confirmacao-texto {
  color: #4a5a47;
  font-size: 12px;
  font-weight: 700;
}

.btn-excluir-ocorrencia,
.btn-confirmar-exclusao,
.btn-cancelar-exclusao {
  padding: 7px 16px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-excluir-ocorrencia {
  background: transparent;
  color: #8a1f1f;
  border: 1.5px solid #c98a8a;
}

.btn-excluir-ocorrencia:hover:not(:disabled) {
  background: #fbe9e9;
}

.btn-confirmar-exclusao {
  background: #8a1f1f;
  color: #ffffff;
  border: 1.5px solid #8a1f1f;
}

.btn-confirmar-exclusao:hover:not(:disabled) {
  background: #6f1919;
}

.btn-cancelar-exclusao {
  background: transparent;
  color: #4a5a47;
  border: 1.5px solid #c9d6c6;
}

.btn-cancelar-exclusao:hover:not(:disabled) {
  background: #eef7ec;
}

.btn-excluir-ocorrencia:disabled,
.btn-confirmar-exclusao:disabled,
.btn-cancelar-exclusao:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.occurrence-type {
  margin: 0;
  color: #3a7d44;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.occurrence-severity {
  margin: 0;
  color: #4a5a47;
  font-size: 13px;
  font-weight: 700;
}

.occurrence-description {
  margin: 0;
  color: #1f2d1c;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.occurrence-providencias {
  margin: 0;
  color: #4a5a47;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
}

@media (max-width: 700px) {
  .main-content {
    padding: 20px 16px 40px 16px;
  }

  .history-card {
    padding: 24px 18px;
  }

  .header-left {
    align-items: flex-start;
  }

  .section-title {
    font-size: 18px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .photo-botoes {
    flex-direction: column;
  }

  .btn-foto {
    width: 100%;
    align-self: stretch;
  }

  .occurrence-photo,
  .photo-preview {
    width: 100%;
    height: 220px;
  }
}
</style>
