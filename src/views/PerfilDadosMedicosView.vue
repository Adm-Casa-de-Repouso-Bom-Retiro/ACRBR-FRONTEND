<template>
  <div class="dados-medicos-page">
    <div class="top-line"></div>

    <main class="main-content">
      <div class="dados-card">
        <div class="card-header">
          <div class="header-left">
            <div class="avatar"></div>
            <span class="residente-nome">Dados Médicos - {{ nomeResidente }}</span>
          </div>
          <button class="btn-editar" @click="toggleEdicao">
            {{ modoEdicao ? 'CANCELAR' : 'EDITAR DADOS' }}
          </button>
        </div>

        <p v-if="erro" class="msg-erro">{{ erro }}</p>
        <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>
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
              <tr
                v-for="(med, index) in medicamentos"
                :key="index"
                @click="!modoEdicao && toggleSelecionado(index)"
              >
                <td>
                  <span class="checkbox-icon" :class="{ marcado: med.selecionado }"></span>
                  <input
                    v-if="modoEdicao"
                    v-model="med.nome"
                    class="med-input"
                    placeholder="Nome do medicamento"
                    @click.stop
                  />
                  <template v-else>{{ med.nome }}</template>
                </td>
                <td>
                  <input
                    v-if="modoEdicao"
                    v-model="med.dosagem"
                    class="med-input"
                    placeholder="Dosagem"
                    @click.stop
                  />
                  <template v-else>{{ med.dosagem }}</template>
                </td>
                <td>
                  <input
                    v-if="modoEdicao"
                    v-model="med.horario"
                    class="med-input"
                    placeholder="Horário"
                    @click.stop
                  />
                  <template v-else>{{ med.horario }}</template>
                </td>
              </tr>
            </tbody>
          </table>

          <button v-if="modoEdicao" class="btn-adicionar" @click="adicionarMedicamento">
            + ADICIONAR MEDICAMENTO
          </button>
        </div>

        <div class="form-footer" v-if="modoEdicao">
          <button class="btn-salvar" :disabled="carregando" @click="handleSalvar">
            {{ carregando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'PerfilDadosMedicosView',

  data() {
    return {
      nomeResidente: 'Ana Paula Dominoni',
      modoEdicao: false,
      condicoesMedicas: '',
      alergias: '',
      observacoes: '',
      pesoAltura: '',
      medicamentos: [
        { nome: 'Losartana', dosagem: '50 mg', horario: '08:00h', selecionado: false },
        { nome: 'Metformina', dosagem: '850 mg', horario: '08:00h e 20:00h', selecionado: false },
        { nome: 'Cálcio + Vitamina D', dosagem: '1 comprimido', horario: '12:00h', selecionado: false },
      ],
      erro: '',
      sucesso: '',
      carregando: false,
    }
  },

  methods: {
    toggleEdicao() {
      this.modoEdicao = !this.modoEdicao
      this.erro = ''
      this.sucesso = ''
    },

    toggleSelecionado(index) {
      this.medicamentos[index].selecionado = !this.medicamentos[index].selecionado
    },

    adicionarMedicamento() {
      this.medicamentos.push({ nome: '', dosagem: '', horario: '', selecionado: false })
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
  color: inherit;
  border-bottom: 1px solid #e0ece2;
}

.medicamentos-table tbody tr:last-child td {
  border-bottom: none;
}

.medicamentos-table tbody tr {
  color: #1e3e1e;
  cursor: pointer;
  transition: background 0.15s ease;
}

.medicamentos-table tbody tr:hover {
  background: #e0ece2;
}

.checkbox-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-right: 8px;
  vertical-align: middle;
  border: 2px solid #3a7d44;
  border-radius: 3px;
  background: #fff;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.checkbox-icon.marcado {
  background: #1e3e1e;
  border-color: #1e3e1e;
}

.med-input {
  width: 100%;
  border: none;
  border-bottom: 1px solid #3a7d44;
  background: transparent;
  color: inherit;
  font-size: 13px;
  padding: 2px 4px;
  outline: none;
}

.med-input:focus {
  border-bottom-color: #1e3e1e;
}

/* Botão adicionar medicamento */
.btn-adicionar {
  display: block;
  width: 100%;
  background: #fff;
  border: none;
  border-top: 1px solid #3a7d44;
  color: #3a7d44;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  padding: 10px 14px;
  cursor: pointer;
  text-align: center;
}

.btn-adicionar:hover {
  background: #e0ece2;
  color: #1e3e1e;
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
</style>