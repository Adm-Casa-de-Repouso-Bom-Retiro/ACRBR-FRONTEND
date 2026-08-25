<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const residente = ref(null)
const carregando = ref(false)
const erro = ref('')
const sucesso = ref('')
const modoEdicao = ref(false)
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

function iniciarEdicao() {
  form.value.nome_responsavel = residente.value.nome_responsavel || ''
  form.value.telefone_responsavel = residente.value.telefone_responsavel || ''
  form.value.parentesco = residente.value.parentesco || ''
  form.value.nome_responsavel_2 = residente.value.nome_responsavel_2 || ''
  form.value.telefone_responsavel_2 = residente.value.telefone_responsavel_2 || ''
  form.value.parentesco_2 = residente.value.parentesco_2 || ''
  modoEdicao.value = true
  erro.value = ''
  sucesso.value = ''
}

function cancelarEdicao() {
  modoEdicao.value = false
  erro.value = ''
  sucesso.value = ''
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
    modoEdicao.value = false
    sucesso.value = 'Contatos atualizados com sucesso!'
    setTimeout(() => { sucesso.value = '' }, 3000)
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

<template>
  <div class="contatos-prontuario-page">
    <main class="main-content">
      <p v-if="erro" class="msg-erro">{{ erro }}</p>

      <div v-if="carregando" class="msg-carregando">Carregando dados do residente...</div>

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
                  stroke="#ffffff"
                  stroke-width="1.4"
                />
                <circle cx="12" cy="13" r="3.2" stroke="#ffffff" stroke-width="1.4" />
              </svg>
            </div>

            <button
              v-if="!modoEdicao"
              class="btn-editar"
              type="button"
              @click="iniciarEdicao"
            >
              EDITAR DADOS
            </button>
          </div>

          <div class="info-coluna">
            <div class="card-header">
              <div class="titulo-pill">
                <span>Contatos - {{ residente.nome_completo }}</span>
              </div>

              <div v-if="modoEdicao" class="botoes-header">
                <button
                  class="btn-cancelar"
                  type="button"
                  :disabled="salvando"
                  @click="cancelarEdicao"
                >
                  CANCELAR
                </button>

                <button
                  class="btn-salvar"
                  type="button"
                  :disabled="salvando"
                  @click="salvarEdicao"
                >
                  {{ salvando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES' }}
                </button>
              </div>
            </div>

            <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>

            <div v-if="!modoEdicao" class="bloco-responsavel">
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

            <div v-else class="bloco-responsavel">
              <span class="bloco-titulo">RESPONSÁVEL 1</span>

              <div class="form-group">
                <label>NOME COMPLETO:</label>
                <input v-model="form.nome_responsavel" type="text" class="campo-input" />
              </div>

              <div class="linha-dupla">
                <div class="form-group">
                  <label>GRAU DE PARENTESCO:</label>
                  <select v-model="form.parentesco" class="campo-select">
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
                  <label>TELEFONE:</label>
                  <input v-model="form.telefone_responsavel" type="text" class="campo-input" />
                </div>
              </div>
            </div>

            <template v-if="temResponsavelSecundario || modoEdicao">
              <div class="divisoria"></div>

              <div v-if="!modoEdicao" class="bloco-responsavel">
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

              <div v-else class="bloco-responsavel">
                <span class="bloco-titulo">RESPONSÁVEL 2 (OPCIONAL)</span>

                <div class="form-group">
                  <label>NOME COMPLETO:</label>
                  <input v-model="form.nome_responsavel_2" type="text" class="campo-input" />
                </div>

                <div class="linha-dupla">
                  <div class="form-group">
                    <label>GRAU DE PARENTESCO:</label>
                    <select v-model="form.parentesco_2" class="campo-select">
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
                    <label>TELEFONE:</label>
                    <input v-model="form.telefone_responsavel_2" type="text" class="campo-input" />
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>
    </main>

    <div class="linha-divisoria"></div>
  </div>
</template>

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
  background: #2e5d2e;
  padding: 48px 60px 56px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.msg-erro {
  color: #ffdada;
  font-size: 13px;
  margin-bottom: 16px;
}

.msg-sucesso {
  color: #d9f2c2;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 16px;
}

.msg-carregando {
  color: #ffffff;
  font-size: 14px;
  text-align: center;
}

.contatos-painel {
  width: 100%;
  max-width: 1080px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.045);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  padding: 52px 58px;
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
  border-radius: 10px;
  background-color: #d9d9d9;
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
  background: #6ba13f;
  color: #ffffff;
  border: none;
  padding: 12px 0;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.btn-editar:hover {
  background: #7caf49;
  transform: translateY(-2px);
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

.botoes-header {
  display: flex;
  gap: 10px;
}

.titulo-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #6ba13f;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 10px 26px;
  border-radius: 6px;
}

.btn-cancelar {
  background: transparent;
  color: #ffffff;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 7px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.btn-cancelar:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: #ffffff;
}

.btn-salvar {
  background: #6ba13f;
  color: #ffffff;
  border: none;
  padding: 11px 26px;
  border-radius: 7px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.btn-salvar:hover:not(:disabled) {
  background: #7caf49;
  transform: translateY(-2px);
}

.btn-salvar:disabled,
.btn-cancelar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.bloco-responsavel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bloco-titulo {
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.linha-info {
  color: #ffffff;
  font-size: 15px;
  margin: 0;
}

.label {
  font-weight: 700;
  margin-right: 6px;
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
  background: rgba(255, 255, 255, 0.4);
  margin: 4px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.campo-input,
.campo-select {
  width: 100%;
  height: 38px;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 0 12px;
  font-family: inherit;
  font-size: 14px;
  color: #1e3e1e;
  background: #ffffff;
  outline: none;
  transition: box-shadow 0.15s ease;
}

.campo-select {
  cursor: pointer;
}

.campo-input:focus,
.campo-select:focus {
  border-color: #8fbe4a;
  box-shadow: 0 0 0 3px rgba(143, 190, 74, 0.35);
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

  .contatos-painel {
    padding: 32px 26px;
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

  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .botoes-header {
    flex-direction: column;
  }

  .linha-dupla {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
