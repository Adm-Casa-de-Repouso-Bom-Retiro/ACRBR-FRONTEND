<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const router = useRouter()

const residente = ref(null)
const carregando = ref(false)
const erro = ref('')

const idade = computed(() => {
  if (!residente.value?.data_nascimento) return null

  const nascimento = new Date(residente.value.data_nascimento)
  const hoje = new Date()

  let anos = hoje.getFullYear() - nascimento.getFullYear()
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())

  if (aindaNaoFezAniversario) anos--

  return anos
})

const dataAdmissaoFormatada = computed(() => {
  if (!residente.value?.data_admissao) return ''
  return new Date(residente.value.data_admissao).toLocaleDateString('pt-BR')
})

async function buscarResidente() {
  carregando.value = true
  erro.value = ''

  try {
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
  router.push({ name: nomeRota, params: { id: props.id } })
}

onMounted(buscarResidente)
</script>

<template>
  <main class="perfil-residente">
    <p v-if="erro" class="msg-erro">{{ erro }}</p>
    <div v-if="carregando" class="msg-carregando">Carregando dados do residente...</div>

    <template v-else-if="residente">
      <section class="perfil-topo">
        <div class="coluna-foto">
          <div class="perfil-foto" :class="{ 'perfil-foto--vazia': !residente.foto }">
            <img v-if="!!residente.foto" :src="residente.foto.url" class="perfil-img" />
          </div>
          <button class="btn-editar" @click="irPara('editarresidente')">EDITAR DADOS</button>
        </div>

        <div class="perfil-dados">
          <h1 class="residente-nome">{{ residente.nome_completo }}</h1>
          <p class="dado-linha"><strong>Nascimento:</strong> {{ residente.data_nascimento }}</p>
          <p class="dado-linha"><strong>Idade:</strong> {{ idade ?? '—' }} anos</p>
          <p class="dado-linha"><strong>Data de Entrada:</strong> {{ dataAdmissaoFormatada || '—' }}</p>
          <p class="dado-linha"><strong>Quarto:</strong> {{ residente.quarto }}</p>
        </div>

        <div class="perfil-dependencia">
          <h2 class="dependencia-titulo">Grau de Dependência:</h2>
          <div class="dependencia-item">
            <span
              class="dependencia-marcador"
              :class="{ ativo: residente.grau_dependencia === 'grau_1' }"
            ></span>
            Grau 1 - Independente
          </div>
          <div class="dependencia-item">
            <span
              class="dependencia-marcador"
              :class="{ ativo: residente.grau_dependencia === 'grau_2' }"
            ></span>
            Grau 2 - Necessita auxílio parcial
          </div>
          <div class="dependencia-item">
            <span
              class="dependencia-marcador"
              :class="{ ativo: residente.grau_dependencia === 'grau_3' }"
            ></span>
            Grau 3 - Dependência total
          </div>
        </div>
      </section>

      <nav class="perfil-menu">
        <button class="btn-menu" @click="irPara('dadosmedicos')">DADOS MÉDICOS</button>
        <button class="btn-menu" @click="irPara('contatosresidentes')">CONTATOS</button>
        <button class="btn-menu" @click="irPara('cuidadospessoais')">CUIDADOS PESSOAIS</button>
        <button class="btn-menu" @click="irPara('historico')">HISTÓRICO</button>
        <button class="btn-menu" @click="irPara('calendario')">CALENDÁRIO</button>
        <button class="btn-menu" @click="irPara('nutricao')">NUTRIÇÃO</button>
      </nav>
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
  align-items: center;
  justify-content: center;
  padding: 60px 70px 68px 70px;
  background: #2e5d2e;
}

.msg-erro {
  color: #ffdada;
  font-size: 13px;
}

.msg-carregando {
  color: #ffffff;
  font-size: 14px;
  text-align: center;
}

.perfil-painel {
  width: 100%;
  max-width: 1180px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.045);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  padding: 56px 64px;
}

.perfil-topo {
  display: flex;
  gap: 70px;
  align-items: flex-start;
}

.coluna-foto {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex-shrink: 0;
}

.perfil-foto {
  width: 260px;
  height: 290px;
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
  width: 100%;
  background: #ffffff;
  border: 2px solid #ffffff;
  color: #2e5d2e;
  font-weight: 700;
  font-size: 13px;
  padding: 12px 0;
  border-radius: 7px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
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
  gap: 40px;
}

.grupo-informacoes {
  display: flex;
  gap: 80px;
  align-items: flex-start;
}

.perfil-dados {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 5px;
  flex: 1;
  min-width: 0;
}

.residente-nome {
  color: #ffffff;
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.15;
}

.dado-linha {
  color: #ffffff;
  font-size: 15px;
  margin: 0;
}

.perfil-dependencia {
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding-top: 46px;
  flex-shrink: 0;
}

.dependencia-titulo {
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 6px 0;
}

.dependencia-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-size: 14px;
}

.dependencia-marcador {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1.5px solid #ffffff;
  flex-shrink: 0;
}

.dependencia-marcador.ativo {
  background: #a8d8a8;
  border-color: #a8d8a8;
}

.perfil-menu {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 18px;
  width: 100%;
}

.btn-menu {
  background-color: #ffffff !important;
  color: #2e5d2e !important;
  font-weight: 700;
  font-size: 13px;
  border: none;
  border-radius: 8px;
  padding: 14px 12px;
  cursor: pointer;
  letter-spacing: 0.3px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-menu:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-menu tíc-hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

@media (max-width: 900px) {
  .perfil-residente {
    padding: 40px 24px 48px 24px;
  }

  .perfil-painel {
    padding: 36px 28px;
  }

  .perfil-conteudo {
    flex-direction: column;
    align-items: center;
    gap: 32px;
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
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
