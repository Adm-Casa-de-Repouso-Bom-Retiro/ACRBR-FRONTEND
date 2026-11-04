<template>
  <div class="nutricao-page">
    <main class="main-content">
      <BotaoVoltar :to="{ name: 'residente', params: { id: props.id } }" />

      <section class="nutricao-card">
        <div class="card-top">
          <h1 class="section-title">NUTRIÇÃO</h1>

          <div v-if="store.nutricoes.length > 0 && !store.loading" class="acoes">
            <button v-if="!editando" type="button" class="btn-editar" @click="iniciarEdicao">
              EDITAR
            </button>

            <template v-else>
              <button type="button" class="btn-cancelar" @click="cancelarEdicao">CANCELAR</button>
              <button type="button" class="btn-salvar" :disabled="!podeSalvar()" @click="salvar">
                SALVAR
              </button>
            </template>
          </div>
        </div>

        <p v-if="store.error" class="error-message">{{ store.error }}</p>
        <p v-if="sucesso" class="success-message">{{ sucesso }}</p>
        <p v-if="store.loading" class="loading-message">
          {{ editando ? 'Salvando nutrição...' : 'Carregando nutrição...' }}
        </p>

        <p
          v-if="!store.loading && !store.error && store.nutricoes.length === 0"
          class="empty-message"
        >
          Nenhum residente encontrado.
        </p>

        <div v-for="item in store.nutricoes" :key="item.id" class="residente-card">
          <div class="card-header">
            <div class="card-foto">
              <img
                v-if="item.foto"
                :src="item.foto.url"
                :alt="'Foto de ' + (item.nome || '')"
                class="foto"
              />
              <span v-else class="foto-vazia">—</span>
            </div>

            <h2 class="residente-nome">{{ item.nome || '—' }}</h2>
          </div>

          <div class="card-info">
            <div class="info-box">
              <span class="info-label">AVALIAÇÃO</span>
              <p class="info-text">Peso: {{ item.peso ? item.peso + ' kg' : '—' }}</p>
              <p class="info-text">Altura: {{ item.altura ? item.altura + ' m' : '—' }}</p>
              <p class="info-text">IMC: {{ item.imc || '—' }}</p>
              <p class="info-text">Classificação: {{ classificarImc(item.imc) }}</p>
            </div>

            <div class="info-box">
              <span class="info-label">PLANO ALIMENTAR</span>

              <template v-if="!editando">
                <p class="info-text">{{ item.plano_alimentar || '—' }}</p>
              </template>

              <template v-else>
                <textarea v-model="planoAlimentar" class="campo-area" rows="5"></textarea>
              </template>
            </div>

            <div class="info-box">
              <span class="info-label">RESTRIÇÕES ALIMENTARES</span>

              <template v-if="!editando">
                <p class="info-text">{{ item.observacoes || '—' }}</p>
              </template>

              <template v-else>
                <textarea v-model="observacoes" class="campo-area" rows="5"></textarea>
              </template>
            </div>
          </div>

          <div v-if="editando" class="form-data">
            <label for="data-avaliacao" class="data-label">DATA DA AVALIAÇÃO</label>
            <input id="data-avaliacao" v-model="dataAvaliacao" type="date" class="campo-data" />
          </div>

          <p v-if="!item.peso || !item.altura" class="aviso-dados">
            Peso e altura devem ser preenchidos em
            <router-link :to="{ name: 'perfildadosmedicos', params: { id: props.id } }">
              Dados Médicos
            </router-link>
            antes de salvar.
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useNutricaoStore } from '../stores/nutricao.js'
import BotaoVoltar from '../components/BotaoVoltar.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const store = useNutricaoStore()

const editando = ref(false)
const planoAlimentar = ref('')
const observacoes = ref('')
const dataAvaliacao = ref('')
const sucesso = ref('')

function classificarImc(imc) {
  if (imc === null || imc === undefined || imc === '') return '—'

  const valor = Number(imc)

  if (Number.isNaN(valor)) return '—'

  if (valor < 18.5) return 'Baixo peso'
  if (valor < 25) return 'Peso normal (adequado)'
  if (valor < 30) return 'Sobrepeso'
  if (valor < 35) return 'Obesidade grau I'
  if (valor < 40) return 'Obesidade grau II'
  return 'Obesidade grau III (grave)'
}

