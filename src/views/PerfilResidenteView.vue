<script>
import api from '@/services/api'

export default {
  name: 'CadastroResidenteView',

  data() {
    return {
      residente: {
        nome: '',
        data_nascimento: '',
        data_entrada: '',
        quarto: '',
        grau_dependencia: 'grau1',
        observacoes: '',
      },
      fotoArquivo: null,
      fotoPreview: null,
      enviando: false,
      erro: '',
    }
  },

  methods: {
    abrirSeletorFoto() {
      this.$refs.inputFoto.click()
    },

    selecionarFoto(event) {
      const arquivo = event.target.files[0]
      if (!arquivo) return

      this.fotoArquivo = arquivo
      this.fotoPreview = URL.createObjectURL(arquivo)
    },

    async proximo() {
      this.erro = ''

      if (!this.residente.nome.trim()) {
        this.erro = 'Informe o nome completo do residente.'
        return
      }

      const formData = new FormData()
      formData.append('nome', this.residente.nome)
      formData.append('data_nascimento', this.residente.data_nascimento)
      formData.append('data_entrada', this.residente.data_entrada)
      formData.append('quarto', this.residente.quarto)
      formData.append('grau_dependencia', this.residente.grau_dependencia)
      formData.append('observacoes', this.residente.observacoes)
      if (this.fotoArquivo) {
        formData.append('foto', this.fotoArquivo)
      }

      this.enviando = true
      try {
        const response = await api.post('/residentes/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        this.$router.push(`/cadastro-residente/${response.data.id}/proximo`)
      } catch (error) {
        this.erro = 'Não foi possível salvar o residente. Tente novamente.'
      } finally {
        this.enviando = false
      }
    },
  },

  beforeUnmount() {
    if (this.fotoPreview) {
      URL.revokeObjectURL(this.fotoPreview)
    }
  },
}
</script>

<template>
  <div class="cadastro-page">
    <div class="top-line"></div>

    <main class="main-content">
      <div class="cadastro-card">
        <div class="foto-section">
          <button
            type="button"
            class="foto-upload"
            :style="fotoPreview ? { backgroundImage: `url(${fotoPreview})` } : {}"
            @click="abrirSeletorFoto"
          >
            <svg
              v-if="!fotoPreview"
              class="icone-camera"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 8a2 2 0 0 1 2-2h1.17a2 2 0 0 0 1.63-.84l.4-.57A2 2 0 0 1 10.8 3.6h2.4a2 2 0 0 1 1.6.98l.4.57A2 2 0 0 0 16.83 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
                stroke="white"
                stroke-width="1.6"
              />
              <circle cx="12" cy="13" r="3.2" stroke="white" stroke-width="1.6" />
            </svg>
          </button>

          <input
            ref="inputFoto"
            type="file"
            accept="image/*"
            class="input-foto-oculto"
            @change="selecionarFoto"
          />
        </div>

        <div class="form-section">
          <div class="campo">
            <label class="campo-label" for="nome">NOME COMPLETO:</label>
            <input id="nome" v-model="residente.nome" type="text" class="campo-input" />
          </div>

          <div class="campo">
            <label class="campo-label" for="nascimento">DATA DE NASCIMENTO:</label>
            <input
              id="nascimento"
              v-model="residente.data_nascimento"
              type="date"
              class="campo-input campo-data"
            />
          </div>

          <div class="campo">
            <label class="campo-label" for="entrada">DATA DE ENTRADA:</label>
            <input
              id="entrada"
              v-model="residente.data_entrada"
              type="date"
              class="campo-input campo-data"
            />
          </div>

          <div class="campo">
            <label class="campo-label" for="quarto">QUARTO:</label>
            <input id="quarto" v-model="residente.quarto" type="text" class="campo-input campo-quarto" />
          </div>

          <div class="campo">
            <span class="campo-label">GRAU DE DEPENDÊNCIA</span>

            <div class="opcoes-grau">
              <label class="opcao-grau">
                <input v-model="residente.grau_dependencia" type="radio" value="grau1" name="grau" />
                <span>Grau 1 - Independente</span>
              </label>

              <label class="opcao-grau">
                <input v-model="residente.grau_dependencia" type="radio" value="grau2" name="grau" />
                <span>Grau 2 - Necessita auxílio parcial</span>
              </label>

              <label class="opcao-grau">
                <input v-model="residente.grau_dependencia" type="radio" value="grau3" name="grau" />
                <span>Grau 3 - Dependência total</span>
              </label>
            </div>
          </div>

          <div class="campo">
            <label class="campo-label" for="observacoes">OBSERVAÇÕES:</label>
            <textarea
              id="observacoes"
              v-model="residente.observacoes"
              class="campo-textarea"
              rows="3"
            ></textarea>
          </div>

          <p v-if="erro" class="mensagem-erro">{{ erro }}</p>

          <div class="rodape-form">
            <button class="btn-proximo" :disabled="enviando" @click="proximo">
              {{ enviando ? 'SALVANDO...' : 'PRÓXIMO' }}
              <span class="seta">→</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.top-line {
  width: 100%;
  height: 10px;
  background: #2e5d2e;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 36px 20px;
}

.cadastro-card {
  width: 400%;
  max-width: 800px;
  min-height: 340px;

  border: 2px solid #8fd14f;
  border-radius: 12px;

  padding: 24px 30px;

  display: flex;
  gap: 28px;
  align-items: flex-start;
}

.foto-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.foto-upload {
  width: 200px;
  height: 180px;
  border: none;
  border-radius: 12px;
  background-color: #2e5d2e;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;
  margin-top: 8vw;
}

.foto-upload:hover {
  background-color: #264e26;
}

.icone-camera {
  width: 44px;
  height: 44px;
}

.input-foto-oculto {
  display: none;
}

.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.campo-label {
  font-size: 12px;
  font-weight: 700;
  color: #1e3e1e;
  letter-spacing: 0.35px;
}

.campo-input,
.campo-textarea {
  border: 1.2px solid #1e3e1e;
  border-radius: 5px;
  padding: 6px 10px;
  font-size: 13px;
  color: #333;
  font-family: inherit;
  outline: none;
  background: white;
}

.campo-input:focus,
.campo-textarea:focus {
  border-color: #3a7d44;
}

.campo-data {
  max-width: 180px;
}

.campo-quarto {
  max-width: 130px;
}

.campo-textarea {
  resize: vertical;
  min-height: 50px;
}

.opcoes-grau {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 2px;
}

.opcao-grau {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #333;
  cursor: pointer;
}

.opcao-grau input[type='radio'] {
  width: 14px;
  height: 14px;
  accent-color: #3a7d44;
  cursor: pointer;
}

.mensagem-erro {
  color: #b3261e;
  font-size: 12px;
  margin: 0;
}

.rodape-form {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
}

.btn-proximo {
  background: transparent;
  border: none;
  color: #3a7d44;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.35px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 3px;
  transition: color 0.2s, transform 0.2s;
}

.btn-proximo:hover:not(:disabled) {
  color: #1e3e1e;
  transform: translateX(2px);
}

.btn-proximo:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.seta {
  font-size: 14px;
}

@media (max-width: 768px) {
  .cadastro-card {
    max-width: 95vw;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px 22px;
  }

  .form-section {
    width: 100%;
  }
}
</style>