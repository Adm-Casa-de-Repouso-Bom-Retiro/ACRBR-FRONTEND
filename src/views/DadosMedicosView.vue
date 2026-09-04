<template>
  <div class="dados-medicos-page">
    <main class="main-content">
      <section class="dados-painel">
        <div class="titulo-pill">
          <img
            :src="iconeDadosMedicos"
            alt=""
            aria-hidden="true"
            class="titulo-icone"
          />
          <span>DADOS MÉDICOS</span>
        </div>

        <p v-if="erro" class="msg-erro">{{ erro }}</p>
        <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>

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

    <div class="linha-divisoria"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import iconeDadosMedicos from '@/assets/images/icone-dados-medicos.png'

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
  background: linear-gradient(160deg, #2e5d2e 0%, #3c7039 45%, #6ba13f 100%);
  padding: 28px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dados-painel {
  width: 100%;
  max-width: 1080px;
}

.titulo-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  background: #ffffff;
  color: #2e5d2e;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 8px 20px;
  border-radius: 999px;
  margin-bottom: 20px;
}

.titulo-icone {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(35%) sepia(24%) saturate(1200%) hue-rotate(70deg);
}

.msg-erro {
  color: #c0392b;
  font-size: 13px;
  margin: 0 0 16px 0;
}

.msg-sucesso {
  color: #2e5d2e;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.dados-form {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
  padding: 20px 18px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  color: #2e5d2e;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.form-group textarea {
  width: 100%;
  min-height: 110px;
  border: 1.5px solid #d9d9d9;
  border-radius: 12px;
  padding: 11px 14px;
  font-family: inherit;
  font-size: 14px;
  color: #1e3e1e;
  background: #ffffff;
  resize: vertical;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.form-group textarea:focus {
  border-color: #8fbe4a;
  box-shadow: 0 0 0 3px rgba(143, 190, 74, 0.25);
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-proximo {
  width: 100%;
  background: #6ba13f;
  border: none;
  color: #ffffff;
  font-family: inherit;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  padding: 14px 0;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition:
    background 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.btn-proximo:hover:not(:disabled) {
  background: #7caf49;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.btn-proximo:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.seta {
  font-size: 14px;
}

.linha-divisoria {
  height: 8px;
  background: #ffffff;
  width: 100%;
}

@media (min-width: 768px) {
  .main-content {
    background: #2e5d2e;
    padding: 48px 60px 56px 60px;
  }

  .dados-painel {
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.045);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
    padding: 52px 58px;
  }

  .titulo-pill {
    background: #6ba13f;
    color: #ffffff;
    font-size: 17px;
    padding: 10px 26px;
    border-radius: 6px;
  }

  .titulo-icone {
    filter: brightness(0) invert(1);
  }

  .msg-erro {
    color: #ffdada;
  }

  .msg-sucesso {
    color: #d9f2c2;
  }

  .dados-form {
    background: transparent;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
  }

  .form-grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px 32px;
  }

  .form-group label {
    color: #ffffff;
    font-size: 12px;
  }

  .form-group textarea {
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 10px 12px;
  }

  .btn-proximo {
    width: auto;
    padding: 12px 34px;
    border-radius: 7px;
  }
}
</style>
