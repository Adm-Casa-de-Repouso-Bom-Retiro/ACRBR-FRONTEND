<template>
  <div class="perfil-view">

    <div class="faixa-verde">
      <h1 class="faixa-titulo">Meu perfil</h1>
    </div>

    <main class="main-content">
      <section class="perfil-card">
        <div class="foto-coluna">
          <div class="foto-box" :class="{ 'foto-box--vazia': !administrador.foto_url }">
            <img
              v-if="administrador.foto_url"
              :src="administrador.foto_url"
              alt="Foto de perfil"
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

          <h2 class="section-title">{{ administrador.nome || '...' }}</h2>

          <div class="cargo-badge">
            <span>{{ cargoFormatado }}</span>
          </div>

          <div class="acoes-coluna">
            <button class="btn-editar" @click="abrirModal">EDITAR DADOS</button>
            <button class="btn-sair" @click="handleLogout">SAIR DA CONTA</button>
          </div>
        </div>

        <div class="info-coluna">
          <h3 class="bloco-titulo">Informações da conta</h3>

          <div class="info-grid">
            <div class="info-item">
              <span class="info-icone">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="#3e7a2b"
                    stroke-width="1.6"
                  />
                  <path
                    d="m4 7 8 6 8-6"
                    stroke="#3e7a2b"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>

              <div class="info-texto">
                <span class="info-label">E-mail</span>
                <span class="info-valor">{{ administrador.email || '...' }}</span>
              </div>
            </div>

            <div class="info-item">
              <span class="info-icone">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z"
                    stroke="#3e7a2b"
                    stroke-width="1.6"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>

              <div class="info-texto">
                <span class="info-label">Telefone</span>
                <span class="info-valor">{{ telefoneFormatado }}</span>
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
                    d="M3.5 9.5h17M8 3.5v3M16 3.5v3"
                    stroke="#3e7a2b"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                </svg>
              </span>

              <div class="info-texto">
                <span class="info-label">Data de registro</span>
                <span class="info-valor">{{ dataFormatada }}</span>
              </div>
            </div>
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
            <img v-if="fotoAtual" :src="fotoAtual" alt="Foto de perfil" class="modal-foto-img" />

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
              :class="{ 'modal-tab--ativa': abaAtiva === 'conta' }"
              @click="abaAtiva = 'conta'"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 2.1c-3.5 0-7 1.76-7 5.25V21h14v-1.65c0-3.49-3.5-5.25-7-5.25Z"
                  fill="currentColor"
                />
              </svg>
              <span>Dados da conta</span>
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
            {{ abaAtiva === 'conta' ? 'Dados da conta' : 'Informações' }}
          </h3>

          <div v-if="abaAtiva === 'conta'" class="modal-form">
            <div class="form-group">
              <label for="modal-nome">NOME</label>
              <input id="modal-nome" v-model="form.nome" type="text" placeholder="Seu nome" />
            </div>

            <div class="form-group">
              <label for="modal-email">E-MAIL</label>
              <input
                id="modal-email"
                v-model="form.email"
                type="email"
                placeholder="abc@gmail.com"
              />
            </div>
          </div>

          <div v-else-if="abaAtiva === 'info'" class="modal-form">
            <div class="form-group">
              <label for="modal-telefone">TELEFONE</label>
              <input
                id="modal-telefone"
                v-model="form.telefone"
                type="text"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div class="form-group">
              <label for="modal-cargo">CARGO</label>
              <select id="modal-cargo" v-model="form.cargo">
                <option value="" disabled>Selecione</option>
                <option value="chefe">Chefe</option>
                <option value="gerente">Gerente</option>
                <option value="nutricionista">Nutricionista</option>
                <option value="cuidador">Cuidador</option>
              </select>
            </div>

            <div class="form-group">
              <label for="modal-data">DATA DE REGISTRO</label>
              <input
                id="modal-data"
                :value="dataFormatada"
                type="text"
                readonly
                class="campo-readonly"
              />
            </div>
          </div>

          <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>
          <p v-if="authStore.loading" class="loading-message">Salvando...</p>
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
import { storeToRefs } from 'pinia'
import { uploadImagem } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { usuario: administrador } = storeToRefs(authStore)

