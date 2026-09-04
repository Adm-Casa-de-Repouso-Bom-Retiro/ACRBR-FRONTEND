<template>
  <div class="contatos-page">
    <main class="main-content">
      <section class="contatos-painel">
        <div class="titulo-pill">
          <span>CONTATOS</span>
        </div>

        <p v-if="erro" class="msg-erro">{{ erro }}</p>
        <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>

        <form @submit.prevent="handleSubmit" class="contatos-form">
          <div class="bloco-responsavel">
            <span class="bloco-titulo">RESPONSÁVEL 1</span>

            <div class="linha-campos">
              <div class="form-group">
                <label for="responsavel-1">NOME COMPLETO:</label>
                <input
                  id="responsavel-1"
                  v-model="responsavel1"
                  type="text"
                  placeholder="Digite o nome do responsável"
                  required
                />
              </div>

              <div class="form-group">
                <label for="telefone-1">TELEFONE:</label>
                <input
                  id="telefone-1"
                  v-model="telefone1"
                  type="text"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
            </div>

            <div class="form-group campo-parentesco">
              <label for="grau-1">GRAU DE PARENTESCO:</label>
              <select id="grau-1" v-model="grauParentesco1" required>
                <option value="" disabled>Selecione</option>
                <option value="pai">Pai</option>
                <option value="mae">Mãe</option>
                <option value="filho">Filho(a)</option>
                <option value="irmao">Irmão(ã)</option>
                <option value="neto">Neto(a)</option>
                <option value="conjuge">Cônjuge</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div class="divisoria"></div>

          <div class="bloco-responsavel">
            <span class="bloco-titulo">RESPONSÁVEL 2 (OPCIONAL)</span>

            <div class="linha-campos">
              <div class="form-group">
                <label for="responsavel-2">NOME COMPLETO:</label>
                <input
                  id="responsavel-2"
                  v-model="responsavel2"
                  type="text"
                  placeholder="Digite o nome do responsável"
                />
              </div>

              <div class="form-group">
                <label for="telefone-2">TELEFONE:</label>
                <input
                  id="telefone-2"
                  v-model="telefone2"
                  type="text"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div class="form-group campo-parentesco">
              <label for="grau-2">GRAU DE PARENTESCO:</label>
              <select id="grau-2" v-model="grauParentesco2">
                <option value="" disabled>Selecione</option>
                <option value="pai">Pai</option>
                <option value="mae">Mãe</option>
                <option value="filho">Filho(a)</option>
                <option value="irmao">Irmão(ã)</option>
                <option value="neto">Neto(a)</option>
                <option value="conjuge">Cônjuge</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div class="form-footer">
            <button type="submit" class="btn-adicionar" :disabled="carregando">
              {{ carregando ? 'AGUARDE...' : 'ADICIONAR RESIDENTE' }}
            </button>
          </div>
        </form>
      </section>
    </main>

    <div class="linha-divisoria"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import api from '@/services/api'
import { useResidenteStore } from '@/stores/residente'

const router = useRouter()

const residenteStore = useResidenteStore()
const {
  perfil,
  responsavel1,
  telefone1,
  grauParentesco1,
  responsavel2,
  telefone2,
  grauParentesco2,
} = storeToRefs(residenteStore)

const erro = ref('')
const sucesso = ref('')
const carregando = ref(false)

function formatarTelefone(valor) {
  return valor.replace(/\D/g, '')
}

