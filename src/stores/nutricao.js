import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api.js'

export const useNutricaoStore = defineStore('nutricao', () => {
  const nutricoes = ref([])
  const loading = ref(false)
  const error = ref('')

  async function fetchNutricoes(residenteId) {
    loading.value = true
    error.value = ''

    try {
      if (!residenteId) {
        error.value = 'Residente não identificado.'
        nutricoes.value = []
        return
      }

      const respostaResidente = await api.get(`/residentes/${residenteId}/`)
      const respostaDadosMedicos = await api.get('/dadosmedicos/', {
        params: { residente: residenteId, page_size: 100 },
      })
      const respostaAvaliacoes = await api.get('/avaliacaonutricionais/', {
        params: { residente: residenteId, page_size: 100 },
      })
      const residente = respostaResidente.data
      const dadosMedicosLista = respostaDadosMedicos.data.results || respostaDadosMedicos.data || []
      const dadosMedicos = dadosMedicosLista[0] || null
      const avaliacoes = respostaAvaliacoes.data.results || respostaAvaliacoes.data || []

      let avaliacao = null

      avaliacoes
        .filter((item) => String(item.residente) === String(residenteId))
        .forEach((item) => {
          if (
            !avaliacao ||
            String(item.data_avaliacao || '') >= String(avaliacao.data_avaliacao || '')
          ) {
            avaliacao = item
          }
        })

      const alturaCm = dadosMedicos ? Number(dadosMedicos.altura) : 0

      nutricoes.value = [
        {
          id: residente.id,
          nome: residente.nome_completo,
          foto: residente.foto,
          avaliacao_id: avaliacao ? avaliacao.id : null,
          peso: dadosMedicos ? dadosMedicos.peso : null,
          altura: alturaCm > 0 ? alturaCm / 100 : null,
          altura_cm: alturaCm > 0 ? alturaCm : null,
          plano_alimentar: avaliacao ? avaliacao.dieta_prescrita : '',
          observacoes: avaliacao ? avaliacao.restricoes_alimentares : '',
          data_avaliacao: avaliacao ? avaliacao.data_avaliacao : '',
        },
      ]
    } catch (erro) {
      error.value = 'Erro ao carregar nutrição. Tente novamente.'
      nutricoes.value = []
    } finally {
      loading.value = false
    }
  }

  async function salvarNutricao(residenteId, dados) {
    const atual = nutricoes.value[0]

    if (!atual) {
      error.value = 'Residente não identificado.'
      return false
    }

    const peso = Number(atual.peso)
    const alturaCm = Number(atual.altura_cm)

    if (
      !atual.peso ||
      !atual.altura_cm ||
      Number.isNaN(peso) ||
      Number.isNaN(alturaCm) ||
      peso <= 0 ||
      alturaCm <= 0
    ) {
      error.value = 'Preencha peso e altura em Dados Médicos antes de salvar.'
      return false
    }

    if (!dados.data_avaliacao) {
      error.value = 'Informe a data da avaliação.'
      return false
    }

    loading.value = true
    error.value = ''

    try {
      const altura = alturaCm / 100
      const imc = (peso / (altura * altura)).toFixed(1)
      const payload = {
        residente: Number(residenteId),
        peso_kg: peso,
        altura_cm: alturaCm,
        imc: imc,
        dieta_prescrita: dados.plano_alimentar || '',
        restricoes_alimentares: dados.observacoes || '',
        data_avaliacao: dados.data_avaliacao,
      }

      if (atual.avaliacao_id) {
        await api.patch(`/avaliacaonutricionais/${atual.avaliacao_id}/`, payload)
      } else {
        await api.post('/avaliacaonutricionais/', payload)
      }

      await fetchNutricoes(residenteId)
      return !error.value
    } catch (erro) {
      error.value = 'Erro ao salvar nutrição. Tente novamente.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    nutricoes,
    loading,
    error,
    fetchNutricoes,
    salvarNutricao,
  }
})
