import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useDadosMedicosStore = defineStore('dadosmedicos', () => {
  const dadosMedicos = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchPorResidente(residenteId) {
    loading.value = true
    error.value = ''

    try {
      const resposta = await api.get('/dadosmedicos/', {
        params: { residente: residenteId },
      })

      const lista = resposta.data.results || resposta.data || []
      dadosMedicos.value = lista.length > 0 ? lista[0] : null
    } catch (erro) {
      error.value = 'Erro ao carregar dados médicos. Tente novamente.'
      dadosMedicos.value = null
    } finally {
      loading.value = false
    }
  }

  async function criarDadosMedicos(dados) {
    loading.value = true
    error.value = ''

    try {
      const resposta = await api.post('/dadosmedicos/', dados)
      dadosMedicos.value = resposta.data
      return true
    } catch (erro) {
      error.value = 'Erro ao salvar dados médicos.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function atualizarDadosMedicos(id, dados) {
    loading.value = true
    error.value = ''

    try {
      const resposta = await api.patch(`/dadosmedicos/${id}/`, dados)
      dadosMedicos.value = resposta.data
      return true
    } catch (erro) {
      error.value = 'Erro ao atualizar dados médicos.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    dadosMedicos,
    loading,
    error,
    fetchPorResidente,
    criarDadosMedicos,
    atualizarDadosMedicos,
  }
})
