<template>
  <div class="dados-medicos-page">
    <main class="main-content">
      <section class="dados-painel">
        <div class="card-header">
          <div class="header-left">
            <div class="avatar">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="avatar-icone"
              >
                <path
                  d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 2.1c-3.5 0-7 1.76-7 5.25V21h14v-1.65c0-3.49-3.5-5.25-7-5.25Z"
                  fill="#ffffff"
                  opacity="0.75"
                />
              </svg>
            </div>

            <div class="titulo-pill">
              <span>Dados Médicos - {{ nomeResidente }}</span>
            </div>
          </div>

          <button
            class="btn-editar"
            :class="{ 'btn-editar--cancelar': modoEdicao }"
            @click="toggleEdicao"
          >
            {{ modoEdicao ? 'CANCELAR' : 'EDITAR DADOS' }}
          </button>
        </div>

        <p v-if="erro" class="msg-erro">{{ erro }}</p>
        <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>

        <div class="form-grid">
          <div class="form-group">
            <label>CONDIÇÕES MÉDICAS:</label>
            <textarea v-model="condicoesMedicas" :disabled="!modoEdicao"></textarea>
          </div>

          <div class="form-group">
            <label>ALERGIAS:</label>
            <textarea v-model="alergias" :disabled="!modoEdicao"></textarea>
          </div>

          <div class="form-group">
            <label>OBSERVAÇÕES:</label>
            <textarea v-model="observacoes" :disabled="!modoEdicao"></textarea>
          </div>

          <div class="form-group">
            <label>PESO E ALTURA:</label>
            <textarea v-model="pesoAltura" :disabled="!modoEdicao"></textarea>
          </div>
        </div>

        <div class="medicamentos-section">
          <table class="medicamentos-table">
            <thead>
              <tr>
                <th>MEDICAMENTOS</th>
                <th>DOSAGEM</th>
                <th>HORÁRIO</th>
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
                  <template v-else>{{ med.nome || '—' }}</template>
                </td>

                <td>
                  <input
                    v-if="modoEdicao"
                    v-model="med.dosagem"
                    class="med-input"
                    placeholder="Dosagem"
                    @click.stop
                  />
                  <template v-else>{{ med.dosagem || '—' }}</template>
                </td>

                <td>
                  <input
                    v-if="modoEdicao"
                    v-model="med.horario"
                    class="med-input"
                    placeholder="Horário"
                    @click.stop
                  />
                  <template v-else>{{ med.horario || '—' }}</template>
                </td>
              </tr>
            </tbody>
          </table>

          <button
            v-if="modoEdicao"
            class="btn-adicionar"
            type="button"
            @click="adicionarMedicamento"
          >
            + ADICIONAR MEDICAMENTO
          </button>
        </div>

        <div class="form-footer" v-if="modoEdicao">
          <button class="btn-salvar" :disabled="carregando" @click="handleSalvar">
            {{ carregando ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES' }}
          </button>
        </div>
      </section>
    </main>

    <div class="linha-divisoria"></div>
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
        {
          nome: 'Cálcio + Vitamina D',
          dosagem: '1 comprimido',
          horario: '12:00h',
          selecionado: false,
        },
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

.dados-medicos-page {
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

/* Painel: mesmo tratamento de card usado no perfil do residente,
   para que as duas telas leiam como parte do mesmo sistema. */
.dados-painel {
  width: 100%;
  max-width: 1080px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.045);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  padding: 52px 58px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-icone {
  width: 24px;
  height: 24px;
}

.titulo-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #6ba13f;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 10px 26px;
  border-radius: 6px;
}

.btn-editar {
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

.btn-editar:hover {
  background: #7caf49;
  transform: translateY(-2px);
}

.btn-editar--cancelar {
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
}

.btn-editar--cancelar:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Mensagens */
.msg-erro {
  color: #ffdada;
  font-size: 13px;
  margin: 0 0 16px 0;
}

.msg-sucesso {
  color: #d9f2c2;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

/* Grid 2x2 */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 32px;
  margin-bottom: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.form-group textarea {
  width: 100%;
  min-height: 100px;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 13px;
  color: #1e3e1e;
  resize: vertical;
  outline: none;
  background: #ffffff;
  transition: box-shadow 0.15s ease;
}

.form-group textarea:disabled {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.25);
  color: #f0f0f0;
  cursor: default;
}

.form-group textarea:focus:not(:disabled) {
  border-color: #8fbe4a;
  box-shadow: 0 0 0 3px rgba(143, 190, 74, 0.35);
}

/* Tabela de medicamentos */
.medicamentos-section {
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  overflow: hidden;
}

.medicamentos-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.medicamentos-table th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: #ffffff;
  background: rgba(107, 161, 63, 0.35);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.medicamentos-table td {
  padding: 11px 16px;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.medicamentos-table tbody tr:last-child td {
  border-bottom: none;
}

.medicamentos-table tbody tr {
  cursor: pointer;
  transition: background 0.15s ease;
}

.medicamentos-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.06);
}

.checkbox-icon {
  display: inline-block;
  width: 16px;
  height: 13px;
  margin-right: 10px;
  vertical-align: middle;
  border-radius: 4px;
  border: 1px solid #78a84b;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.checkbox-icon.marcado {
  background: #8fbe4a;
  border-color: #8fbe4a;
}

.med-input {
  width: calc(100% - 26px);
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  color: #ffffff;
  font-family: inherit;
  font-size: 13px;
  padding: 2px 4px;
  outline: none;
}

.med-input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}

.med-input:focus {
  border-bottom-color: #8fbe4a;
}

/* Botão adicionar medicamento */
.btn-adicionar {
  display: block;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  font-family: inherit;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.6px;
  padding: 13px 14px;
  cursor: pointer;
  text-align: center;
  transition: background 0.2s ease;
}

.btn-adicionar:hover {
  background: rgba(143, 190, 74, 0.25);
}

/* Footer do painel */
.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 26px;
}

.btn-salvar {
  background: #6ba13f;
  border: none;
  color: #ffffff;
  font-family: inherit;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  padding: 12px 34px;
  border-radius: 7px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.btn-salvar:hover:not(:disabled) {
  background: #7caf49;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.btn-salvar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

  .dados-painel {
    padding: 32px 26px;
  }

  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-editar {
    align-self: flex-start;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .medicamentos-section {
    overflow-x: auto;
  }
}
</style>