async function uploadFoto() {
  if (!residenteStore.fotoArquivo) return null

  const formData = new FormData()
  formData.append('file', residenteStore.fotoArquivo)
  formData.append('description', perfil.value.nome || 'foto-residente')

  const resposta = await api.post('/media/images/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return resposta.data.attachment_key
}

async function handleSubmit() {
  erro.value = ''
  sucesso.value = ''

  if (!perfil.value.nome.trim()) {
    erro.value = 'Preencha os dados do residente na primeira etapa.'
    return
  }

  carregando.value = true

  try {
    const fotoKey = await uploadFoto()

    const dadosResidente = {
      nome_completo: perfil.value.nome,
      data_nascimento: perfil.value.data_nascimento || null,
      quarto: perfil.value.quarto,
      grau_dependencia: perfil.value.grau_dependencia,
      observacoes: perfil.value.observacoes,
      nome_responsavel: responsavel1.value,
      telefone_responsavel: formatarTelefone(telefone1.value),
      parentesco: grauParentesco1.value,
      nome_responsavel_2: responsavel2.value,
      telefone_responsavel_2: formatarTelefone(telefone2.value),
      parentesco_2: grauParentesco2.value,
    }

    if (perfil.value.data_entrada) {
      dadosResidente.data_admissao = perfil.value.data_entrada
    }

    if (fotoKey) {
      dadosResidente.foto_attachment_key = fotoKey
    }

    await api.post('/residentes/', dadosResidente)

    sucesso.value = 'Residente cadastrado com sucesso!'
    residenteStore.limpar()
    setTimeout(() => router.push('/prontuario'), 1500)
  } catch (error) {
    if (error.response && error.response.data) {
      const erros = error.response.data
      const primeiroErro = Object.values(erros)[0]
      erro.value = Array.isArray(primeiroErro) ? primeiroErro[0] : primeiroErro
    } else {
      erro.value = 'Erro ao cadastrar o residente. Tente novamente.'
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

.contatos-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: linear-gradient(160deg, #2e5d2e 0%, #3c7039 45%, #6ba13f 100%);
  padding: 28px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contatos-painel {
  width: 100%;
  max-width: 1080px;
}

.titulo-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  background: #ffffff;
  color: #2e5d2e;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 8px 20px;
  border-radius: 999px;
  margin-bottom: 20px;
}

.titulo-icone {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(35%) sepia(24%) saturate(1200%) hue-rotate(70deg);
}

.msg-erro {
  color: #c0392b;
  font-size: 13px;
  margin: 0 0 16px 0;
}

.msg-sucesso {
  color: #2e5d2e;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.contatos-form {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
  padding: 20px 18px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
}

.bloco-responsavel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bloco-titulo {
  color: #6ba13f;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.linha-campos {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  color: #2e5d2e;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.form-group input,
.form-group select {
  width: 100%;
  height: 46px;
  border: 1.5px solid #d9d9d9;
  border-radius: 12px;
  padding: 0 14px;
  font-family: inherit;
  font-size: 14px;
  color: #1e3e1e;
  background: #ffffff;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
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
  box-shadow: 0 0 0 3px rgba(143, 190, 74, 0.25);
}

.form-group input::placeholder {
  color: #8fa093;
}

.campo-parentesco {
  max-width: none;
}

.divisoria {
  height: 1px;
  background: #e2e8e0;
  margin: 22px 0;
}

.form-footer {
  display: flex;
  justify-content: center;
  margin-top: 26px;
}

.btn-adicionar {
  width: 100%;
  background: #6ba13f;
  color: #ffffff;
  border: none;
  padding: 14px 0;
  border-radius: 12px;
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

.btn-adicionar:hover:not(:disabled) {
  background: #7caf49;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.btn-adicionar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.linha-divisoria {
  height: 8px;
  background: #ffffff;
  width: 100%;
}

@media (min-width: 768px) {
  .main-content {
    background: #2e5d2e;
    padding: 48px 60px 56px 60px;
  }

  .contatos-painel {
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.045);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
    padding: 52px 58px;
  }

  .titulo-pill {
    background: #6ba13f;
    color: #ffffff;
    font-size: 17px;
    padding: 10px 26px;
    border-radius: 6px;
  }

  .titulo-icone {
    filter: brightness(0) invert(1);
  }

  .msg-erro {
    color: #ffdada;
  }

  .msg-sucesso {
    color: #d9f2c2;
  }

  .contatos-form {
    background: transparent;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
  }

  .bloco-titulo {
    color: rgba(255, 255, 255, 0.85);
  }

  .linha-campos {
    flex-direction: row;
    gap: 24px;
  }

  .form-group label {
    color: #ffffff;
    font-size: 12px;
  }

  .form-group input,
  .form-group select {
    height: 38px;
    border: 1px solid transparent;
    border-radius: 6px;
    padding: 0 12px;
  }

  .campo-parentesco {
    max-width: 320px;
  }

  .divisoria {
    background: rgba(255, 255, 255, 0.4);
    margin: 26px 0;
  }

  .btn-adicionar {
    width: auto;
    padding: 13px 40px;
    border-radius: 7px;
  }
}
</style>
