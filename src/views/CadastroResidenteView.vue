<template>
  <div class="cadastro-residente-page">
    <main class="main-content">
      <BotaoVoltar to="/prontuario" />

      <section class="cadastro-painel">
        <div class="cadastro-card">
          <div class="foto-coluna">
            <button
              type="button"
              class="foto-box"
              :class="{ 'foto-box--preenchida': fotoPreview }"
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

            <span class="foto-dica">FOTO DO RESIDENTE</span>
          </div>

          <div class="info-coluna">
            <h1 class="section-title">Cadastro de Residente</h1>

            <div class="form-grid">
              <div class="form-group campo-nome">
                <label for="nome">NOME COMPLETO:</label>
                <input id="nome" v-model="residente.nome" type="text" class="campo-input" />
              </div>

              <div class="form-group">
                <label for="nascimento">DATA DE NASCIMENTO:</label>
                <input
                  id="nascimento"
                  v-model="residente.data_nascimento"
                  type="date"
                  class="campo-input"
                />
              </div>

              <div class="form-group">
                <label for="entrada">DATA DE ENTRADA:</label>
                <input
                  id="entrada"
                  v-model="residente.data_entrada"
                  type="date"
                  class="campo-input"
                />
              </div>

              <div class="form-group">
                <label for="quarto">QUARTO:</label>
                <input id="quarto" v-model="residente.quarto" type="text" class="campo-input" />
              </div>

              <div class="form-group campo-grau">
                <span class="campo-label">GRAU DE DEPENDÊNCIA</span>

                <div class="opcoes-grau">
                  <label class="opcao-grau">
                    <input
                      v-model="residente.grau_dependencia"
                      type="radio"
                      value="grau_1"
                      name="grau"
                    />
                    <span class="marcador"></span>
                    <span class="opcao-texto">Grau 1 - Independente</span>
                  </label>

                  <label class="opcao-grau">
                    <input
                      v-model="residente.grau_dependencia"
                      type="radio"
                      value="grau_2"
                      name="grau"
                    />
                    <span class="marcador"></span>
                    <span class="opcao-texto">Grau 2 - Necessita auxílio parcial</span>
                  </label>

                  <label class="opcao-grau">
                    <input
                      v-model="residente.grau_dependencia"
                      type="radio"
                      value="grau_3"
                      name="grau"
                    />
                    <span class="marcador"></span>
                    <span class="opcao-texto">Grau 3 - Dependência total</span>
                  </label>
                </div>
              </div>

              <div class="form-group campo-observacoes">
                <label for="observacoes">OBSERVAÇÕES:</label>
                <textarea
                  id="observacoes"
                  v-model="residente.observacoes"
                  class="campo-input campo-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <p v-if="erro" class="error-message">{{ erro }}</p>

            <div class="rodape-form">
              <button class="btn-proximo" type="button" @click="proximo">
                PRÓXIMO
                <span class="seta">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useResidenteStore } from '@/stores/residente'
import BotaoVoltar from '@/components/BotaoVoltar.vue'

const router = useRouter()
const residenteStore = useResidenteStore()
const { perfil: residente, fotoArquivo, fotoPreview } = storeToRefs(residenteStore)

const erro = ref('')
const inputFoto = ref(null)

function abrirSeletorFoto() {
  inputFoto.value.click()
}

function selecionarFoto(event) {
  const arquivo = event.target.files[0]
  if (!arquivo) return

  fotoArquivo.value = arquivo
  fotoPreview.value = URL.createObjectURL(arquivo)
}

function proximo() {
  erro.value = ''

  if (!residente.value.nome.trim()) {
    erro.value = 'Informe o nome completo do residente.'
    return
  }

  router.push('/contatosresidentes')
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.cadastro-residente-page {
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.campo-nome,
.campo-observacoes {
  grid-column: 1 / -1;
}

.form-group label,
.campo-label {
  color: #1f2d1c;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.campo-input,
.campo-textarea {
  width: 100%;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 14px;
  font-family: inherit;
  color: #1f2d1c;
  outline: none;
  background: #ffffff;
  transition: border-color 0.15s ease;
}

.campo-input:focus,
.campo-textarea:focus {
  border-color: #3e7a2b;
}

.campo-textarea {
  resize: vertical;
  min-height: 64px;
}

.opcoes-grau {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  min-height: 38px;
}

.opcao-grau {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.opcao-grau input[type='radio'] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.marcador {
  width: 20px;
  height: 15px;
  border-radius: 4px;
  border: 1px solid #dde7d8;
  flex-shrink: 0;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.opcao-grau input:checked + .marcador {
  background: #3e7a2b;
  border-color: #3e7a2b;
}

.opcao-grau input:focus-visible + .marcador {
  outline: 2px solid #3e7a2b;
  outline-offset: 2px;
}

.opcao-texto {
  color: #4a5a47;
  font-size: 14px;
  white-space: nowrap;
}

.error-message {
  margin: -10px 0 0 0;
  padding: 10px 14px;
  background: #fbe9e9;
  border: 1px solid #e4b4b4;
  border-radius: 8px;
  color: #8a1f1f;
  font-size: 13px;
  font-weight: 700;
}

.rodape-form {
  display: flex;
  justify-content: flex-end;
}

.btn-proximo {
  background: #3e7a2b;
  border: none;
  color: #ffffff;
  font-family: inherit;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  padding: 12px 34px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;
}

.btn-proximo:hover {
  background: #2f5a2b;
}

.seta {
  font-size: 14px;
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
  }

  .foto-coluna {
    width: 100%;
    max-width: 260px;
  }

  .foto-box {
    width: 100%;
    height: 220px;
  }

  .info-coluna {
    width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .btn-proximo {
    width: 100%;
    justify-content: center;
  }
}
</style>
