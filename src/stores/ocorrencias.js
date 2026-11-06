import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  listarOcorrencias,
  criarOcorrencia,
  atualizarOcorrencia as atualizarOcorrenciaApi,
} from '../api/ocorrencias.js'

export const useOcorrenciasStore = defineStore('ocorrencias', () => {
  const ocorrencias = ref([])
  const loading = ref(false)
  const salvando = ref(false)
  const error = ref('')

  function fetchOcorrencias() {
    loading.value = true
    error.value = ''

    return listarOcorrencias()
      .then((resposta) => {
        ocorrencias.value = resposta.data.results || resposta.data || []
      })
      .catch(() => {
        error.value = 'Erro ao carregar ocorrências. Tente novamente.'
        ocorrencias.value = []
      })
      .finally(() => {
        loading.value = false
      })
  }

  function addOcorrencia(dados) {
    salvando.value = true
    error.value = ''

    return criarOcorrencia(dados)
      .then((resposta) => {
        ocorrencias.value.unshift(resposta.data)
        return resposta.data
      })
      .catch(() => {
        error.value = 'Erro ao salvar ocorrência. Tente novamente.'
        return null
      })
      .finally(() => {
        salvando.value = false
      })
  }

  function atualizarOcorrencia(id, dados) {
    salvando.value = true
    error.value = ''

    return atualizarOcorrenciaApi(id, dados)
      .then((resposta) => {
        const indice = ocorrencias.value.findIndex((item) => item.id === id)

        if (indice === -1) {
          ocorrencias.value.unshift(resposta.data)
        } else {
          ocorrencias.value.splice(indice, 1, resposta.data)
        }

        return resposta.data
      })
      .catch(() => {
        error.value = 'Erro ao atualizar ocorrência. Tente novamente.'
        return null
      })
      .finally(() => {
        salvando.value = false
      })
  }

  return {
    ocorrencias,
    loading,
    salvando,
    error,
    fetchOcorrencias,
    addOcorrencia,
    atualizarOcorrencia,
  }
})
