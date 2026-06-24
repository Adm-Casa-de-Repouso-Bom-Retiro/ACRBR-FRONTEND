<script>
import api from '@/services/api'

export default {
  name: 'DadosMedicosView',

  data() {
    return {
      residente: {},
      dadosMedicos: {
        condicoes_medicas: '',
        alergias: '',
        observacoes: '',
        peso: '',
        altura: '',
        medicamentos: [],
      },
      carregando: true,
    }
  },

  computed: {
    pesoAlturaFormatado() {
      const peso = this.dadosMedicos.peso
      const altura = this.dadosMedicos.altura
      if (!peso && !altura) return ''
      if (peso && altura) return `${peso} kg / ${altura} m`
      return peso ? `${peso} kg` : `${altura} m`
    },
  },

  async created() {
    const residenteId = this.$route.params.id

    try {
      const residenteRes = await api.get(`/residentes/${residenteId}/`)
      this.residente = residenteRes.data
    } catch (error) {
      console.error('Erro ao carregar residente:', error)
    }

    try {
      const medicosRes = await api.get(`/residentes/${residenteId}/dados-medicos/`)
      this.dadosMedicos = {
        condicoes_medicas: medicosRes.data.condicoes_medicas || '',
        alergias: medicosRes.data.alergias || '',
        observacoes: medicosRes.data.observacoes || '',
        peso: medicosRes.data.peso || '',
        altura: medicosRes.data.altura || '',
        medicamentos: medicosRes.data.medicamentos || [],
      }
    } catch (error) {
      console.error('Erro ao carregar dados médicos:', error)
    }

    this.carregando = false
  },

  methods: {
    editarDados() {
      this.$router.push(`/residentes/${this.$route.params.id}/editar-dados-medicos`)
    },
  },
}
</script>

<template>
  <div class="dados-medicos-page">
    <div class="top-line"></div>

    <div v-if="carregando" class="loading">
      Carregando...
    </div>

    <main v-else class="main-content">

      <div class="cabecalho">
        <div class="cabecalho-esquerda">
          <div class="avatar-circle">
            <img
              :src="residente.foto_url || '/src/assets/images/icone-login.png'"
              alt="Foto do residente"
              class="avatar-img"
            />
          </div>
          <span class="nome-pill">Dados Médicos - {{ residente.nome || '...' }}</span>
        </div>
        <button class="btn-editar" @click="editarDados">EDITAR DADOS</button>
      </div>

      <div class="grid-cards">
        <div class="info-card">
          <span class="info-card-titulo">Condições Médicas:</span>
          <p class="info-card-texto">{{ dadosMedicos.condicoes_medicas }}</p>
        </div>

        <div class="info-card">
          <span class="info-card-titulo">Alergias:</span>
          <p class="info-card-texto">{{ dadosMedicos.alergias }}</p>
        </div>

        <div class="info-card">
          <span class="info-card-titulo">Observações:</span>
          <p class="info-card-texto">{{ dadosMedicos.observacoes }}</p>
        </div>

        <div class="info-card">
          <span class="info-card-titulo">Peso e Altura:</span>
          <p class="info-card-texto">{{ pesoAlturaFormatado }}</p>
        </div>
      </div>

      <div class="medicamentos-card">
        <div class="med-header">
          <span class="med-col-titulo">Medicamentos:</span>
          <span class="med-col-titulo">Dosagem:</span>
          <span class="med-col-titulo">Horário:</span>
        </div>

        <template v-if="dadosMedicos.medicamentos && dadosMedicos.medicamentos.length > 0">
          <div
            v-for="(med, index) in dadosMedicos.medicamentos"
            :key="index"
            class="med-linha"
          >
            <div class="med-col med-nome">
              <span class="med-icone"></span>
              <span>{{ med.nome }}</span>
            </div>
            <div class="med-col">{{ med.dosagem }}</div>
            <div class="med-col">{{ med.horario }}</div>
          </div>
        </template>

        <div v-else class="med-vazio">
          Nenhum medicamento cadastrado.
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.top-line {
  width: 100%;
  height: 10px;
  background: #2e5d2e;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 15px;
  color: #555;
}

.main-content {
  background: #2e5d2e;
  min-height: calc(100vh - 10px);
  padding: 32px 5vw 48px 5vw;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cabecalho-esquerda {
  display: flex;
  align-items: center;
  gap: 18px;
}

.avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #d0d0d0;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nome-pill {
  background: #4a9e4a;
  color: white;
  font-size: 16px;
  font-weight: 700;
  border-radius: 20px;
  padding: 8px 22px;
  letter-spacing: 0.2px;
}

.btn-editar {
  background: transparent;
  color: white;
  border: 2px solid white;
  border-radius: 6px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-editar:hover {
  background: rgba(255, 255, 255, 0.12);
}

.grid-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-card {
  background: #2e5d2e;
  border: 2px solid white;
  border-radius: 10px;
  padding: 16px 18px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-card-titulo {
  font-size: 14px;
  font-weight: 700;
  color: white;
}

.info-card-texto {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  line-height: 1.5;
}

.medicamentos-card {
  background: #2e5d2e;
  border: 2px solid white;
  border-radius: 10px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.med-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  padding-bottom: 4px;
}

.med-col-titulo {
  font-size: 14px;
  font-weight: 700;
  color: white;
}

.med-linha {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  align-items: center;
}

.med-col {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

.med-nome {
  display: flex;
  align-items: center;
  gap: 10px;
}

.med-icone {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  flex-shrink: 0;
}

.med-vazio {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 12px 0;
}

</style>