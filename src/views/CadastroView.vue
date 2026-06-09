<template>
  <div class="cadastro-page">
    <div class="top-line"></div>

    <main class="main-content">
      <div class="form-container">
        <div class="cadastro-card">

          <div class="avatar-wrap" @click="abrirSeletorFoto" title="Clique para adicionar foto">
            <div class="avatar-circle" :class="{ 'avatar-circle--foto': fotoPrevia }">
              <img :src="fotoPrevia || iconeLogin" class="avatar-img" :class="{ 'avatar-img--foto': fotoPrevia }" />
            </div>
            <div class="cam-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          </div>

          <input
            ref="inputFoto"
            type="file"
            accept="image/jpeg,image/png"
            style="display: none"
            @change="selecionarFoto"
          />

          <h2 class="titulo">CADASTRE-SE COMO ADMINISTRADOR:</h2>

          <p v-if="erro" class="msg-erro">{{ erro }}</p>
          <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>

          <form @submit.prevent="handleCadastro" class="cadastro-form">
            <div class="form-grid">
              <div class="col">
                <div class="form-group">
                  <label>NOME COMPLETO:</label>
                  <input v-model="nome" type="text" placeholder="Digite seu nome" required />
                </div>

                <div class="form-group">
                  <label>TELEFONE:</label>
                  <input v-model="telefone" type="text" placeholder="(00) 00000-0000" required />
                </div>

                <div class="form-group">
                  <label>CARGO:</label>
                  <select v-model="cargo" required>
                    <option value="" disabled>Selecione</option>
                    <option value="chefe">Chefe</option>
                    <option value="gerente">Gerente</option>
                    <option value="nutricionista">Nutricionista</option>
                    <option value="cuidador">Cuidador</option>
                  </select>
                </div>
              </div>

              <div class="col">
                <div class="form-group">
                  <label>SENHA:</label>
                  <input v-model="senha" type="password" placeholder="Digite sua senha" required />
                </div>

                <div class="form-group">
                  <label>E-MAIL:</label>
                  <input v-model="email" type="email" placeholder="abc@gmail.com" required />
                </div>

                <div class="form-group">
                  <label>DATA DE REGISTRO:</label>
                  <input v-model="data" type="date" required />
                  <span class="campo-obs">Data em que o funcionário foi registrado</span>
                </div>
              </div>
            </div>

            <button type="submit" class="btn-criar" :disabled="carregando">
              {{ carregando ? 'AGUARDE...' : 'CRIAR CONTA' }}
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import api from '@/services/api'
import iconeLogin from '@/assets/images/icone-login.png'

export default {
  name: 'CadastroView',

  data() {
    return {
      iconeLogin,
      nome: '',
      telefone: '',
      cargo: '',
      senha: '',
      email: '',
      data: '',
      erro: '',
      sucesso: '',
      carregando: false,
      fotoArquivo: null,
      fotoPrevia: '',
    }
  },

  methods: {
    formatarTelefone(valor) {
      return valor.replace(/\D/g, '')
    },

    abrirSeletorFoto() {
      this.$refs.inputFoto.click()
    },

    selecionarFoto(evento) {
      const arquivo = evento.target.files[0]
      if (!arquivo) return
      this.fotoArquivo = arquivo
      this.fotoPrevia = URL.createObjectURL(arquivo)
    },

    async uploadFoto() {
      if (!this.fotoArquivo) return null

      const formData = new FormData()
      formData.append('file', this.fotoArquivo)
      formData.append('description', this.nome || 'foto-perfil')

      const resposta = await api.post('/media/images/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return resposta.data.attachment_key
    },

    async handleCadastro() {
      this.erro = ''
      this.sucesso = ''
      this.carregando = true

      try {
        const fotoKey = await this.uploadFoto()

        const dadosCadastro = {
          nome: this.nome,
          telefone: this.formatarTelefone(this.telefone),
          cargo: this.cargo,
          password: this.senha,
          email: this.email,
          data_registro: this.data,
        }

        if (fotoKey) {
          dadosCadastro.perfil_attachment_key = fotoKey
        }

        await api.post('/registro/', dadosCadastro)

        this.sucesso = 'Conta criada com sucesso!'
        setTimeout(() => this.$router.push('/login'), 1500)
      } catch (error) {
        if (error.response && error.response.data) {
          const erros = error.response.data
          const primeiroErro = Object.values(erros)[0]
          this.erro = Array.isArray(primeiroErro) ? primeiroErro[0] : primeiroErro
        } else {
          this.erro = 'Erro ao criar conta. Tente novamente.'
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
  height: calc(100vh - 140px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.cadastro-card {
  width: 80vw;
  border: 2px solid #2e5d2e;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
}

.avatar-wrap {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-bottom: 10px;
}

.avatar-circle {
  width: 105px;
  height: 105px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-circle--foto {
  overflow: hidden;
  border: 2px solid #2e5d2e;
}

.avatar-img {
  width: 105px;
  height: 105px;
  object-fit: contain;
}

.avatar-img--foto {
  object-fit: cover;
}

.cam-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 34px;
  height: 34px;
  background: #2e5d2e;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.avatar-wrap:hover .cam-btn {
  background: #1e3e1e;
}

.titulo {
  color: #2e5d2e;
  font-size: 18px;
  margin-bottom: 20px;
}

.msg-erro {
  color: #c0392b;
  font-size: 13px;
  margin-bottom: 10px;
}

.msg-sucesso {
  color: #2e5d2e;
  font-size: 13px;
  margin-bottom: 10px;
  font-weight: bold;
}

.form-grid {
  display: flex;
  gap: 40px;
}

.col {
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 12px;
}

.form-group label {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #ffffff;
}

.form-group input,
.form-group select {
  width: 100%;
  height: 30px;
  border: 1.5px solid #2e5d2e;
  border-radius: 4px;
  padding: 0 8px;
  font-size: 13px;
  color: #1e3e1e;
  background-color: #ffffff;
}

.form-group input::placeholder {
  color: #1e3e1e;
}

.campo-obs {
  font-size: 10px;
  color: #888;
  margin-top: 2px;
}

.btn-criar {
  margin-top: 15px;
  background: #2e5d2e;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.btn-criar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-criar:hover:not(:disabled) {
  background: #163216;
}
</style>