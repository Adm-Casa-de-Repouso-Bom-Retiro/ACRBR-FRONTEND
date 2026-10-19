import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useResidentesStore = defineStore('residentes', () => {
  const residentes = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchResidentes() {
    loading.value = true
    error.value = ''

    try {
      const resposta = await api.get('/residentes/', { params: { page_size: 100 } })
      residentes.value = resposta.data.results
    } catch (erro) {
      error.value = 'Erro ao carregar residentes. Tente novamente.'
      residentes.value = []
    } finally {
      loading.value = false
    }
  }

  async function atualizarResidente(id, dados) {
    loading.value = true
    error.value = ''

    try {
      await api.patch(`/residentes/${id}/`, dados)
      return true
    } catch (erro) {
      error.value = 'Erro ao atualizar residente.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    residentes,
    loading,
    error,
    fetchResidentes,
    atualizarResidente,
  }
})
