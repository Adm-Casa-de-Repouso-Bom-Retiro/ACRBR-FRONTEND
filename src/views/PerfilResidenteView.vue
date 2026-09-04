<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const router = useRouter()

// Valores serão preenchidos via API
const residente = ref(null)
const carregando = ref(false)
const erro = ref('')

// A API pode devolver datas como "AAAA-MM-DD" ou datetime ISO completo;
// fatiamos a parte da data para evitar deslocamento de fuso horário.
function formatarData(valor) {
  if (!valor) return '—'

  const [ano, mes, dia] = String(valor).slice(0, 10).split('-')

  if (!ano || !mes || !dia) return valor

  return `${dia}/${mes}/${ano}`
}

function calcularIdade(dataNascimento) {
  if (!dataNascimento) return null

  const [ano, mes, dia] = String(dataNascimento).slice(0, 10).split('-').map(Number)

  if (!ano || !mes || !dia) return null

  const hoje = new Date()
  let idade = hoje.getFullYear() - ano
  const aniversarioPassou =
    hoje.getMonth() + 1 > mes || (hoje.getMonth() + 1 === mes && hoje.getDate() >= dia)

  if (!aniversarioPassou) idade -= 1

  return idade >= 0 ? idade : null
}

// A API devolve o grau como texto ("grau_1", "grau_2", "grau_3");
// extraímos o número para tolerar também o formato numérico.
function numeroGrau(grau) {
  if (grau === null || grau === undefined) return null

  const numero = parseInt(String(grau).replace(/\D/g, ''), 10)

  return Number.isNaN(numero) ? null : numero
}

async function buscarResidente() {
  carregando.value = true
  erro.value = ''

  try {
    // TODO: ajustar endpoint quando o backend estiver pronto
    const resposta = await api.get(`/residentes/${props.id}/`)
    residente.value = resposta.data
  } catch (error) {
    erro.value = 'Erro ao carregar dados do residente.'
    residente.value = null
  } finally {
    carregando.value = false
  }
}

function irPara(nomeRota) {
  // TODO: ajustar quando as rotas de cada seção existirem
  router.push({ name: nomeRota, params: { id: props.id } })
}

onMounted(buscarResidente)
</script>

