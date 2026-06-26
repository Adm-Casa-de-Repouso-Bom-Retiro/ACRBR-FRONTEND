<template>
  <div class="dados-medicos-page">

    <main class="main-content">
      <div class="dados-card">

        <!-- Header -->
        <div class="card-header">
          <div class="header-left">
            <div class="avatar">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#ccc"/>
                <circle cx="20" cy="15" r="7" fill="#888"/>
                <ellipse cx="20" cy="34" rx="12" ry="8" fill="#888"/>
              </svg>
            </div>
            <span class="residente-nome">Dados Médicos - {{ nomeResidente }}</span>
          </div>
          <button class="btn-editar" @click="toggleEdicao">EDITAR DADOS</button>
        </div>

        <p v-if="erro" class="msg-erro">{{ erro }}</p>
        <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>

        <!-- Grid 2x2 -->
        <div class="form-grid">
          <div class="form-group">
            <label>Condições Médicas:</label>
            <textarea v-model="condicoesMedicas" :disabled="!modoEdicao" />
          </div>
          <div class="form-group">
            <label>Alergias:</label>
            <textarea v-model="alergias" :disabled="!modoEdicao" />
          </div>
          <div class="form-group">
            <label>Observações:</label>
            <textarea v-model="observacoes" :disabled="!modoEdicao" />
          </div>
          <div class="form-group">
            <label>Peso e Altura:</label>
            <textarea v-model="pesoAltura" :disabled="!modoEdicao" />
          </div>
        </div>

        <!-- Tabela Medicamentos -->
        <div class="medicamentos-section">
          <table class="medicamentos-table">
            <thead>
              <tr>
                <th>Medicamentos:</th>
                <th>Dosagem:</th>
                <th>Horário:</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="medicamentos.length === 0">
                <td colspan="3" class="sem-medicamentos">Nenhum medicamento cadastrado.</td>
              </tr>
              <tr v-for="(med, index) in medicamentos" :key="index">
                <td><span class="checkbox-icon">☐</span> {{ med.nome }}</td>
                <td>{{ med.dosagem }}</td>
                <td>{{ med.horario }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="form-footer" v-if="modoEdicao">
          <button class="btn-salvar" @click="handleSalvar" :disabled="carregando">
            {{ carregando ? 'AGUARDE...' : 'SALVAR →' }}
          </button>
        </div>

      </div>
    </main>

  </div>
</template>

<script>
export default {
  name: 'DadosMedicosView',

  data() {
    return {
      nomeResidente: 'Ana Paula Dominoni',
      modoEdicao: false,
      condicoesMedicas: '',
      alergias: '',
      observacoes: '',
      pesoAltura: '',
      medicamentos: [],
      erro: '',
      sucesso: '',
      carregando: false,
    }
  },

  methods: {
    toggleEdicao() {
      this.modoEdicao = !this.modoEdicao
    },

    async handleSalvar() {
      this.erro = ''
      this.sucesso = ''
      this.carregando = true
      try {
        this.$emit('dados-medicos', {
          condicoes_medicas: this.condicoesMedicas,
          alergias: this.alergias,
          observacoes: this.observacoes,
          peso_altura: this.pesoAltura,
          medicamentos: this.medicamentos,
        })
        this.sucesso = 'Dados salvos com sucesso!'
        this.modoEdicao = false
      } catch (error) {
        this.erro = 'Erro ao salvar. Tente novamente.'
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
  margin: 0;
  padding: 0;
}

.dados-medicos-page {
  background-color: #ffffff !important;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  background-color: #ffffff !important;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
}

.dados-card {
  background-color: #ffffff !important;
  width: 80vw;
  border: 2px solid #3a7d44;
  border-radius: 10px;
  padding: 24px 32px;
}

/* Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #3a7d44;
  flex-shrink: 0;
}

.avatar svg {
  width: 100%;
  height: 100%;
}

.residente-nome {
  background-color: #3a7d44;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 4px;
}

.btn-editar {
  background-color: #ffffff !important;
  color: #3a7d44;
  border: 2px solid #3a7d44;
  padding: 6px 18px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.5px;
}

.btn-editar:hover {
  background-color: #f0f8f0 !important;
}

/* Mensagens */
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

/* Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.form-group label {
  font-size: 13px;
  font-weight: 700;
  color: #1e3e1e;
  letter-spacing: 0.3px;
  padding: 8px 10px 4px 10px;
}

.form-group textarea {
  width: 100%;
  height: 90px;
  border: 2px solid #3a7d44;
  border-radius: 6px;
  padding: 4px 10px 8px 10px;
  font-size: 13px;
  color: #1e3e1e;
  resize: none;
  outline: none;
  background-color: #ffffff !important;
}

.form-group textarea:disabled {
  background-color: #ffffff !important;
  cursor: default;
  color: #1e3e1e;
}

.form-group textarea:focus {
  border-color: #1e3e1e;
}

/* Tabela */
.medicamentos-section {
  border: 2px solid #3a7d44;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff !important;
}

.medicamentos-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background-color: #ffffff !important;
}

.medicamentos-table th {
  text-align: left;
  padding: 10px 16px;
  font-weight: 700;
  color: #1e3e1e;
  background-color: #ffffff !important;
  border-bottom: 1px solid #3a7d44;
}

.medicamentos-table td {
  padding: 8px 16px;
  color: #1e3e1e;
  background-color: #ffffff !important;
  border-bottom: 1px solid #e8f0e8;
}

.medicamentos-table tbody tr:last-child td {
  border-bottom: none;
}

.sem-medicamentos {
  text-align: center;
  color: #888;
  font-style: italic;
  padding: 16px !important;
}

.checkbox-icon {
  margin-right: 6px;
}

/* Footer do card */
.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

.btn-salvar {
  background: none;
  border: none;
  color: #3a7d44;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  letter-spacing: 0.6px;
}

.btn-salvar:hover:not(:disabled) {
  color: #1e3e1e;
}

.btn-salvar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>