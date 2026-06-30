```vue
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
                <th v-if="modoEdicao"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="medicamentos.length === 0 && !modoEdicao">
                <td colspan="3" class="sem-medicamentos">Nenhum medicamento cadastrado.</td>
              </tr>
              <tr v-for="(med, index) in medicamentos" :key="index">
                <td><span class="checkbox-icon">☐</span> {{ med.nome }}</td>
                <td>{{ med.dosagem }}</td>
                <td>{{ med.horario }}</td>
                <td v-if="modoEdicao" class="col-acao">
                  <button type="button" class="btn-remover" @click="removerMedicamento(index)">✕</button>
                </td>
              </tr>
              <tr v-if="modoEdicao" class="linha-novo-medicamento">
                <td>
                  <input type="text" v-model="novoMedicamento.nome" placeholder="Nome do medicamento" />
                </td>
                <td>
                  <input type="text" v-model="novoMedicamento.dosagem" placeholder="Ex: 50 mg" />
                </td>
                <td>
                  <input type="text" v-model="novoMedicamento.horario" placeholder="Ex: 08:00" />
                </td>
                <td class="col-acao">
                  <button type="button" class="btn-adicionar" @click="adicionarMedicamento">+</button>
                </td>
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

  props: {
    // ID do residente, geralmente vindo da rota (ex: /residente/:id/dados-medicos)
    residenteId: {
      type: [String, Number],
      default: null,
    },
  },

  data() {
    return {
      nomeResidente: '',
      modoEdicao: false,
      condicoesMedicas: '',
      alergias: '',
      observacoes: '',
      pesoAltura: '',
      medicamentos: [],
      novoMedicamento: { nome: '', dosagem: '', horario: '' },
      erro: '',
      sucesso: '',
      carregando: false,
    }
  },

  created() {
    this.carregarResidente()
  },

  methods: {
    toggleEdicao() {
      this.modoEdicao = !this.modoEdicao
    },

    async carregarResidente() {
      // Pega o id pela prop, ou pela rota (ajuste conforme o nome do param na sua rota)
      const id = this.residenteId || this.$route?.params?.id
      if (!id) return

      try {
        const resposta = await fetch(`/api/residentes/${id}`)
        if (!resposta.ok) throw new Error('Falha ao buscar residente')
        const dados = await resposta.json()

        this.nomeResidente = dados.nome
        // Se o cadastro do residente já trouxer os dados médicos, preenche também:
        this.condicoesMedicas = dados.condicoes_medicas || ''
        this.alergias = dados.alergias || ''
        this.observacoes = dados.observacoes || ''
        this.pesoAltura = dados.peso_altura || ''
        this.medicamentos = dados.medicamentos || []
      } catch (error) {
        this.erro = 'Erro ao carregar dados do residente.'
      }
    },

    adicionarMedicamento() {
      if (!this.novoMedicamento.nome.trim()) {
        this.erro = 'Informe o nome do medicamento.'
        return
      }
      this.erro = ''
      this.medicamentos.push({ ...this.novoMedicamento })
      this.novoMedicamento = { nome: '', dosagem: '', horario: '' }
    },

    removerMedicamento(index) {
      this.medicamentos.splice(index, 1)
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
  background-color: #305126 !important;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  background-color: #305126 !important;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
}

.dados-card {
  background-color: #305126 !important;
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
  border: 2px solid #ffffff;
  flex-shrink: 0;
}

.avatar svg {
  width: 100%;
  height: 100%;
}

.residente-nome {
  background-color: #4a9d4a;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 4px;
}

.btn-editar {
  background-color: #4a9d4a !important;
  color: #ffffff;
  border: none;
  padding: 6px 18px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.5px;
}

.btn-editar:hover {
  background-color: #5cb35c !important;
}

/* Mensagens */
.msg-erro {
  color: #ffb4a8;
  font-size: 13px;
  margin-bottom: 10px;
}

.msg-sucesso {
  color: #ffffff;
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
  color: #ffffff;
  letter-spacing: 0.3px;
  padding: 8px 10px 4px 10px;
}

.form-group textarea {
  width: 100%;
  height: 90px;
  border: 2px solid #ffffff;
  border-radius: 6px;
  padding: 4px 10px 8px 10px;
  font-size: 13px;
  color: #ffffff;
  resize: none;
  outline: none;
  background-color: #305126 !important;
}

.form-group textarea::placeholder {
  color: #d4e4d4;
}

.form-group textarea:disabled {
  background-color: #305126 !important;
  cursor: default;
  color: #ffffff;
}

.form-group textarea:focus {
  border-color: #4a9d4a;
}

/* Tabela */
.medicamentos-section {
  border: 2px solid #ffffff;
  border-radius: 8px;
  overflow: hidden;
  background-color: #305126 !important;
}

.medicamentos-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  background-color: #305126 !important;
}

.medicamentos-table th {
  text-align: left;
  padding: 10px 16px;
  font-weight: 700;
  color: #ffffff;
  background-color: #305126 !important;
  border-bottom: 1px solid #ffffff;
}

.medicamentos-table td {
  padding: 8px 16px;
  color: #ffffff;
  background-color: #305126 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.medicamentos-table tbody tr:last-child td {
  border-bottom: none;
}

.sem-medicamentos {
  text-align: center;
  color: #d4e4d4;
  font-style: italic;
  padding: 16px !important;
}

.checkbox-icon {
  margin-right: 6px;
  color: #ffffff;
}

.col-acao {
  width: 36px;
  text-align: center;
}

.linha-novo-medicamento td {
  padding: 6px 16px;
}

.linha-novo-medicamento input {
  width: 100%;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #ffffff;
  color: #ffffff;
  font-size: 13px;
  padding: 4px 2px;
  outline: none;
}

.linha-novo-medicamento input::placeholder {
  color: #b8d0b8;
}

.linha-novo-medicamento input:focus {
  border-bottom-color: #5cb35c;
}

.btn-adicionar,
.btn-remover {
  background-color: #4a9d4a;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

.btn-adicionar:hover {
  background-color: #5cb35c;
}

.btn-remover {
  background-color: transparent;
  border: 1px solid #ff9d8e;
  color: #ff9d8e;
}

.btn-remover:hover {
  background-color: #ff9d8e;
  color: #305126;
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
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  letter-spacing: 0.6px;
}

.btn-salvar:hover:not(:disabled) {
  color: #d4e4d4;
}

.btn-salvar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
