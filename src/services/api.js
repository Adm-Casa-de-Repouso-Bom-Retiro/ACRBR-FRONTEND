import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

let renovacaoEmAndamento = null

async function renovarAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token')

  if (!refreshToken) return null

  const resposta = await axios.post(`${import.meta.env.VITE_API_URL}token/refresh/`, {
    refresh: refreshToken,
  })

  const novoAccess = resposta.data?.access

  if (!novoAccess) return null

  localStorage.setItem('access_token', novoAccess)

  if (resposta.data?.refresh) {
    localStorage.setItem('refresh_token', resposta.data.refresh)
  }

  return novoAccess
}

function encerrarSessao() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  window.location.assign('/login')
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const ehRotaDeAuth = typeof original?.url === 'string' && original.url.includes('/token')

    if (status !== 401 || !original || original._repetida || ehRotaDeAuth) {
      return Promise.reject(error)
    }

    try {
      renovacaoEmAndamento = renovacaoEmAndamento || renovarAccessToken()
      const novoAccess = await renovacaoEmAndamento

      if (!novoAccess) {
        encerrarSessao()
        return Promise.reject(error)
      }

      original.headers.Authorization = `Bearer ${novoAccess}`
      original._repetida = true

      return api(original)
    } catch (erroRenovacao) {
      encerrarSessao()
      return Promise.reject(erroRenovacao)
    } finally {
      renovacaoEmAndamento = null
    }
  },
)

export async function uploadImagem(arquivo, descricao = '') {
  const formData = new FormData()
  formData.append('file', arquivo)
  formData.append('description', descricao)

  const resposta = await api.post('/media/images/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return resposta.data
}

export default api
