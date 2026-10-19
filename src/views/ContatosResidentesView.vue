<template>
  <div class="contatos-page">
    <main class="main-content">
      <section class="contatos-painel">
        <h1 class="section-title">CONTATOS</h1>

        <p v-if="erro" class="error-message">{{ erro }}</p>
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
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 32px 24px 48px 24px;
}

/* Painel: card branco que agrupa os dados de contato. */
.contatos-painel {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(47, 90, 43, 0.06);
  padding: 40px 44px;
}

.section-title {
  margin: 0 0 24px 0;
  color: #1f2d1c;
  font-size: 22px;
  font-weight: 800;
}

.titulo-icone {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.error-message {
  margin: 0 0 16px 0;
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
  margin: 0 0 16px 0;
}

.bloco-responsavel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bloco-titulo {
  color: #4a5a47;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.linha-campos {
  display: flex;
  gap: 24px;
}

.form-group {
  flex: 1;
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
  font-family: inherit;
  font-size: 14px;
  color: #1f2d1c;
  background: #ffffff;
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

.campo-parentesco {
  max-width: 320px;
}

.divisoria {
  height: 1px;
  background: #dde7d8;
  margin: 24px 0;
}

.form-footer {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.btn-adicionar {
  background: #3e7a2b;
  color: #ffffff;
  border: none;
  padding: 12px 34px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-adicionar:hover:not(:disabled) {
  background: #2f5a2b;
}

.btn-adicionar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .main-content {
    padding: 20px 16px 40px 16px;
  }

  .contatos-painel {
    padding: 28px 20px;
  }

  .linha-campos {
    flex-direction: column;
    gap: 14px;
  }

  .campo-parentesco {
    max-width: none;
  }

  .btn-adicionar {
    width: 100%;
  }
}
</style>