<template>
  <main class="perfil-residente">
    <p v-if="erro" class="msg-erro">{{ erro }}</p>

    <div v-if="carregando" class="msg-carregando">Carregando dados do residente...</div>

    <template v-else-if="residente">
      <section class="perfil-painel">
        <div class="perfil-conteudo">
          <div class="grupo-foto">
            <div class="perfil-foto" :class="{ 'perfil-foto--vazia': !residente.foto }">
              <img v-if="!!residente.foto" :src="residente.foto.url" class="perfil-img" />
            </div>

            <button class="btn-editar" @click="irPara('editarresidente')">EDITAR DADOS</button>
          </div>

          <div class="grupo-conteudo">
            <div class="grupo-informacoes">
              <div class="perfil-dados">
                <h1 class="residente-nome">
                  {{ residente.nome_completo }}
                </h1>

                <p class="dado-linha">
                  <strong>Nascimento:</strong>
                  {{ formatarData(residente.data_nascimento) }}
                </p>

                <p class="dado-linha">
                  <strong>Idade:</strong>
                  {{ calcularIdade(residente.data_nascimento) ?? '—' }} anos
                </p>

                <p class="dado-linha">
                  <strong>Data de Entrada:</strong>
                  {{ formatarData(residente.data_admissao) }}
                </p>

                <p class="dado-linha">
                  <strong>Quarto:</strong>
                  {{ residente.quarto }}
                </p>
              </div>

              <div class="perfil-dependencia">
                <h2 class="dependencia-titulo">Grau de Dependência:</h2>

                <div class="dependencia-item">
                  <span
                    class="dependencia-marcador"
                    :class="{ ativo: numeroGrau(residente.grau_dependencia) === 1 }"
                  ></span>

                  Grau 1 - Independente
                </div>

                <div class="dependencia-item">
                  <span
                    class="dependencia-marcador"
                    :class="{ ativo: numeroGrau(residente.grau_dependencia) === 2 }"
                  ></span>

                  Grau 2 - Necessita auxílio parcial
                </div>

                <div class="dependencia-item">
                  <span
                    class="dependencia-marcador"
                    :class="{ ativo: numeroGrau(residente.grau_dependencia) === 3 }"
                  ></span>

                  Grau 3 - Dependência total
                </div>
              </div>
            </div>

            <nav class="perfil-menu">
              <button class="btn-menu" @click="irPara('perfildadosmedicos')">DADOS MÉDICOS</button>

              <button
                class="btn-menu"
                @click="irPara('contatosprontuario', { params: { id: residente.id } })"
              >
                CONTATOS
              </button>

              <button class="btn-menu" @click="irPara('cuidadospessoais')">
                CUIDADOS PESSOAIS
              </button>

              <button class="btn-menu" @click="irPara('historico')">HISTÓRICO</button>

              <button class="btn-menu" @click="irPara('calendario')">CALENDÁRIO</button>

              <button class="btn-menu" @click="irPara('nutricao')">NUTRIÇÃO</button>
            </nav>

            <div class="observacoes-box">
              <span class="label">Observações:</span>
              <p class="observacoes-texto">{{ residente.observacoes || '—' }}</p>
            </div>
          </div>
        </div>
      </section>
    </template>

    <div class="linha-divisoria"></div>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.perfil-residente {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 24px 16px 28px;
  background: linear-gradient(160deg, #2e5d2e 0%, #3c7039 45%, #6ba13f 100%);
  position: relative;
  min-height: 0;
}

.msg-erro {
  color: #ffdada;
  font-size: 16px;
}

.msg-carregando {
  color: #ffffff;
  font-size: 18px;
  text-align: center;
}

.perfil-painel {
  width: 100%;
  max-width: 1180px;
}

.perfil-conteudo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.grupo-foto {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  width: 100%;
}

.perfil-foto {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #d9d9d9;
  overflow: hidden;
  border: 4px solid #ffffff;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
}

.perfil-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-editar {
  width: 100%;
  max-width: 260px;
  background: #ffffff;
  border: none;
  color: #2e5d2e;
  font-weight: 700;
  font-size: 13px;
  padding: 12px 0;
  border-radius: 12px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.btn-editar:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
}

.grupo-conteudo {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.grupo-informacoes {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.perfil-dados,
.perfil-dependencia,
.observacoes-box {
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
}

.perfil-dados {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.residente-nome {
  color: #2e5d2e;
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 6px 0;
  line-height: 1.15;
}

.dado-linha {
  color: #4a5f4e;
  font-size: 14px;
  font-weight: 400;
  margin: 0;
}

.dado-linha strong {
  font-weight: 700;
  color: #2e5d2e;
}

.perfil-dependencia {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dependencia-titulo {
  color: #2e5d2e;
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.dependencia-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4a5f4e;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.dependencia-marcador {
  width: 20px;
  height: 15px;
  border-radius: 4px;
  border: 1px solid #78a84b;
  flex-shrink: 0;
}

.dependencia-marcador.ativo {
  background: #8fbe4a;
  border-color: #8fbe4a;
}

.perfil-menu {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
}

.btn-menu {
  background-color: #ffffff;
  color: #2e5d2e;
  font-weight: 700;
  font-size: 13px;
  border: none;
  border-radius: 14px;
  padding: 18px 12px;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.btn-menu:hover {
  background-color: #7caf49;
  color: #ffffff;
  transform: translateY(-1px);
}

.observacoes-box {
  color: #4a5f4e;
}

.observacoes-box .label {
  display: block;
  font-weight: 700;
  color: #2e5d2e;
  margin-bottom: 8px;
}

.observacoes-texto {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  white-space: pre-line;
}

.linha-divisoria {
  height: 8px;
  background: #ffffff;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}

@media (min-width: 768px) {
  .perfil-residente {
    align-items: center;
    justify-content: center;
    padding: 60px 70px 68px 70px;
    background: #2e5d2e;
  }

  .perfil-painel {
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.045);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
    padding: 56px 64px;
  }

  .perfil-conteudo {
    flex-direction: row;
    gap: 70px;
    align-items: flex-start;
  }

  .grupo-foto {
    gap: 24px;
    max-width: 260px;
  }

  .perfil-foto {
    width: 260px;
    height: 290px;
    border-radius: 14px;
    border: none;
    box-shadow: none;
  }

  .btn-editar {
    max-width: none;
    background: #ffffff;
    color: #2e5d2e;
    border-radius: 7px;
    font-weight: 600;
  }

  .grupo-conteudo {
    gap: 40px;
  }

  .grupo-informacoes {
    flex-direction: row;
    gap: 80px;
    align-items: flex-start;
  }

  .perfil-dados {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 5px 0 0;
    text-align: left;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }

  .residente-nome {
    color: #ffffff;
    font-size: 28px;
    font-weight: 600;
  }

  .dado-linha {
    color: #ffffff;
    font-size: 16px;
  }

  .dado-linha strong {
    font-weight: 600;
    color: #ffffff;
  }

  .perfil-dependencia {
    gap: 13px;
    padding-top: 46px;
    flex-shrink: 0;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }

  .dependencia-titulo {
    color: #ffffff;
    font-size: 17px;
    font-weight: 600;
  }

  .dependencia-item {
    color: #ffffff;
    font-size: 15px;
  }

  .perfil-menu {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 18px;
  }

  .btn-menu {
    background-color: #72a840;
    color: #ffffff;
    font-weight: 600;
    font-size: 13px;
    border-radius: 8px;
    padding: 14px 12px;
    box-shadow: none;
  }

  .btn-menu:hover {
    background-color: #7caf49;
  }

  .observacoes-box {
    border: 1.5px solid #ffffff;
    border-radius: 8px;
    padding: 16px 20px;
    min-height: 110px;
    color: #ffffff;
    background: transparent;
    box-shadow: none;
  }

  .observacoes-box .label {
    color: #ffffff;
  }

  .observacoes-texto {
    color: #f0f0f0;
  }
}
</style>
