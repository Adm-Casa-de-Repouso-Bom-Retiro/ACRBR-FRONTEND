<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const residente = ref(null)
const carregando = ref(false)
const erro = ref('')

const mapaParentesco = {
  pai: 'Pai',
  mae: 'Mãe',
  filho: 'Filho(a)',
  irmao: 'Irmão(ã)',
  neto: 'Neto(a)',
  conjuge: 'Cônjuge',
  outro: 'Outro',
}

function formatarTelefone(telefone) {
  const tel = (telefone || '').replace(/\D/g, '')

  if (tel.length === 11) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`
  }

  if (tel.length === 10) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`
  }

  return telefone || '—'
}

function formatarParentesco(valor) {
  return mapaParentesco[valor] || valor || '—'
}

const fotoUrl = computed(() => residente.value?.foto?.url || '')

const temResponsavelSecundario = computed(
  () => !!(residente.value?.nome_responsavel_2 || residente.value?.telefone_responsavel_2),
)

async function buscarResidente() {
  carregando.value = true
  erro.value = ''

  try {
    // TODO: ajustar endpoint quando o backend estiver pronto
    const resposta = await api.get(`/residentes/${route.params.id}/`)
    residente.value = resposta.data
  } catch (error) {
    erro.value = 'Erro ao carregar os dados do residente. Tente novamente.'
    residente.value = null
  } finally {
    carregando.value = false
  }
}

function editarDados() {
  // TODO: ajustar rota quando a tela de edição de contatos existir
  router.push('/contatosresidentes')
}

onMounted(buscarResidente)
</script>

<template>
  <div class="contatos-prontuario-page">
    <main class="main-content">
      <p v-if="erro" class="msg-erro">{{ erro }}</p>

      <div v-if="carregando" class="msg-carregando">Carregando dados do residente...</div>

      <section v-else-if="residente" class="contatos-painel">
        <div class="contatos-card">
          <div class="foto-coluna">
            <div class="foto-box" :style="fotoUrl ? { backgroundImage: `url(${fotoUrl})` } : {}">
              <svg
                v-if="!fotoUrl"
                class="icone-foto-vazia"
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
            </div>

            <button class="btn-editar" type="button" @click="editarDados">EDITAR DADOS</button>
          </div>

          <div class="info-coluna">
            <div class="titulo-pill">
              <span>Contatos - {{ residente.nome_completo }}</span>
            </div>

            <div class="bloco-responsavel">
              <p class="linha-info">
                <span class="label">Responsável:</span>
                <span class="valor">{{ residente.nome_responsavel || '—' }}</span>
              </p>

              <div class="linha-dupla">
                <p class="linha-info">
                  <span class="label">Grau de Parentesco:</span>
                  <span class="valor">{{ formatarParentesco(residente.parentesco) }}</span>
                </p>

                <p class="linha-info">
                  <span class="label">Telefone:</span>
                  <span class="valor">{{ formatarTelefone(residente.telefone_responsavel) }}</span>
                </p>
              </div>
            </div>

            <template v-if="temResponsavelSecundario">
              <div class="divisoria"></div>

              <div class="bloco-responsavel">
                <p class="linha-info">
                  <span class="label">Responsável Secundário:</span>
                  <span class="valor">{{ residente.nome_responsavel_2 || '—' }}</span>
                </p>

                <div class="linha-dupla">
                  <p class="linha-info">
                    <span class="label">Grau de Parentesco:</span>
                    <span class="valor">{{ formatarParentesco(residente.parentesco_2) }}</span>
                  </p>

                  <p class="linha-info">
                    <span class="label">Telefone:</span>
                    <span class="valor">{{
                      formatarTelefone(residente.telefone_responsavel_2)
                    }}</span>
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>
    </main>

    <div class="linha-divisoria"></div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.contatos-prontuario-page {
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

.msg-erro {
  color: #ffdada;
  font-size: 13px;
  margin-bottom: 16px;
}

.msg-carregando {
  color: #ffffff;
  font-size: 14px;
  text-align: center;
}

/* Painel: mesmo tratamento de card usado no perfil do residente,
   para que as duas telas leiam como parte do mesmo sistema. */
.contatos-painel {
  width: 100%;
  max-width: 1080px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.045);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  padding: 52px 58px;
}

.contatos-card {
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
  border-radius: 10px;
  background-color: #d9d9d9;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icone-foto-vazia {
  width: 52px;
  height: 52px;
  opacity: 0.6;
}

.btn-editar {
  width: 100%;
  background: #6ba13f;
  color: #ffffff;
  border: none;
  padding: 12px 0;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.btn-editar:hover {
  background: #7caf49;
  transform: translateY(-2px);
}

.info-coluna {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 26px;
  min-width: 0;
}

.titulo-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  background: #6ba13f;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 10px 26px;
  border-radius: 6px;
}

.bloco-responsavel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.linha-info {
  color: #ffffff;
  font-size: 15px;
  margin: 0;
}

.label {
  font-weight: 700;
  margin-right: 6px;
}

.valor {
  font-weight: 400;
}

.linha-dupla {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 70px;
}

.divisoria {
  height: 1px;
  background: rgba(255, 255, 255, 0.4);
  margin: 4px 0;
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

  .contatos-painel {
    padding: 32px 26px;
  }

  .contatos-card {
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

  .linha-dupla {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
