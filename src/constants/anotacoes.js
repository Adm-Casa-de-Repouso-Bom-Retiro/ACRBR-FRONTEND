export const CATEGORIAS_ANOTACAO = [
  {
    valor: 'geral',
    rotulo: 'Geral',
    classe: 'categoria-geral',
  },
  {
    valor: 'saude',
    rotulo: 'Saúde',
    classe: 'categoria-saude',
  },
  {
    valor: 'medicacao',
    rotulo: 'Medicação',
    classe: 'categoria-medicacao',
  },
  {
    valor: 'alimentacao',
    rotulo: 'Alimentação',
    classe: 'categoria-alimentacao',
  },
  {
    valor: 'atividade',
    rotulo: 'Atividade',
    classe: 'categoria-atividade',
  },
  {
    valor: 'visita',
    rotulo: 'Visita',
    classe: 'categoria-visita',
  },
]

export const STATUS_ANOTACAO = [
  {
    valor: 'pendente',
    rotulo: 'Pendente',
    classe: 'status-pendente',
  },
  {
    valor: 'concluido',
    rotulo: 'Concluído',
    classe: 'status-concluido',
  },
  {
    valor: 'nao_concluido',
    rotulo: 'Não concluído',
    classe: 'status-nao-concluido',
  },
]

export const STATUS_ANOTACAO_PADRAO = 'pendente'

export function obterStatusAnotacao(valor) {
  return STATUS_ANOTACAO.find((status) => status.valor === valor) || STATUS_ANOTACAO[0]
}

export const CARGOS_COM_EDICAO = ['chefe', 'gerente', 'cuidador']
