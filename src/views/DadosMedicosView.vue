<template>
  <div class="dados-medicos-page">
    <div class="top-line"></div>

    <main class="main-content">
      <div class="dados-card">

        <div class="card-header">
          <img src="/src/assets/images/icone-dados-medicos.png" alt="Dados Médicos" class="header-icon" />
          Dados Médicos
        </div>

        <p v-if="erro" class="msg-erro">{{ erro }}</p>
        <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>

        <form @submit.prevent="handleProximo" class="dados-form">
          <div class="form-grid">
            <div class="form-group">
              <label>CONDIÇÕES MÉDICAS:</label>
              <textarea v-model="condicoesMedicas" />
            </div>

            <div class="form-group">
              <label>ALERGIAS:</label>
              <textarea v-model="alergias" />
            </div>

            <div class="form-group">
              <label>MEDICAMENTOS E HORÁRIOS:</label>
              <textarea v-model="medicamentos" />
            </div>

            <div class="form-group">
              <label>OBSERVAÇÕES:</label>
              <textarea v-model="observacoes" />
            </div>
          </div>

          <div class="form-footer">
            <button type="submit" class="btn-proximo" :disabled="carregando">
              {{ carregando ? 'AGUARDE...' : 'PRÓXIMO →' }}
            </button>
          </div>
        </form>

      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'DadosMedicosView',

  data() {
    return {
      condicoesMedicas: '',
      alergias: '',
      medicamentos: '',
      observacoes: '',
      erro: '',
      sucesso: '',
      carregando: false,
    }
  },

  methods: {
    async handleProximo() {
      this.erro = ''
      this.sucesso = ''
      this.carregando = true

      try {
        this.$emit('dados-medicos', {
          condicoes_medicas: this.condicoesMedicas,
          alergias: this.alergias,
          medicamentos: this.medicamentos,
          observacoes: this.observacoes,
        })

        this.$router.push('/proximo-passo')
      } catch (error) {
        if (error.response && error.response.data) {
          const erros = error.response.data
          const primeiroErro = Object.values(erros)[0]
          this.erro = Array.isArray(primeiroErro) ? primeiroErro[0] : primeiroErro
        } else {
          this.erro = 'Erro ao salvar. Tente novamente.'
        }
      } finally {
        this.carregando = false
      }
    },
  },
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.top-line {
  width: 100%;
  height: 1.3vw;
  background: #1e3e1e;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 80px 20px;
}

.dados-card {
  width: 100%;
  max-width: 70vw;
  border: 3px solid #3a7d44;
  border-radius: 12px;
  padding: 28px 36px 24px 36px;
}

.card-header {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #3a7d44;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 28px; 
}

.header-icon {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

.msg-erro {
  color: #c0392b;
  font-size: 13px;
  margin-bottom: 10px;
}

.msg-sucesso {
  color: #1e3e1e;
  font-size: 13px;
  margin-bottom: 10px;
  font-weight: bold;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 13px;
  font-weight: 700;
  color: #1e3e1e;
  letter-spacing: 0.6px;
}

.form-group textarea {
  width: 100%;
  height: 100px; /* era 70px */
  border: 2px solid #3a7d44;
  border-radius: 6px;
  padding: 8px;
  font-size: 13px;
  color: #1e3e1e;
  resize: none;
  outline: none;
}

.form-group textarea:focus {
  border-color: #1e3e1e;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.btn-proximo {
  background: none;
  border: none;
  color: #3a7d44;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  letter-spacing: 0.6px;
}

.btn-proximo:hover:not(:disabled) {
  color: #1e3e1e;
}

.btn-proximo:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>