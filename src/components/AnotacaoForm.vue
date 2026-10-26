<template>
  <form id="anotacao-form" class="anotacao-form" @submit.prevent="handleSubmit">
    <h3 class="form-titulo">
      {{ editingAnotacao ? 'Editar anotação' : 'Nova anotação' }}
    </h3>

    <p v-if="erro" class="error-message">{{ erro }}</p>

    <div class="form-grid">
      <div class="form-group">
        <label for="anotacao-data">DATA</label>
        <input id="anotacao-data" v-model="form.data" type="date" />
      </div>

      <div class="form-group">
        <label for="anotacao-hora">HORA</label>
        <input id="anotacao-hora" v-model="form.hora" type="time" />
      </div>

      <div class="form-group">
        <label for="anotacao-categoria">CATEGORIA</label>
        <select id="anotacao-categoria" v-model="form.categoria">
          <option
            v-for="categoria in CATEGORIAS_ANOTACAO"
            :key="categoria.valor"
            :value="categoria.valor"
          >
            {{ categoria.rotulo }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="anotacao-status">STATUS</label>
        <select id="anotacao-status" v-model="form.status">
          <option v-for="status in STATUS_ANOTACAO" :key="status.valor" :value="status.valor">
            {{ status.rotulo }}
          </option>
        </select>
      </div>

      <div class="form-group form-group-full">
        <label for="anotacao-titulo">TÍTULO</label>
        <input
          id="anotacao-titulo"
          v-model="form.titulo"
          type="text"
          maxlength="120"
          placeholder="Resumo da anotação"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="anotacao-texto">TEXTO</label>
      <textarea
        id="anotacao-texto"
        v-model="form.texto"
        rows="4"
        placeholder="Descreva a anotação..."
      ></textarea>
    </div>

    <div class="form-acoes">
      <button v-if="editingAnotacao" type="button" class="btn-cancelar" @click="emit('cancel')">
        Cancelar
      </button>

      <button type="submit" class="btn-salvar">
        {{ editingAnotacao ? 'Atualizar anotação' : 'Adicionar anotação' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { CATEGORIAS_ANOTACAO, STATUS_ANOTACAO, STATUS_ANOTACAO_PADRAO } from '@/constants/anotacoes'

const props = defineProps({
  editingAnotacao: {
    type: Object,
    default: null,
  },
  dataSelecionada: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['add', 'update', 'cancel'])

const erro = ref('')
const form = ref({
  data: props.dataSelecionada || hojeISO(),
  hora: '',
  categoria: 'geral',
  status: STATUS_ANOTACAO_PADRAO,
  titulo: '',
  texto: '',
})

watch(
  () => props.editingAnotacao,
  (anotacao) => {
    if (anotacao) {
      form.value.data = String(anotacao.data || '').slice(0, 10)
      form.value.hora = String(anotacao.hora || '').slice(0, 5)
      form.value.categoria = anotacao.categoria || 'geral'
      form.value.status = anotacao.status || STATUS_ANOTACAO_PADRAO
      form.value.titulo = anotacao.titulo || ''
      form.value.texto = anotacao.texto || ''
    } else {
      resetarFormulario()
    }
  },
  { immediate: true },
)

watch(
  () => props.dataSelecionada,
  (data) => {
    if (!props.editingAnotacao) {
      form.value.data = data
    }
  },
)

function hojeISO() {
  const hoje = new Date()

  return new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 12)
    .toISOString()
    .slice(0, 10)
}

function resetarFormulario() {
  form.value.data = props.dataSelecionada || hojeISO()
  form.value.hora = ''
  form.value.categoria = 'geral'
  form.value.status = STATUS_ANOTACAO_PADRAO
  form.value.titulo = ''
  form.value.texto = ''
  erro.value = ''
}

function handleSubmit() {
  erro.value = ''

  if (!form.value.data) {
    erro.value = 'Informe a data da anotação.'
    return
  }

  if (!form.value.titulo.trim()) {
    erro.value = 'Informe um título para a anotação.'
    return
  }

  const dados = {
    data: form.value.data,
    hora: form.value.hora || null,
    categoria: form.value.categoria,
    status: form.value.status,
    titulo: form.value.titulo.trim(),
    texto: form.value.texto.trim(),
  }

  if (props.editingAnotacao) {
    emit('update', {
      id: props.editingAnotacao.id,
      dados,
    })
    return
  }

  emit('add', dados)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.anotacao-form {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #dde7d8;
  scroll-margin-top: 24px;
}

.form-titulo {
  margin: 0 0 16px 0;
  color: #2f5a2b;
  font-size: 16px;
  font-weight: 800;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 20px;
  margin-bottom: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group-full {
  grid-column: 1 / -1;
}

.form-group label {
  color: #4a5a47;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  border: 1px solid #dde7d8;
  border-radius: 8px;
  padding: 9px 12px;
  font-family: inherit;
  font-size: 13px;
  color: #1f2d1c;
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s ease;
}

.form-group input,
.form-group select {
  height: 40px;
}

.form-group textarea {
  min-height: 90px;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #3e7a2b;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #8fa093;
}

.form-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.btn-salvar,
.btn-cancelar {
  border-radius: 8px;
  padding: 10px 18px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-salvar {
  background: #3e7a2b;
  border: 1px solid #3e7a2b;
  color: #ffffff;
}

.btn-salvar:hover {
  background: #2f5a2b;
}

.btn-cancelar {
  background: transparent;
  border: 1px solid #3e7a2b;
  color: #3e7a2b;
}

.btn-cancelar:hover {
  background: #f2f7f0;
}

.error-message {
  margin: 0 0 12px 0;
  padding: 8px 12px;
  background: #fbe9e9;
  border: 1px solid #e4b4b4;
  border-radius: 8px;
  color: #8a1f1f;
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-acoes {
    flex-direction: column;
  }
}
</style>
