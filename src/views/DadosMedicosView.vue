<template>
  <div class="dados-medicos-page">
    <div class="top-line"></div>

    <main class="main-content">
      <div class="dados-card">

        <!-- Header com avatar + nome + botão -->
        <div class="card-header">
          <div class="header-left">
            <div class="avatar"></div>
            <span class="residente-nome">Dados Médicos - {{ nomeResidente }}</span>
          </div>
          <button class="btn-editar" @click="toggleEdicao">EDITAR DADOS</button>
        </div>

        <p v-if="erro" class="msg-erro">{{ erro }}</p>
        <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>

        <!-- Grid 2x2: Condições, Alergias, Observações, Peso e Altura -->
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

        <!-- Tabela de Medicamentos -->
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
              <tr v-for="(med, index) in medicamentos" :key="index">
                <td>
                  <span class="checkbox-icon">&#9744;</span>
                  {{ med.nome }}
                </td>
                <td>{{ med.dosagem }}</td>
                <td>{{ med.horario }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer do card com botão salvar (só aparece em edição) -->
        <div class="form-footer" v-if="modoEdicao">
          <button class="btn-salvar" @click="handleSalvar" :disabled="carregando">
            {{ carregando ? 'AGUARDE...' : 'SALVAR →' }}
          </button>
        </div>

      </div>
    </main>

    <!-- Footer da página -->
    <footer class="page-footer">
      <div class="footer-left">
        <p>Desenvolvido por: Ana Paula Dominoni,</p>
        <p>Anna Flávia S. Carneiro, Emily V. D. Ropolato,</p>
        <p>Kelly P. Alves, Pietra G. S. Lavina</p>
      </div>
      <div class="footer-center">ACRBR</div>
      <div class="footer-right">
        <p><strong>PRONTUÁRIOS</strong></p>
        <p>CADASTRO DE RESIDENTE</p>
        <p>ADMINISTRADOR</p>
      </div>
    </footer>
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
      medicamentos: [
        { nome: 'Losartana', dosagem: '50 mg', horario: '08:00h' },
        { nome: 'Metformina', dosagem: '850 mg', horario: '08:00h e 20:00h' },
        { nome: 'Cálcio + Vitamina D', dosagem: '1 comprimido', horario: '12:00h' },
      ],
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
  background: #2e5d2e;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
}

.dados-card {
  width: 80vw;
  border: 3px solid #3a7d44;
  border-radius: 12px;
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
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ccc;
  flex-shrink: 0;
}

.residente-nome {
  background: #3a7d44;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 4px;
}

.btn-editar {
  background: #3a7d44;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.5px;
}

.btn-editar:hover {
  background: #1e3e1e;
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

/* Grid 2x2 */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
  margin-bottom: 20px;
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
  letter-spacing: 0.4px;
}

.form-group textarea {
  width: 100%;
  height: 90px;
  border: 2px solid #3a7d44;
  border-radius: 6px;
  padding: 8px;
  font-size: 13px;
  color: #1e3e1e;
  resize: none;
  outline: none;
  background: #fff;
}

.form-group textarea:disabled {
  background: #fff;
  cursor: default;
}

.form-group textarea:focus {
  border-color: #1e3e1e;
}

/* Tabela de medicamentos */
.medicamentos-section {
  border: 2px solid #3a7d44;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.medicamentos-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.medicamentos-table thead tr {
  background: #fff;
}

.medicamentos-table th {
  text-align: left;
  padding: 10px 14px;
  font-weight: 700;
  color: #1e3e1e;
  border-bottom: 1px solid #3a7d44;
}

.medicamentos-table td {
  padding: 8px 14px;
  color: #1e3e1e;
  border-bottom: 1px solid #e0ece2;
}

.medicamentos-table tbody tr:last-child td {
  border-bottom: none;
}

.checkbox-icon {
  margin-right: 6px;
  font-size: 14px;
}

/* Footer do card */
.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
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

/* Footer da página */
.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #1e3e1e;
  color: #fff;
  padding: 20px 60px;
  font-size: 12px;
  margin-top: auto;
}

.footer-left p {
  margin: 2px 0;
  color: #ccc;
}

.footer-center {
  font-size: 20px;
  font-weight: 700;
  align-self: center;
}

.footer-right p {
  margin: 2px 0;
  text-align: right;
}

.footer-right p:first-child {
  font-weight: 700;
}
</style>