<template>
  <div class="cadastro-page">
    <main class="main-content">
      <section class="cadastro-painel">
        <div class="cadastro-card">
          <div class="foto-coluna">
            <button
              type="button"
              class="foto-box"
              :class="{ 'foto-box--preenchida': fotoPrevia }"
              :style="fotoPrevia ? { backgroundImage: `url(${fotoPrevia})` } : {}"
              @click="abrirSeletorFoto"
            >
              <svg
                v-if="!fotoPrevia"
                class="icone-camera"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8a2 2 0 0 1 2-2h1.17a2 2 0 0 0 1.63-.84l.4-.57A2 2 0 0 1 10.8 3.6h2.4a2 2 0 0 1 1.6.98l.4.57A2 2 0 0 0 16.83 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
                  stroke="#3e7a2b"
                  stroke-width="1.4"
                />
                <circle cx="12" cy="13" r="3.2" stroke="#3e7a2b" stroke-width="1.4" />
              </svg>
            </button>

            <input
              ref="inputFoto"
              type="file"
              accept="image/*"
              class="input-foto-oculto"
              @change="selecionarFoto"
            />

            <span class="foto-dica">ADICIONAR FOTO</span>
          </div>

          <div class="info-coluna">
            <h1 class="section-title">Cadastre-se como Administrador</h1>

            <p v-if="erro" class="error-message">{{ erro }}</p>
            <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>

            <form @submit.prevent="handleCadastro" class="cadastro-form">
              <div class="form-grid">
                <div class="col">
                  <div class="form-group">
                    <label for="campo-nome">NOME COMPLETO:</label>
                    <input
                      id="campo-nome"
                      v-model="nome"
                      type="text"
                      placeholder="Digite seu nome"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="campo-telefone">TELEFONE:</label>
                    <input
                      id="campo-telefone"
                      v-model="telefone"
                      type="text"
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="campo-cargo">CARGO:</label>
                    <select id="campo-cargo" v-model="cargo" required>
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
                    <label for="campo-senha">SENHA:</label>
                    <input
                      id="campo-senha"
                      v-model="senha"
                      type="password"
                      placeholder="Digite sua senha"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="campo-email">E-MAIL:</label>
                    <input
                      id="campo-email"
                      v-model="email"
                      type="email"
                      placeholder="abc@gmail.com"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label for="campo-data">DATA DE REGISTRO:</label>
                    <input id="campo-data" v-model="data" type="date" required />
                    <span class="campo-obs">Data em que o funcionário foi registrado</span>
                  </div>
                </div>
              </div>

              <div class="form-footer">
                <button type="submit" class="btn-criar" :disabled="carregando">
                  {{ carregando ? 'AGUARDE...' : 'CRIAR CONTA' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const nome = ref('')
const telefone = ref('')
const cargo = ref('')
const senha = ref('')
const email = ref('')
const data = ref('')
const erro = ref('')
const sucesso = ref('')
const carregando = ref(false)
const fotoArquivo = ref(null)
const fotoPrevia = ref('')
const inputFoto = ref(null)

function formatarTelefone(valor) {
  return valor.replace(/\D/g, '')
}

function abrirSeletorFoto() {
  inputFoto.value.click()
}

function selecionarFoto(evento) {
  const arquivo = evento.target.files[0]
  if (!arquivo) return
  fotoArquivo.value = arquivo
  fotoPrevia.value = URL.createObjectURL(arquivo)
}

async function uploadFoto() {
  if (!fotoArquivo.value) return null

  const formData = new FormData()
  formData.append('file', fotoArquivo.value)
  formData.append('description', nome.value || 'foto-perfil')

  const resposta = await api.post('/media/images/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return resposta.data.attachment_key
}

async function handleCadastro() {
  erro.value = ''
  sucesso.value = ''
  carregando.value = true

  try {
    const fotoKey = await uploadFoto()

    const dadosCadastro = {
      nome: nome.value,
      telefone: formatarTelefone(telefone.value),
      cargo: cargo.value,
      password: senha.value,
      email: email.value,
      data_registro: data.value,
    }

    if (fotoKey) {
      dadosCadastro.perfil_attachment_key = fotoKey
    }

    await api.post('/registro/', dadosCadastro)

    sucesso.value = 'Conta criada com sucesso!'
    setTimeout(() => router.push('/login'), 1500)
  } catch (error) {
    if (error.response && error.response.data) {
      const erros = error.response.data
      const primeiroErro = Object.values(erros)[0]
      erro.value = Array.isArray(primeiroErro) ? primeiroErro[0] : primeiroErro
    } else {
      erro.value = 'Erro ao criar conta. Tente novamente.'
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

.cadastro-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 32px 24px 48px 24px;
}

/* Painel: card branco que agrupa o formulário de cadastro. */
.cadastro-painel {
  width: 100%;
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(47, 90, 43, 0.06);
  padding: 40px 44px;
}

.cadastro-card {
  display: flex;
  gap: 56px;
  align-items: flex-start;
}

.foto-coluna {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  flex-shrink: 0;
}

.foto-box {
  width: 260px;
  height: 290px;
  border: 1px solid #dde7d8;
  border-radius: 12px;
  background-color: #e8f1e3;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.foto-box:hover {
  border-color: #3e7a2b;
}

.foto-box--preenchida:hover {
  filter: brightness(1.08);
}

.icone-camera {
  width: 52px;
  height: 52px;
  opacity: 0.75;
}

.input-foto-oculto {
  display: none;
}

.foto-dica {
  color: #4a5a47;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
}

.info-coluna {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.section-title {
  margin: 0;
  color: #1f2d1c;
  font-size: 22px;
  font-weight: 800;
}

.error-message {
  margin: 0;
  padding: 10px 14px;
  background: #fbe9e9;
  border: 1px solid #e4b4b4;
  border-radius: 8px;
  color: #8a1f1f;
  font-size: 13px;
  font-weight: 700;
}

.msg-sucesso {
  color: #2f5a2b;
  font-size: 13px;
  font-weight: 700;
  margin: 0;
}

.form-grid {
  display: flex;
  gap: 32px;
}

.col {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #1f2d1c;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.form-group input,
.form-group select {
  width: 100%;
  height: 38px;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  font-family: inherit;
  color: #1f2d1c;
  background-color: #ffffff;
  outline: none;
  transition: border-color 0.15s ease;
}

.form-group select {
  cursor: pointer;
}

.form-group select:invalid {
  color: #6d7d70;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3e7a2b;
}

.form-group input::placeholder {
  color: #8fa093;
}

.campo-obs {
  font-size: 11px;
  color: #4a5a47;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
}

.btn-criar {
  background: #3e7a2b;
  color: #ffffff;
  border: none;
  padding: 12px 34px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-criar:hover:not(:disabled) {
  background: #2f5a2b;
}

.btn-criar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .main-content {
    padding: 20px 16px 40px 16px;
  }

  .cadastro-painel {
    padding: 28px 20px;
  }

  .cadastro-card {
    flex-direction: column;
    align-items: center;
    gap: 28px;
  }

  .foto-coluna {
    width: 100%;
    max-width: 260px;
  }

  .foto-box {
    width: 100%;
    height: 220px;
  }

  .form-grid {
    flex-direction: column;
    gap: 16px;
  }

  .form-footer {
    justify-content: center;
  }

  .btn-criar {
    width: 100%;
  }
}
</style>
