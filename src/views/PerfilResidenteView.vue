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

    <div v-if="carregando" class="msg-carregando">
      Carregando dados do residente...
    </div>

    <template v-else-if="residente">

      <div class="perfil-conteudo">

        <div class="grupo-foto">

          <div
            class="perfil-foto"
            :class="{ 'perfil-foto--vazia': !residente.foto }"
          >
            <img
              v-if="!!residente.foto"
              :src="residente.foto.url"
              class="perfil-img"
            />
          </div>

          <button
            class="btn-editar"
            @click="irPara('editarresidente')"
          >
            EDITAR DADOS
          </button>

        </div>

        <div class="grupo-conteudo">

          <div class="grupo-informacoes">

            <div class="perfil-dados">

              <h1 class="residente-nome">
                {{ residente.nome_completo }}
              </h1>

              <p class="dado-linha">
                <strong>Nascimento:</strong>
                {{ residente.data_nascimento }}
              </p>

              <p class="dado-linha">
                <strong>Idade:</strong>
                {{ residente.idade }} anos
              </p>

              <p class="dado-linha">
                <strong>Data de Entrada:</strong>
                {{ residente.data_entrada }}
              </p>

              <p class="dado-linha">
                <strong>Quarto:</strong>
                {{ residente.quarto }}
              </p>

            </div>

            <div class="perfil-dependencia">

              <h2 class="dependencia-titulo">
                Grau de Dependência:
              </h2>

              <div class="dependencia-item">
                <span
                  class="dependencia-marcador"
                  :class="{ ativo: residente.grau_dependencia === 1 }"
                ></span>

                Grau 1 - Independente
              </div>

              <div class="dependencia-item">
                <span
                  class="dependencia-marcador"
                  :class="{ ativo: residente.grau_dependencia === 2 }"
                ></span>

                Grau 2 - Necessita auxílio parcial
              </div>

              <div class="dependencia-item">
                <span
                  class="dependencia-marcador"
                  :class="{ ativo: residente.grau_dependencia === 3 }"
                ></span>

                Grau 3 - Dependência total
              </div>

            </div>

          </div>

          <nav class="perfil-menu">

            <button
              class="btn-menu"
              @click="irPara('dadosmedicos')"
            >
              DADOS MÉDICOS
            </button>

            <button
              class="btn-menu"
              @click="irPara('contatosprontuario', { params: { id: residente.id } })"
            >
              CONTATOS
            </button>

            <button
              class="btn-menu"
              @click="irPara('cuidadospessoais')"
            >
              CUIDADOS PESSOAIS
            </button>

            <button
              class="btn-menu"
              @click="irPara('historico')"
            >
              HISTÓRICO
            </button>

            <button
              class="btn-menu"
              @click="irPara('calendario')"
            >
              CALENDÁRIO
            </button>

            <button
              class="btn-menu"
              @click="irPara('nutricao')"
            >
              NUTRIÇÃO
            </button>

          </nav>

        </div>

      </div>

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
  gap: 45px;
  padding: 55px 70px 0 70px;
  background: #2e5d2e;
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
  margin-top: 50px;
}

.perfil-conteudo {
  display: flex;
  gap: 55px;
  align-items: flex-start;
  justify-content: center;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.grupo-foto {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

.perfil-foto {
  width: 240px;
  height: 264px;
  border-radius: 14px;
  background: #d9d9d9;
  overflow: hidden;
}

.perfil-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-editar {
  background: #ffffff;
  border: none;
  color: #2e5d2e;
  font-weight: 600;
  font-size: 13px;
  padding: 11px 47px;
  border-radius: 7px;
  cursor: pointer;
}

.grupo-conteudo {
  flex: 1;
  min-width: 0;
}

.grupo-informacoes {
  display: flex;
  gap: 65px;
  align-items: flex-start;
}

.perfil-dados {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 5px;
  width: 280px;
  flex-shrink: 0;
}

.residente-nome {
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
  margin: 11px 0 13px 0;
}

.dado-linha {
  color: #ffffff;
  font-size: 16px;
  font-weight: 400;
  margin: 0;
}

.dado-linha strong {
  font-weight: 600;
}

.perfil-dependencia {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 60px;
}

.dependencia-titulo {
  color: #ffffff;
  font-size: 17px;
  font-weight: 600;
  margin: 0 0 6px 0;
}

.dependencia-item {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 400;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 18px 12px;
  width: 590px;
  margin-top: 22px;
}

.btn-menu {
  background-color: #72a840;
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
  border: none;
  border-radius: 7px;
  padding: 9px 12px;
  height: 36px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn-menu:hover {
  background-color: #7caf49;
  transform: translateY(-1px);
}

.linha-divisoria {
  height: 8px;
  background: #ffffff;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>