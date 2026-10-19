<template>
  <div class="contatos-prontuario-page">
    <main class="main-content">
      <BotaoVoltar :to="{ name: 'residente', params: { id: route.params.id } }" />

      <p v-if="erro" class="error-message">{{ erro }}</p>

      <div v-if="carregando" class="loading-message">Carregando dados do residente...</div>

      <section v-else-if="residente" class="contatos-painel">
        <div class="contatos-card">
          <div class="foto-coluna">
            <div class="foto-box" :style="fotoUrl ? { backgroundImage: `url(${fotoUrl})` } : {}">
              <svg
                v-if="!fotoUrl"
                class="icone-foto-vazia"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8a2 2 0 0 1 2-2h1.17a2 2 0 0 0 1.63-.84l.4-.57A2 2 0 0 1 10.8 3.6h2.4a2 2 0 0 1 1.6.98l.4.57A2 2 0 0 0 16.83 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
                  stroke="#3e7a2b"
                  stroke-width="1.4"
                />
                <circle cx="12" cy="13" r="3.2" stroke="#3e7a2b" stroke-width="1.4" />
              </svg>
            </div>

            <button class="btn-editar" type="button" @click="abrirModal">EDITAR DADOS</button>
          </div>

          <div class="info-coluna">
            <div class="card-header">
              <h1 class="section-title">Contatos - {{ residente.nome_completo }}</h1>
            </div>

            <p v-if="sucesso" class="success-message">{{ sucesso }}</p>

            <div class="bloco-responsavel">
              <p class="linha-info">
                <span class="label">Responsável:</span>
                <span class="valor">{{ residente.nome_responsavel || '—' }}</span>
              </p>

              <div class="linha-dupla">
                <p class="linha-info">
                  <span class="label">Grau de Parentesco:</span>
                  <span class="valor">{{ formatarParentesco(residente.parentesco) }}</span>
                </p>

                <p class="linha-info">
                  <span class="label">Telefone:</span>
                  <span class="valor">{{ formatarTelefone(residente.telefone_responsavel) }}</span>
                </p>
              </div>
            </div>

            <template v-if="temResponsavelSecundario">
              <div class="divisoria"></div>

              <div class="bloco-responsavel">
                <p class="linha-info">
                  <span class="label">Responsável Secundário:</span>
                  <span class="valor">{{ residente.nome_responsavel_2 || '—' }}</span>
                </p>

                <div class="linha-dupla">
                  <p class="linha-info">
                    <span class="label">Grau de Parentesco:</span>
                    <span class="valor">{{ formatarParentesco(residente.parentesco_2) }}</span>
                  </p>

                  <p class="linha-info">
                    <span class="label">Telefone:</span>
                    <span class="valor">{{
                      formatarTelefone(residente.telefone_responsavel_2)
                    }}</span>
                  </p>
                </div>
              </div>
            </template>
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

        <h3 class="modal-titulo">Editar contatos</h3>

        <div class="modal-form">
          <span class="bloco-titulo">RESPONSÁVEL 1</span>

          <div class="form-group">
            <label for="modal-responsavel-1">NOME COMPLETO:</label>
            <input
              id="modal-responsavel-1"
              v-model="form.nome_responsavel"
              type="text"
              class="campo-input"
            />
          </div>

          <div class="linha-dupla">
            <div class="form-group">
              <label for="modal-parentesco-1">GRAU DE PARENTESCO:</label>
              <select id="modal-parentesco-1" v-model="form.parentesco" class="campo-select">
                <option value="" disabled>Selecione</option>
                <option value="pai">Pai</option>
                <option value="mae">Mãe</option>
                <option value="filho">Filho(a)</option>
                <option value="irmao">Irmão(ã)</option>
                <option value="neto">Neto(a)</option>
                <option value="conjuge">Cônjuge</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="modal-telefone-1">TELEFONE:</label>
              <input
                id="modal-telefone-1"
                v-model="form.telefone_responsavel"
                type="text"
                class="campo-input"
              />
            </div>
          </div>

          <div class="divisoria"></div>

          <span class="bloco-titulo">RESPONSÁVEL 2 (OPCIONAL)</span>

          <div class="form-group">
            <label for="modal-responsavel-2">NOME COMPLETO:</label>
            <input
              id="modal-responsavel-2"
              v-model="form.nome_responsavel_2"
              type="text"
              class="campo-input"
            />
          </div>

          <div class="linha-dupla">
            <div class="form-group">
              <label for="modal-parentesco-2">GRAU DE PARENTESCO:</label>
              <select id="modal-parentesco-2" v-model="form.parentesco_2" class="campo-select">
                <option value="" disabled>Selecione</option>
                <option value="pai">Pai</option>
                <option value="mae">Mãe</option>
                <option value="filho">Filho(a)</option>
                <option value="irmao">Irmão(ã)</option>
                <option value="neto">Neto(a)</option>
                <option value="conjuge">Cônjuge</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="modal-telefone-2">TELEFONE:</label>
              <input
                id="modal-telefone-2"
                v-model="form.telefone_responsavel_2"
                type="text"
                class="campo-input"
              />
            </div>
          </div>
        </div>

        <p v-if="erro" class="error-message">{{ erro }}</p>
        <p v-if="sucesso" class="success-message">{{ sucesso }}</p>

        <div class="modal-footer">
          <button class="btn-cancelar" type="button" :disabled="salvando" @click="fecharModal">
            CANCELAR
          </button>

          <button class="btn-salvar" type="button" :disabled="salvando" @click="salvarEdicao">
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
import BotaoVoltar from '@/components/BotaoVoltar.vue'

const route = useRoute()

