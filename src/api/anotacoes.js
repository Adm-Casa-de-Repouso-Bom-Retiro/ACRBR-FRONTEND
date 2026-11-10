import api from '@/services/api'

export function listarAnotacoes(residenteId) {
  return api.get('/anotacoes/', {
    params: {
      residente: residenteId,
      page_size: 100,
    },
  })
}

export function listarAnotacoesAtualizadasNaData(data) {
  return api.get('/anotacoes/', {
    params: {
      atualizado_em__date: data,
      page_size: 100,
    },
  })
}

export function listarMedicacoesDoDia(data) {
  return api.get('/anotacoes/', {
    params: {
      data,
      categoria: 'medicacao',
      page_size: 100,
    },
  })
}

export function criarAnotacao(dados) {
  return api.post('/anotacoes/', dados)
}

export function atualizarAnotacao(id, dados) {
  return api.patch(`/anotacoes/${id}/`, dados)
}

export function excluirAnotacao(id) {
  return api.delete(`/anotacoes/${id}/`)
}
