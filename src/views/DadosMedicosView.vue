<template>
  <div class="dados-medicos-page">
    <main class="main-content">
      <BotaoVoltar to="/" />

      <section class="dados-painel">
        <h1 class="section-title">
          <span class="titulo-icone" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="4" stroke="#3e7a2b" stroke-width="1.5" />
              <path d="M12 8v8M8 12h8" stroke="#3e7a2b" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </span>
          DADOS MÉDICOS
        </h1>

        <p v-if="erro" class="error-message">{{ erro }}</p>
        <p v-if="sucesso" class="success-message">{{ sucesso }}</p>

        <form @submit.prevent="handleProximo" class="dados-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="condicoes">CONDIÇÕES MÉDICAS:</label>
              <textarea id="condicoes" v-model="condicoesMedicas"></textarea>
            </div>

            <div class="form-group">
              <label for="alergias">ALERGIAS:</label>
              <textarea id="alergias" v-model="alergias"></textarea>
            </div>

            <div class="form-group">
              <label for="medicamentos">MEDICAMENTOS E HORÁRIOS:</label>
              <textarea id="medicamentos" v-model="medicamentos"></textarea>
            </div>

            <div class="form-group">
              <label for="observacoes">OBSERVAÇÕES:</label>
              <textarea id="observacoes" v-model="observacoes"></textarea>
            </div>
          </div>

          <div class="form-footer">
            <button type="submit" class="btn-proximo" :disabled="carregando">
              {{ carregando ? 'AGUARDE...' : 'PRÓXIMO' }}
              <span v-if="!carregando" class="seta">→</span>
            </button>
          </div>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BotaoVoltar from '@/components/BotaoVoltar.vue'

const router = useRouter()
const emit = defineEmits(['dados-medicos'])

const condicoesMedicas = ref('')
const alergias = ref('')
const medicamentos = ref('')
const observacoes = ref('')
const erro = ref('')
const sucesso = ref('')
const carregando = ref(false)

async function handleProximo() {
  erro.value = ''
  sucesso.value = ''
  carregando.value = true

  try {
    emit('dados-medicos', {
      condicoes_medicas: condicoesMedicas.value,
      alergias: alergias.value,
      medicamentos: medicamentos.value,
      observacoes: observacoes.value,
    })

    router.push('/proximo-passo')
  } catch (error) {
    if (error.response && error.response.data) {
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

/* Painel: card branco que agrupa o formulário de dados médicos. */
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

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 24px 0;
  color: #1f2d1c;
  font-size: 22px;
  font-weight: 800;
}

.titulo-icone {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #e8f1e3;
  flex-shrink: 0;
}

.titulo-icone svg {
  width: 20px;
  height: 20px;
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
  margin: 0 0 16px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 32px;
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
  min-height: 110px;
  border: 1px solid #dde7d8;
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

.form-group textarea:focus {
  border-color: #3e7a2b;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-proximo {
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
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;
}

.btn-proximo:hover:not(:disabled) {
  background: #2f5a2b;
}

.btn-proximo:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.seta {
  font-size: 14px;
}

@media (max-width: 900px) {
  .main-content {
    padding: 20px 16px 40px 16px;
  }

  .dados-painel {
    padding: 28px 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .btn-proximo {
    width: 100%;
    justify-content: center;
  }
}
</style>