const mostrarModal = ref(false)
const abaAtiva = ref('conta')
const sucesso = ref('')
const fotoArquivo = ref(null)
const fotoPrevia = ref('')
const inputFoto = ref(null)

const form = ref({
  nome: '',
  email: '',
  telefone: '',
  cargo: '',
})

const cargos = {
  chefe: 'Chefe',
  gerente: 'Gerente',
  nutricionista: 'Nutricionista',
  cuidador: 'Cuidador',
}

const cargoFormatado = computed(
  () => cargos[administrador.value?.cargo] || administrador.value?.cargo || '...',
)

const telefoneFormatado = computed(() => {
  const tel = (administrador.value?.telefone || '').replace(/\D/g, '')

  if (tel.length === 11) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`
  }

  if (tel.length === 10) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`
  }

  return administrador.value?.telefone || '...'
})

const dataFormatada = computed(() => {
  const data = administrador.value?.data_registro

  if (!data) return '...'

  const [ano, mes, dia] = String(data).slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
})

const fotoAtual = computed(() => fotoPrevia.value || administrador.value?.foto_url || '')

function sincronizarFormulario() {
  form.value.nome = administrador.value?.nome || ''
  form.value.email = administrador.value?.email || ''
  form.value.telefone = administrador.value?.telefone || ''
  form.value.cargo = administrador.value?.cargo || ''
}

function abrirModal() {
  sincronizarFormulario()
  abaAtiva.value = 'conta'
  sucesso.value = ''
  fotoArquivo.value = null
  fotoPrevia.value = ''
  authStore.error = ''
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
  fotoPrevia.value = URL.createObjectURL(arquivo)
}

async function handleAtualizar() {
  sucesso.value = ''
  authStore.error = ''

  const dados = {
    nome: form.value.nome,
    email: form.value.email,
    telefone: (form.value.telefone || '').replace(/\D/g, ''),
    cargo: form.value.cargo,
  }

  if (fotoArquivo.value) {
    try {
      const imagem = await uploadImagem(fotoArquivo.value, form.value.nome || 'foto-perfil')

      if (imagem?.attachment_key) {
        // Aviso: o AdministradorSerializer hoje ignora "perfil_attachment_key"
        // no PATCH, então a foto pode não persistir no backend.
        dados.perfil_attachment_key = imagem.attachment_key
      }
    } catch (erro) {
      authStore.error = 'Erro ao enviar a foto.'
      return
    }
  }

  const atualizado = await authStore.atualizarPerfil(dados)

  if (atualizado) {
    sucesso.value = 'Perfil atualizado com sucesso!'
    fotoArquivo.value = null
    fotoPrevia.value = ''
    mostrarModal.value = false
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  if (authStore.usuario) return

  await authStore.fetchUsuario()

  if (authStore.error) {
    router.push('/login')
  }
})
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

.cargo-badge {
  display: inline-flex;
  align-items: center;
  background: #e8f1e3;
  color: #2f5a2b;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 8px 18px;
  border-radius: 999px;
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

.btn-sair {
  width: 100%;
  background: #ffffff;
  color: #3e7a2b;
  border: 1.5px solid #3e7a2b;
  padding: 11px 0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-sair:hover {
  background: #f2f7f0;
}

.info-coluna {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.bloco-titulo {
  margin: 0;
  color: #1f2d1c;
  font-size: 18px;
  font-weight: 800;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-top: 1px solid #dde7d8;
  padding-top: 22px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 14px;
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

.form-group label {
  color: #4a5a47;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select {
  width: 100%;
  height: 42px;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  font-family: inherit;
  color: #1f2d1c;
  background: #f2f7f0;
  outline: none;
  transition: border-color 0.15s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3e7a2b;
}

.form-group input::placeholder {
  color: #8fa093;
}

.form-group .campo-readonly {
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
  .btn-sair {
    width: 100%;
  }

  .info-coluna {
    width: 100%;
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
