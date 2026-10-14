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
      const resposta = await api.get('/residentes/')
      residentes.value = resposta.data.results
    } catch (erro) {
      error.value = 'Erro ao carregar residentes. Tente novamente.'
      residentes.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    residentes,
    loading,
    error,
    fetchResidentes,
  }
})
