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
    <div class="perfil-corpo">
      <p v-if="erro" class="error-message">{{ erro }}</p>

      <div v-if="carregando" class="loading-message">Carregando dados do residente...</div>

      <section v-else-if="residente" class="perfil-painel">
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
    </div>
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
  background: #f2f7f0;
}

.perfil-corpo {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 24px 48px 24px;
}

.error-message {
  margin: 0 0 16px 0;
  padding: 10px 14px;
  background: #fbe9e9;
  border: 1px solid #e4b4b4;
  border-radius: 8px;
  color: #8a1f1f;
  font-size: 14px;
  font-weight: 700;
}

.loading-message {
  margin: 0;
  padding: 20px 0;
  color: #4a5a47;
  font-size: 15px;
  text-align: center;
}

/* Painel: card branco que limita o conteúdo, separando-o do fundo claro. */
.perfil-painel {
  width: 100%;
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(47, 90, 43, 0.06);
  padding: 40px 48px;
}

.perfil-conteudo {
  display: flex;
  gap: 56px;
  align-items: flex-start;
}

.grupo-foto {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.perfil-foto {
  width: 260px;
  height: 290px;
  border-radius: 14px;
  border: 1px solid #dde7d8;
  background: #e8f1e3;
  overflow: hidden;
}

.perfil-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-editar {
  width: 100%;
  background: #3e7a2b;
  border: none;
  color: #ffffff;
  font-family: inherit;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  padding: 12px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-editar:hover {
  background: #2f5a2b;
}

.grupo-conteudo {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.grupo-informacoes {
  display: flex;
  gap: 64px;
  align-items: flex-start;
}

.perfil-dados {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.residente-nome {
  color: #1f2d1c;
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 8px 0;
  line-height: 1.15;
}

.dado-linha {
  color: #4a5a47;
  font-size: 15px;
  margin: 0;
}

.dado-linha strong {
  color: #1f2d1c;
  font-weight: 600;
}

.perfil-dependencia {
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding-top: 44px;
  flex-shrink: 0;
}

.dependencia-titulo {
  color: #1f2d1c;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.dependencia-item {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #4a5a47;
  font-size: 14px;
  white-space: nowrap;
}

.dependencia-marcador {
  width: 20px;
  height: 15px;
  border-radius: 4px;
  border: 1px solid #dde7d8;
  background: #ffffff;
  flex-shrink: 0;
}

.dependencia-marcador.ativo {
  background: #3e7a2b;
  border-color: #3e7a2b;
}

.perfil-menu {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
}

.btn-menu {
  background-color: #3e7a2b;
  color: #ffffff;
  font-family: inherit;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  border: none;
  border-radius: 8px;
  padding: 14px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-menu:hover {
  background-color: #2f5a2b;
}

.observacoes-box {
  border: 1px solid #dde7d8;
  border-radius: 10px;
  background: #f2f7f0;
  padding: 16px 20px;
  min-height: 110px;
}

.observacoes-box .label {
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1f2d1c;
}

.observacoes-texto {
  margin: 0;
  font-size: 13px;
  color: #4a5a47;
  white-space: pre-line;
}

@media (max-width: 900px) {
  .perfil-corpo {
    padding: 20px 16px 40px 16px;
  }

  .perfil-painel {
    padding: 28px 20px;
  }

  .perfil-conteudo {
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  .grupo-conteudo {
    width: 100%;
  }

  .grupo-informacoes {
    flex-direction: column;
    gap: 32px;
    width: 100%;
  }

  .perfil-dependencia {
    padding-top: 0;
  }

  .perfil-menu {
    grid-template-columns: 1fr;
  }

  .btn-editar,
  .btn-menu {
    width: 100%;
  }
}
</style>
