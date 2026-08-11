<template>
  <div class="contatos-page">
    <div class="top-line"></div>

    <main class="main-content">
      <div class="contatos-card">
        <div class="card-titulo">
          <img
            src="/src/assets/images/icone-telefone.png"
            alt="Ícone de telefone"
            class="titulo-icone"
          />
          <span>Contatos</span>
        </div>

        <p v-if="erro" class="msg-erro">{{ erro }}</p>
        <p v-if="sucesso" class="msg-sucesso">{{ sucesso }}</p>

        <form @submit.prevent="handleSubmit" class="contatos-form">
          <div class="responsavel">
            <div class="linha-campos">
              <div class="form-group">
                <label for="responsavel-1">RESPONSÁVEL 1:</label>
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

            <div class="form-group">
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

          <div class="linha-divisoria"></div>

          <div class="responsavel">
            <div class="linha-campos">
              <div class="form-group">
                <label for="responsavel-2">RESPONSÁVEL 2:</label>
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

            <div class="form-group">
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
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import api from '@/services/api'
import { useResidenteStore } from '@/stores/residente'

const residenteStore = useResidenteStore()
const { perfil, responsavel1, telefone1, grauParentesco1, responsavel2, telefone2, grauParentesco2 } =
  storeToRefs(residenteStore)

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

.top-line {
  width: 100%;
  height: 1.3vw;
  background: #2e5d2e;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
}

.contatos-card {
  width: 100%;
  max-width: 70vw;
  background: #ffffff;
  border: 2px solid #3a7d44;
  border-radius: 12px;
  padding: 28px 36px 24px 36px;
}

.card-titulo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #3a7d44;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 8px 20px;
  border-radius: 30px;
  margin-bottom: 28px;
}

.titulo-icone {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.linha-campos {
  display: flex;
  gap: 24px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  
}

.form-group label {
  font-size: 12px;
  font-weight: 700;
  color: #1e3e1e;
  letter-spacing: 0.4px;
  padding: 10px 0 10px 0;
  font-size: 1rem;

}

.form-group input,
.form-group select {
  width: 100%;
  height: 32px;
  border: 1.2px solid #1e3e1e;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 13px;
  color: #333333;
  background: #ffffff;
  outline: none;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3a7d44;
}

.form-group input::placeholder {
  color: #9aa8a0;
}

.linha-divisoria {
  height: 2px;
  background: #3a7d44;
  margin: 24px 0;
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

.form-footer {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

.btn-adicionar {
  background: #2e5d2e;
  color: #ffffff;
  border: none;
  padding: 12px 36px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s ease;
}

.btn-adicionar:hover {
  background: #1e3e1e;
}

.btn-adicionar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .contatos-card {
    max-width: 95vw;
    padding: 20px 22px;
  }

  .linha-campos {
    flex-direction: column;
    gap: 12px;
  }

  .form-group + .form-group {
    margin-top: 12px;
  }
}
</style>
