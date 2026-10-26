<template>
  <section class="mini-calendario">
    <div class="calendario-topo">
      <button type="button" class="calendario-seta" aria-label="Mês anterior" @click="mesAnterior">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <span class="calendario-titulo">{{ tituloMes }}</span>

      <button type="button" class="calendario-seta" aria-label="Próximo mês" @click="mesProximo">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <div class="calendario-semana">
      <span v-for="dia in DIAS_SEMANA" :key="dia">{{ dia }}</span>
    </div>

    <div class="calendario-grade">
      <button
        v-for="dia in diasDoMes"
        :key="dia.iso"
        type="button"
        class="calendario-dia"
        :class="{
          'fora-do-mes': !dia.doMes,
          hoje: dia.iso === hojeIso,
          selecionado: dia.iso === selectedDate,
        }"
        @click="selecionarDia(dia.iso)"
      >
        <span>{{ dia.numero }}</span>
        <span v-if="dia.temAnotacao" class="calendario-ponto"></span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  selectedDate: {
    type: String,
    required: true,
  },
  diasComAnotacao: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['select'])

const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const hojeIso = ref(paraISO(new Date()))
const mesVisivel = ref(inicioDoMes(paraData(props.selectedDate)))

watch(
  () => props.selectedDate,
  (valor) => {
    mesVisivel.value = inicioDoMes(paraData(valor))
  },
)

const tituloMes = computed(() => {
  return capitalizar(
    mesVisivel.value.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    }),
  )
})

const diasDoMes = computed(() => {
  const ano = mesVisivel.value.getFullYear()
  const mes = mesVisivel.value.getMonth()
  const primeiroDia = new Date(ano, mes, 1, 12)
  const deslocamento = (primeiroDia.getDay() + 6) % 7
  const inicioGrade = new Date(ano, mes, 1 - deslocamento, 12)
  const dias = []

  for (let indice = 0; indice < 42; indice += 1) {
    const data = new Date(
      inicioGrade.getFullYear(),
      inicioGrade.getMonth(),
      inicioGrade.getDate() + indice,
      12,
    )
    const iso = paraISO(data)

    dias.push({
      iso,
      numero: data.getDate(),
      doMes: data.getMonth() === mes,
      temAnotacao: props.diasComAnotacao.includes(iso),
    })
  }

  return dias
})

function paraData(valor) {
  const [ano, mes, dia] = String(valor).slice(0, 10).split('-').map(Number)

  if (!ano || !mes || !dia) return new Date()

  return new Date(ano, mes - 1, dia, 12)
}

function paraISO(data) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate(), 12)
    .toISOString()
    .slice(0, 10)
}

function inicioDoMes(data) {
  return new Date(data.getFullYear(), data.getMonth(), 1, 12)
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

function mesAnterior() {
  mesVisivel.value = new Date(
    mesVisivel.value.getFullYear(),
    mesVisivel.value.getMonth() - 1,
    1,
    12,
  )
}

function mesProximo() {
  mesVisivel.value = new Date(
    mesVisivel.value.getFullYear(),
    mesVisivel.value.getMonth() + 1,
    1,
    12,
  )
}

function selecionarDia(iso) {
  mesVisivel.value = inicioDoMes(paraData(iso))
  emit('select', iso)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.mini-calendario {
  background: #ffffff;
  border: 1px solid #dde7d8;
  border-radius: 12px;
  padding: 16px;
}

.calendario-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}

.calendario-titulo {
  color: #1f2d1c;
  font-size: 14px;
  font-weight: 800;
  text-align: center;
}

.calendario-seta {
  width: 30px;
  height: 30px;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  background: #ffffff;
  color: #3e7a2b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease;
}

.calendario-seta:hover {
  background: #e8f1e3;
}

.calendario-seta svg {
  width: 16px;
  height: 16px;
}

.calendario-semana,
.calendario-grade {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendario-semana {
  margin-bottom: 6px;
}

.calendario-semana span {
  color: #4a5a47;
  font-size: 10px;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
}

.calendario-dia {
  position: relative;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #1f2d1c;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.calendario-dia:hover {
  background: #e8f1e3;
}

.calendario-dia.fora-do-mes {
  color: #8fa093;
}

.calendario-dia.hoje {
  border: 1px solid #3e7a2b;
}

.calendario-dia.selecionado {
  background: #3e7a2b;
  color: #ffffff;
}

.calendario-ponto {
  position: absolute;
  bottom: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #3e7a2b;
}

.calendario-dia.selecionado .calendario-ponto {
  background: #ffffff;
}
</style>
