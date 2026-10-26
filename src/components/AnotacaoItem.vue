<template>
  <article class="anotacao-item" :class="classeCategoria">
    <div class="anotacao-topo">
      <div class="anotacao-topo-info">
        <span v-if="anotacao.hora" class="anotacao-hora">{{ formatarHora(anotacao.hora) }}</span>
        <span class="anotacao-status" :class="classeStatus">{{ rotuloStatus }}</span>
      </div>
      <span class="anotacao-categoria">{{ rotuloCategoria }}</span>
    </div>

    <h3 class="anotacao-titulo">{{ anotacao.titulo }}</h3>

    <p v-if="anotacao.texto" class="anotacao-texto">{{ anotacao.texto }}</p>

    <div class="anotacao-rodape">
      <span class="anotacao-autor">{{ anotacao.autor_nome || 'Equipe' }}</span>
      <span class="anotacao-registro">{{ formatarRegistro(anotacao.criado_em) }}</span>
    </div>

    <div v-if="podeEditar" class="anotacao-acoes">
      <template v-if="!confirmandoExclusao">
        <select
          class="btn-acao anotacao-status-select"
          :class="classeStatus"
          :value="statusAtual"
          aria-label="Status da anotação"
          @change="alterarStatus"
        >
          <option v-for="status in STATUS_ANOTACAO" :key="status.valor" :value="status.valor">
            {{ status.rotulo }}
          </option>
        </select>

        <button type="button" class="btn-acao btn-editar" @click="emit('edit', anotacao)">
          Editar
        </button>
        <button type="button" class="btn-acao btn-excluir" @click="confirmandoExclusao = true">
          Excluir
        </button>
      </template>

      <template v-else>
        <button type="button" class="btn-acao btn-confirmar" @click="confirmarExclusao">
          Confirmar exclusão
        </button>
        <button type="button" class="btn-acao btn-cancelar" @click="confirmandoExclusao = false">
          Cancelar
        </button>
      </template>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { CATEGORIAS_ANOTACAO, STATUS_ANOTACAO, obterStatusAnotacao } from '@/constants/anotacoes'

const props = defineProps({
  anotacao: {
    type: Object,
    required: true,
  },
  podeEditar: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['edit', 'remove', 'status-change'])

const confirmandoExclusao = ref(false)

const classeCategoria = computed(() => {
  const categoria = CATEGORIAS_ANOTACAO.find((item) => item.valor === props.anotacao.categoria)

  return categoria ? categoria.classe : 'categoria-geral'
})

const rotuloCategoria = computed(() => {
  const categoria = CATEGORIAS_ANOTACAO.find((item) => item.valor === props.anotacao.categoria)

  return categoria ? categoria.rotulo : 'Geral'
})

const statusInfo = computed(() => obterStatusAnotacao(props.anotacao.status))
const statusAtual = computed(() => statusInfo.value.valor)
const rotuloStatus = computed(() => statusInfo.value.rotulo)
const classeStatus = computed(() => statusInfo.value.classe)

function formatarHora(hora) {
  if (!hora) return ''

  return String(hora).slice(0, 5)
}

function formatarRegistro(valor) {
  if (!valor) return '—'

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) return '—'

  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function alterarStatus(evento) {
  const novoStatus = evento.target.value
  const statusAnterior = statusAtual.value

  if (novoStatus === statusAnterior) return

  evento.target.value = statusAnterior
  emit('status-change', { anotacao: props.anotacao, status: novoStatus })
}

function confirmarExclusao() {
  emit('remove', props.anotacao)
  confirmandoExclusao.value = false
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.anotacao-item {
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 14px 16px;
  text-align: left;
}

.categoria-geral {
  background: #e8f1e3;
  border-color: #c9dfc2;
  color: #1f2d1c;
}

.categoria-saude {
  background: #dff0e7;
  border-color: #b9dbc8;
  color: #173d2a;
}

.categoria-medicacao {
  background: #f8ecd4;
  border-color: #e6d3ae;
  color: #4a3510;
}

.categoria-alimentacao {
  background: #fbe6d2;
  border-color: #efc9a8;
  color: #4a2a10;
}

.categoria-atividade {
  background: #dcecf7;
  border-color: #b8d4e8;
  color: #123247;
}

.categoria-visita {
  background: #e4e9f8;
  border-color: #c3cdec;
  color: #1c2a52;
}

.status-pendente {
  background: #f8ecd4;
  border-color: #e6d3ae;
  color: #4a3510;
}

.status-concluido {
  background: #dff0e7;
  border-color: #b9dbc8;
  color: #173d2a;
}

.status-nao-concluido {
  background: #fbe0e0;
  border-color: #e4b4b4;
  color: #8a1f1f;
}

.anotacao-topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.anotacao-topo-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.anotacao-status {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 2px 8px;
}

.anotacao-hora {
  font-size: 12px;
  font-weight: 800;
}

.anotacao-categoria {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 999px;
  padding: 3px 8px;
}

.anotacao-titulo {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.25;
}

.anotacao-texto {
  margin: 0 0 10px 0;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.anotacao-rodape {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  opacity: 0.9;
}

.anotacao-acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(31, 45, 28, 0.15);
}

.btn-acao {
  border-radius: 6px;
  padding: 6px 10px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.anotacao-status-select {
  margin-right: auto;
  border: 1px solid transparent;
}

.btn-editar {
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
}

.btn-excluir {
  background: transparent;
  border: 1px solid #8a1f1f;
  color: #8a1f1f;
}

.btn-confirmar {
  background: #8a1f1f;
  border: 1px solid #8a1f1f;
  color: #ffffff;
}

.btn-cancelar {
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
}
</style>
