import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  listarAnotacoes,
  listarAnotacoesAtualizadasNaData,
  listarMedicacoesDoDia,
  criarAnotacao,
  atualizarAnotacao,
  excluirAnotacao,
} from '@/api/anotacoes'

export const useAnotacoesStore = defineStore('anotacoes', () => {
  const anotacoes = ref([])
  const anotacoesAtualizadasHoje = ref([])
  const medicacoesDoDia = ref([])
  const loading = ref(false)
  const error = ref('')

  const anotacoesPorResidente = computed(
    () => (residenteId) =>
      anotacoes.value.filter((anotacao) => String(anotacao.residente) === String(residenteId)),
  )

  const anotacoesDoDia = computed(
    () => (data) => anotacoes.value.filter((anotacao) => anotacao.data === data),
  )

  const anotacoesPorCategoria = computed(
    () => (categoria) => anotacoes.value.filter((anotacao) => anotacao.categoria === categoria),
  )

  async function fetchAnotacoes(residenteId) {
    loading.value = true
    error.value = ''

    try {
      const resposta = await listarAnotacoes(residenteId)
      anotacoes.value = resposta.data.results || resposta.data || []
    } catch (erro) {
      error.value = 'Erro ao carregar anotações. Tente novamente.'
      anotacoes.value = []
    } finally {
      loading.value = false
    }
  }

  function fetchResumoDoDia(data) {
    loading.value = true
    error.value = ''

    return listarAnotacoesAtualizadasNaData(data)
      .then((resposta) => {
        anotacoesAtualizadasHoje.value = resposta.data.results || resposta.data || []

        return listarMedicacoesDoDia(data)
      })
      .then((resposta) => {
        medicacoesDoDia.value = resposta.data.results || resposta.data || []
      })
      .catch(() => {
        error.value = 'Erro ao carregar os dados do dia. Tente novamente.'
        anotacoesAtualizadasHoje.value = []
        medicacoesDoDia.value = []
      })
      .finally(() => {
        loading.value = false
      })
  }

  async function addAnotacao(dados) {
    loading.value = true
    error.value = ''

    try {
      const resposta = await criarAnotacao(dados)
      anotacoes.value.push(resposta.data)
      return true
    } catch (erro) {
      error.value = 'Erro ao salvar anotação.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateAnotacao(id, dados) {
    loading.value = true
    error.value = ''

    try {
      const resposta = await atualizarAnotacao(id, dados)
      const indice = anotacoes.value.findIndex((anotacao) => anotacao.id === id)

      if (indice !== -1) {
        anotacoes.value[indice] = resposta.data
      }

      return true
    } catch (erro) {
      error.value = 'Erro ao atualizar anotação.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function removeAnotacao(id) {
    loading.value = true
    error.value = ''

    try {
      await excluirAnotacao(id)
      anotacoes.value = anotacoes.value.filter((anotacao) => anotacao.id !== id)
      return true
    } catch (erro) {
      error.value = 'Erro ao excluir anotação.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    anotacoes,
    anotacoesAtualizadasHoje,
    medicacoesDoDia,
    loading,
    error,
    anotacoesPorResidente,
    anotacoesDoDia,
    anotacoesPorCategoria,
    fetchAnotacoes,
    fetchResumoDoDia,
    addAnotacao,
    updateAnotacao,
    removeAnotacao,
  }
})
