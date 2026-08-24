<template>
  <div class="cadastro-residente-page">
    <main class="main-content">
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
                  stroke="#ffffff"
                  stroke-width="1.4"
                />
                <circle cx="12" cy="13" r="3.2" stroke="#ffffff" stroke-width="1.4" />
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
            <div class="titulo-pill">
              <span>Cadastro de Residente</span>
            </div>

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

            <p v-if="erro" class="mensagem-erro">{{ erro }}</p>

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

    <div class="linha-divisoria"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useResidenteStore } from '@/stores/residente'

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
  background: #2e5d2e;
  padding: 48px 60px 56px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Painel: mesmo tratamento de card usado no perfil do residente,
   para que as duas telas leiam como parte do mesmo sistema. */
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

.foto-box {
  width: 260px;
  height: 290px;
  border: none;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.14);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.foto-box:hover {
  background-color: rgba(255, 255, 255, 0.22);
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
  color: rgba(255, 255, 255, 0.85);
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
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.campo-input,
.campo-textarea {
  width: 100%;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 9px 12px;
  font-size: 14px;
  font-family: inherit;
  color: #1e3e1e;
  outline: none;
  background: #ffffff;
  transition: box-shadow 0.15s ease;
}

.campo-input:focus,
.campo-textarea:focus {
  border-color: #8fbe4a;
  box-shadow: 0 0 0 3px rgba(143, 190, 74, 0.35);
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
  border: 1px solid #78a84b;
  flex-shrink: 0;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}

.opcao-grau input:checked + .marcador {
  background: #8fbe4a;
  border-color: #8fbe4a;
}

.opcao-grau input:focus-visible + .marcador {
  outline: 2px solid rgba(143, 190, 74, 0.7);
  outline-offset: 2px;
}

.opcao-texto {
  color: #ffffff;
  font-size: 14px;
  white-space: nowrap;
}

.mensagem-erro {
  color: #ffdada;
  font-size: 13px;
  margin: -10px 0 0 0;
}

.rodape-form {
  display: flex;
  justify-content: flex-end;
}

.btn-proximo {
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
  display: flex;
  align-items: center;
  gap: 8px;
  transition:
    background 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.btn-proximo:hover {
  background: #7caf49;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.seta {
  font-size: 14px;
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
}
</style>
