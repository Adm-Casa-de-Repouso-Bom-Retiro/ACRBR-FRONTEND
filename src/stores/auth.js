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

  async function atualizarPerfil(dados) {
    if (!usuario.value?.id) {
      error.value = 'Usuário não identificado.'
      return false
    }

    loading.value = true
    error.value = ''

    try {
      await api.patch(`/administradores/${usuario.value.id}/`, dados)
      await fetchUsuario()
      return true
    } catch (erro) {
      error.value = 'Erro ao atualizar perfil.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    usuario,
    loading,
    error,
    estaLogado,
    fetchUsuario,
    atualizarPerfil,
    logout,
  }
})