const residente = ref(null)
const carregando = ref(false)
const erro = ref('')
const sucesso = ref('')
const mostrarModal = ref(false)
const salvando = ref(false)

const form = ref({
  nome_responsavel: '',
  telefone_responsavel: '',
  parentesco: '',
  nome_responsavel_2: '',
  telefone_responsavel_2: '',
  parentesco_2: '',
})

const mapaParentesco = {
  pai: 'Pai',
  mae: 'Mãe',
  filho: 'Filho(a)',
  irmao: 'Irmão(ã)',
  neto: 'Neto(a)',
  conjuge: 'Cônjuge',
  outro: 'Outro',
}

function formatarTelefone(telefone) {
  const tel = (telefone || '').replace(/\D/g, '')

  if (tel.length === 11) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`
  }

  if (tel.length === 10) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`
  }

  return telefone || '—'
}

function formatarParentesco(valor) {
  return mapaParentesco[valor] || valor || '—'
}

function desformatarTelefone(valor) {
  return (valor || '').replace(/\D/g, '')
}

const fotoUrl = computed(() => residente.value?.foto?.url || '')

const temResponsavelSecundario = computed(
  () => !!(residente.value?.nome_responsavel_2 || residente.value?.telefone_responsavel_2),
)

async function buscarResidente() {
  carregando.value = true
  erro.value = ''

  try {
    const resposta = await api.get(`/residentes/${route.params.id}/`)
    residente.value = resposta.data
  } catch (error) {
    erro.value = 'Erro ao carregar os dados do residente. Tente novamente.'
    residente.value = null
  } finally {
    carregando.value = false
  }
}

function abrirModal() {
  form.value.nome_responsavel = residente.value.nome_responsavel || ''
  form.value.telefone_responsavel = residente.value.telefone_responsavel || ''
  form.value.parentesco = residente.value.parentesco || ''
  form.value.nome_responsavel_2 = residente.value.nome_responsavel_2 || ''
  form.value.telefone_responsavel_2 = residente.value.telefone_responsavel_2 || ''
  form.value.parentesco_2 = residente.value.parentesco_2 || ''
  erro.value = ''
  sucesso.value = ''
  mostrarModal.value = true
}

function fecharModal() {
  mostrarModal.value = false
  erro.value = ''
}

async function salvarEdicao() {
  erro.value = ''
  sucesso.value = ''

  if (!form.value.nome_responsavel.trim()) {
    erro.value = 'Informe o nome do responsável.'
    return
  }

  salvando.value = true

  try {
    const dados = {
      nome_responsavel: form.value.nome_responsavel,
      telefone_responsavel: desformatarTelefone(form.value.telefone_responsavel),
      parentesco: form.value.parentesco,
      nome_responsavel_2: form.value.nome_responsavel_2 || '',
      telefone_responsavel_2: desformatarTelefone(form.value.telefone_responsavel_2),
      parentesco_2: form.value.parentesco_2 || '',
    }

    await api.patch(`/residentes/${route.params.id}/`, dados)

    residente.value = { ...residente.value, ...dados }
    mostrarModal.value = false
    sucesso.value = 'Contatos atualizados com sucesso!'
    setTimeout(() => {
      sucesso.value = ''
    }, 3000)
  } catch (error) {
    if (error.response?.data) {
      const erros = error.response.data
      const primeiroErro = Object.values(erros)[0]
      erro.value = Array.isArray(primeiroErro) ? primeiroErro[0] : primeiroErro
    } else {
      erro.value = 'Erro ao salvar. Tente novamente.'
    }
  } finally {
    salvando.value = false
  }
}

onMounted(buscarResidente)
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.contatos-prontuario-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: #f2f7f0;
  padding: 28px 24px 48px 24px;
}

/* Painel: card branco que agrupa os contatos do residente. */
.contatos-painel {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(47, 90, 43, 0.06);
  padding: 40px 48px;
}

.contatos-card {
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
  border: 1px solid #dde7d8;
  border-radius: 12px;
  background-color: #e8f1e3;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icone-foto-vazia {
  width: 52px;
  height: 52px;
  opacity: 0.6;
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
  transition: background 0.2s ease;
}

.btn-editar:hover {
  background: #2f5a2b;
}

.info-coluna {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 26px;
  min-width: 0;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.section-title {
  margin: 0;
  color: #1f2d1c;
  font-size: 22px;
  font-weight: 800;
}

.bloco-responsavel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bloco-titulo {
  color: #1f2d1c;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.linha-info {
  color: #4a5a47;
  font-size: 15px;
  margin: 0;
}

.label {
  font-weight: 700;
  margin-right: 6px;
  color: #1f2d1c;
}

.valor {
  font-weight: 400;
}

.linha-dupla {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 70px;
}

.divisoria {
  height: 1px;
  background: #dde7d8;
  margin: 4px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #1f2d1c;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.campo-input,
.campo-select {
  width: 100%;
  height: 38px;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  padding: 0 12px;
  font-family: inherit;
  font-size: 14px;
  color: #1f2d1c;
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s ease;
}

.campo-select {
  cursor: pointer;
}

.campo-input:focus,
.campo-select:focus {
  border-color: #3e7a2b;
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
  color: #2f5a2b;
  font-size: 13px;
  font-weight: 700;
  margin: 0;
}

.loading-message {
  color: #4a5a47;
  font-size: 14px;
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
  max-width: 560px;
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

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-form .error-message {
  margin: 16px 0 0 0;
}

.modal-form .success-message {
  margin: 16px 0 0 0;
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

  .contatos-painel {
    padding: 28px 20px;
  }

  .contatos-card {
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

  .btn-editar {
    width: 100%;
  }

  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .linha-dupla {
    flex-direction: column;
    gap: 10px;
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
