import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(null)
  const loading = ref(false)
  const error = ref('')

  function estaLogado() {
    return !!localStorage.getItem('access_token')
  }

  async function fetchUsuario() {
    loading.value = true
    error.value = ''

    try {
      const resposta = await api.get('/administradores/me/')
      usuario.value = resposta.data
    } catch (erro) {
      error.value = 'Erro ao carregar usuário.'
      usuario.value = null
    } finally {
      loading.value = false
    }
  }

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    usuario.value = null
  }

  return {
    usuario,
    loading,
    error,
    estaLogado,
    fetchUsuario,
    logout,
  }
})
