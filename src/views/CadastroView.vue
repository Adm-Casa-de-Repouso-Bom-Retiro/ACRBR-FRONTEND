<template>
  <div class="cadastro-page">
    <div class="top-line"></div>

    <main class="main-content">
      <div class="form-container">
        <div class="cadastro-card">
          <div class="avatar-circle">
            <img src="/src/assets/images/icone-login.png" class="avatar-img" />
          </div>

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

export default {
  name: 'CadastroView',

  data() {
    return {
      nome: '',
      telefone: '',
      cargo: '',
      senha: '',
      email: '',
      data: '',
      erro: '',
      sucesso: '',
      carregando: false,
    }
  },

  methods: {
    formatarTelefone(valor) {
      return valor.replace(/\D/g, '')
    },

    async handleCadastro() {
      this.erro = ''
      this.sucesso = ''
      this.carregando = true

      try {
        await api.post('/registro/', {
          nome: this.nome,
          telefone: this.formatarTelefone(this.telefone),
          cargo: this.cargo,
          password: this.senha,
          email: this.email,
          data_registro: this.data,
        })

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
  background: #1e3e1e;
}

.main-content {
  height: calc(100vh - 140px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.cadastro-card {
  width: 80vw;
  border: 2px solid #1e3e1e;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
}

.avatar-img {
  width: 70px;
  margin-bottom: 10px;
}

.titulo {
  color: #1e3e1e;
  font-size: 18px;
  margin-bottom: 20px;
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
  border: 1.5px solid #1e3e1e;
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
  background: #1e3e1e;
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
