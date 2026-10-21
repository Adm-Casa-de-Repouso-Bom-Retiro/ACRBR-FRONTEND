import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useCuidadosPessoaisStore = defineStore('cuidadospessoais', () => {
  const cuidadosPessoais = ref(null)
  const loading = ref(false)
  const error = ref('')

  async function fetchPorResidente(residenteId) {
    loading.value = true
    error.value = ''

    try {
      const resposta = await api.get('/cuidadospessoais/', {
        params: { residente: residenteId },
      })

      const lista = resposta.data.results || resposta.data || []
      cuidadosPessoais.value = lista.length > 0 ? lista[0] : null
    } catch (erro) {
      error.value = 'Erro ao carregar cuidados pessoais. Tente novamente.'
      cuidadosPessoais.value = null
    } finally {
      loading.value = false
    }
  }

  async function criarCuidadosPessoais(dados) {
    loading.value = true
    error.value = ''

    try {
      const resposta = await api.post('/cuidadospessoais/', dados)
      cuidadosPessoais.value = resposta.data
      return true
    } catch (erro) {
      error.value = 'Erro ao salvar cuidados pessoais.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function atualizarCuidadosPessoais(id, dados) {
    loading.value = true
    error.value = ''

    try {
      const resposta = await api.patch(`/cuidadospessoais/${id}/`, dados)
      cuidadosPessoais.value = resposta.data
      return true
    } catch (erro) {
      error.value = 'Erro ao atualizar cuidados pessoais.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    cuidadosPessoais,
    loading,
    error,
    fetchPorResidente,
    criarCuidadosPessoais,
    atualizarCuidadosPessoais,
  }
})