function podeSalvar() {
  const item = store.nutricoes[0]

  return !!item && !!item.peso && !!item.altura && !!dataAvaliacao.value && !store.loading
}

function iniciarEdicao() {
  const item = store.nutricoes[0]

  if (!item) return

  planoAlimentar.value = item.plano_alimentar || ''
  observacoes.value = item.observacoes || ''
  dataAvaliacao.value = item.data_avaliacao || ''
  store.error = ''
  sucesso.value = ''
  editando.value = true
}

function cancelarEdicao() {
  store.error = ''
  sucesso.value = ''
  editando.value = false
}

function salvar() {
  sucesso.value = ''

  store
    .salvarNutricao(props.id, {
      plano_alimentar: planoAlimentar.value,
      observacoes: observacoes.value,
      data_avaliacao: dataAvaliacao.value,
    })
    .then((salvou) => {
      if (salvou) {
        sucesso.value = 'Nutrição salva com sucesso!'
        editando.value = false
      }
    })
}

onMounted(() => {
  store.fetchNutricoes(props.id)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.nutricao-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: #f2f7f0;
  padding: 28px 24px 48px 24px;
}

.nutricao-card {
  width: 80vw;
  margin: 0 auto;
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

.section-title {
  margin: 0;
  color: #3a7d44;
  font-size: 22px;
  font-weight: 800;
}

.acoes {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-editar {
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

.btn-editar:hover {
  background: #2f5a2b;
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

.btn-cancelar:hover {
  background: #eef7ec;
}

.residente-card {
  background: #ffffff;
  border: 1px solid #3a7d44;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 18px;
}

.residente-card:last-child {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid #d7ead7;
  padding-bottom: 14px;
  margin-bottom: 16px;
}

.card-foto {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border: 1px solid #3a7d44;
  border-radius: 50%;
  background: #eef7ec;
  overflow: hidden;
  flex-shrink: 0;
}

.foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.foto-vazia {
  color: #4a5a47;
  font-size: 16px;
  font-weight: 700;
}

.residente-nome {
  margin: 0;
  color: #1f2d1c;
  font-size: 18px;
  font-weight: 800;
}

.card-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.info-box {
  background: #eef7ec;
  border: 1px solid #cfe3cf;
  border-radius: 10px;
  padding: 14px;
}

.info-label {
  display: block;
  margin-bottom: 8px;
  color: #3a7d44;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.6px;
}

.info-text {
  margin: 0 0 4px 0;
  color: #1f2d1c;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.info-text:last-child {
  margin-bottom: 0;
}

.campo-area {
  width: 100%;
  min-height: 110px;
  border: 1px solid #cfe3cf;
  border-radius: 8px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 14px;
  color: #1f2d1c;
  background: #ffffff;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s ease;
}

.campo-area:focus {
  border-color: #3a7d44;
}

.form-data {
  display: flex;
  flex-direction: column;
  gap: 7px;
  max-width: 280px;
  margin-top: 14px;
}

.data-label {
  color: #3a7d44;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.6px;
}

.campo-data {
  height: 38px;
  border: 1px solid #cfe3cf;
  border-radius: 8px;
  padding: 0 12px;
  font-family: inherit;
  font-size: 14px;
  color: #1f2d1c;
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s ease;
}

.campo-data:focus {
  border-color: #3a7d44;
}

.aviso-dados {
  margin: 14px 0 0 0;
  color: #8a1f1f;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}

.aviso-dados a {
  color: #3a7d44;
  font-weight: 800;
  text-decoration: none;
}

.aviso-dados a:hover {
  text-decoration: underline;
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
  margin: 0;
  color: #4a5a47;
  font-size: 14px;
}

.empty-message {
  margin: 0;
  color: #4a5a47;
  font-size: 14px;
}

@media (max-width: 900px) {
  .main-content {
    padding: 20px 16px 40px 16px;
  }

  .nutricao-card {
    width: 92vw;
    padding: 24px 18px;
  }

  .card-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .acoes {
    width: 100%;
    flex-wrap: wrap;
  }

  .btn-editar,
  .btn-salvar {
    flex: 1;
  }

  .card-info {
    grid-template-columns: 1fr;
  }
}
</style>
