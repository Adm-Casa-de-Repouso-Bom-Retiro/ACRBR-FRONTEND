<template>
  <div class="cadastro-page">
    <main class="main-content">
      <section class="cadastro-painel">
        <div class="cadastro-card">
          <div class="foto-coluna">
            <div
              class="avatar-wrap"
              role="button"
              tabindex="0"
              @click="abrirSeletorFoto"
              @keydown.enter="abrirSeletorFoto"
              title="Clique para adicionar foto"
            >
              <div class="avatar-circle" :class="{ 'avatar-circle--foto': fotoPrevia }">
                <img
                  :src="fotoPrevia || iconeLogin"
                  class="avatar-img"
                  :class="{ 'avatar-img--foto': fotoPrevia }"
                />
              </div>

              <div class="cam-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                  />
                  <circle cx="12" cy="13" r="4" />
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

            <span class="foto-dica">ADICIONAR FOTO</span>
          </div>

          <div class="info-coluna">
            <div class="titulo-pill">
              <span>Cadastre-se como Administrador</span>
            </div>

            <p v-if="erro" class="msg-erro">{{ erro }}</p>
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

    <div class="linha-divisoria"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import iconeLogin from '@/assets/images/icone-login.png'

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
  background: #2e5d2e;
  padding: 48px 60px 56px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Painel: mesmo tratamento de card usado no perfil do residente,
   para que todas as telas leiam como parte do mesmo sistema. */
.cadastro-painel {
  width: 100%;
  max-width: 1080px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.045);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  padding: 52px 58px;
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

.avatar-wrap {
  position: relative;
  cursor: pointer;
}

.avatar-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  border: 2px solid rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.avatar-wrap:hover .avatar-circle {
  border-color: rgba(255, 255, 255, 0.75);
}

.avatar-circle--foto {
  background: #d9d9d9;
  border-color: #ffffff;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 18px;
}

.avatar-img--foto {
  object-fit: cover;
  padding: 0;
}

.cam-btn {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 36px;
  height: 36px;
  background: #6ba13f;
  border-radius: 50%;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.avatar-wrap:hover .cam-btn {
  background: #7caf49;
}

.foto-dica {
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
}

.info-coluna {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
}

.titulo-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  background: #6ba13f;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 10px 26px;
  border-radius: 6px;
}

.msg-erro {
  color: #ffdada;
  font-size: 13px;
  margin: 0;
}

.msg-sucesso {
  color: #d9f2c2;
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
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.form-group input,
.form-group select {
  width: 100%;
  height: 38px;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 14px;
  font-family: inherit;
  color: #1e3e1e;
  background-color: #ffffff;
  outline: none;
  transition: box-shadow 0.15s ease;
}

.form-group select {
  cursor: pointer;
}

.form-group select:invalid {
  color: #6d7d70;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #8fbe4a;
  box-shadow: 0 0 0 3px rgba(143, 190, 74, 0.35);
}

.form-group input::placeholder {
  color: #8fa093;
}

.campo-obs {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
}

.btn-criar {
  background: #6ba13f;
  color: #ffffff;
  border: none;
  padding: 13px 36px;
  border-radius: 7px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.btn-criar:hover:not(:disabled) {
  background: #7caf49;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.btn-criar:disabled {
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

  .cadastro-painel {
    padding: 32px 26px;
  }

  .cadastro-card {
    flex-direction: column;
    align-items: center;
  }

  .form-grid {
    flex-direction: column;
    gap: 16px;
  }

  .form-footer {
    justify-content: center;
  }
}
</style>
