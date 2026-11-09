import api from '@/services/api'

export function listarOcorrencias() {
  return api.get('/ocorrencias/', { params: { page_size: 100 } })
}

export function criarOcorrencia(dados) {
  return api.post('/ocorrencias/', dados)
}

export function atualizarOcorrencia(id, dados) {
  return api.patch(`/ocorrencias/${id}/`, dados)
}

export function excluirOcorrencia(id) {
  return api.delete(`/ocorrencias/${id}/`)
}
