<script>
import api from '@/services/api'
import ResidenteCard from '@/components/ResidenteCard.vue'

export default {
  name: 'ProntuariosView',

  components: {
    ResidenteCard,
  },

  data() {
    return {
      residentes: [],
      residentesFiltrados: [],
      termoBusca: '',
      mostrarFiltros: false,
      carregando: false,
      erro: '',
    }
  },

  mounted() {
    this.buscarResidentes()
  },

  methods: {
    async buscarResidentes() {
      this.carregando = true
      this.erro = ''

      try {
        // TODO: ajustar endpoint quando o backend estiver pronto
        const resposta = await api.get('/residentes/')
        this.residentes = resposta.data
        this.residentesFiltrados = resposta.data
      } catch (error) {
        this.erro = 'Erro ao carregar residentes. Tente novamente.'
        this.residentes = []
        this.residentesFiltrados = []
      } finally {
        this.carregando = false
      }
    },

    filtrarResidentes() {
      const termo = this.termoBusca.trim().toLowerCase()

      if (!termo) {
        this.residentesFiltrados = this.residentes
        return
      }

      this.residentesFiltrados = this.residentes.filter((residente) =>
        residente.nome.toLowerCase().includes(termo)
      )
    },
  },
}
</script>
<template>
  <div class="prontuarios-page">
    <main class="main-content">
      <div class="barra-topo">
        <div class="campo-busca">
          <input
            v-model="termoBusca"
            type="text"
            placeholder="Buscar residente..."
            @input="filtrarResidentes"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e5d2e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>

        <button class="btn-filtros" @click="mostrarFiltros = !mostrarFiltros">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          FILTROS
        </button>
      </div>

      <p v-if="erro" class="msg-erro">{{ erro }}</p>

      <div v-if="carregando" class="msg-carregando">Carregando residentes...</div>

      <div v-else-if="residentesFiltrados.length === 0" class="estado-vazio">
        <svg class="icone-vazio" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <p class="msg-vazio">Nenhum residente cadastrado ainda.</p>
        <p class="msg-vazio-sub">Comece adicionando o primeiro residente da casa de repouso.</p>
        <button class="btn-cadastrar" @click="$router.push('/dadosmedicos')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#305126" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          CADASTRAR PRIMEIRO RESIDENTE
        </button>
      </div>

      <div v-else class="residentes-grid">
        <ResidenteCard
          v-for="residente in residentesFiltrados"
          :key="residente.id"
          :residente="residente"
        />
      </div>
    </main>

    <div class="linha-divisoria"></div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.prontuarios-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: #2e5d2e;
  padding: 30px 50px;
  display: flex;
  flex-direction: column;
}

.barra-topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.campo-busca {
  position: relative;
  flex: 1;
  max-width: 500px;
}

.campo-busca input {
  width: 100%;
  height: 38px;
  border: none;
  border-radius: 20px;
  padding: 0 40px 0 16px;
  font-size: 13px;
  color: #1e3e1e;
}

.campo-busca svg {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.btn-filtros {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1.5px solid #ffffff;
  border-radius: 20px;
  padding: 8px 18px;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-filtros:hover {
  background: rgba(255, 255, 255, 0.15);
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
  margin-top: 40px;
}

.estado-vazio {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
}

.icone-vazio {
  opacity: 0.85;
  margin-bottom: 8px;
}

.msg-vazio {
  color: #ffffff;
  font-size: 17px;
  font-weight: bold;
  margin: 0;
}

.msg-vazio-sub {
  color: #d7e3d4;
  font-size: 13px;
  margin: 0 0 14px 0;
}

.btn-cadastrar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  color: #305126;
  border: none;
  padding: 12px 28px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
}

.btn-cadastrar:hover {
  background: #e8f0e8;
  transform: translateY(-2px);
}

.residentes-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px 20px;
}

.linha-divisoria {
  height: 1vw;
  background: #ffffff;
  width: 100%;
}
</style>