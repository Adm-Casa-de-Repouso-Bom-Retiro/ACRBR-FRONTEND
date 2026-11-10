import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '../services/api.js'

export const useAplicacoesStore = defineStore('aplicacoes', () => {
  const aplicacoes = ref([])
  const loading = ref(false)
  const error = ref('')

  function fetchAplicacoes(data) {
    loading.value = true
    error.value = ''

    return api
      .get('/aplicacoes/', { params: { data_hora_prevista__date: data, page_size: 100 } })
      .then((resposta) => {
        aplicacoes.value = resposta.data.results || resposta.data || []
      })
      .catch(() => {
        error.value = 'Erro ao carregar aplicações de medicamentos. Tente novamente.'
        aplicacoes.value = []
      })
      .finally(() => {
        loading.value = false
      })
  }

  return {
    aplicacoes,
    loading,
    error,
    fetchAplicacoes,
  }
})
