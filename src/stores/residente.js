import { defineStore } from 'pinia'
import { ref } from 'vue'

const perfilInicial = () => ({
  nome: '',
  data_nascimento: '',
  data_entrada: '',
  quarto: '',
  grau_dependencia: 'grau_1',
  observacoes: '',
})

export const useResidenteStore = defineStore('residente', () => {
  const perfil = ref(perfilInicial())

  const responsavel1 = ref('')
  const telefone1 = ref('')
  const grauParentesco1 = ref('')
  const responsavel2 = ref('')
  const telefone2 = ref('')
  const grauParentesco2 = ref('')

  const fotoArquivo = ref(null)
  const fotoPreview = ref('')

  function limpar() {
    perfil.value = perfilInicial()
    responsavel1.value = ''
    telefone1.value = ''
    grauParentesco1.value = ''
    responsavel2.value = ''
    telefone2.value = ''
    grauParentesco2.value = ''
    fotoArquivo.value = null
    fotoPreview.value = ''
  }

  return {
    perfil,
    responsavel1,
    telefone1,
    grauParentesco1,
    responsavel2,
    telefone2,
    grauParentesco2,
    fotoArquivo,
    fotoPreview,
    limpar,
  }
})
