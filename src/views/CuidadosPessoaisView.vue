<template>
  <div class="cuidados-container">

    <div class="topo">
      <div class="titulo-area">
        <div class="avatar-placeholder"></div>

        <h1 class="card-title">
          Cuidados Pessoais - {{ residente.nome }}
        </h1>
      </div>

      <button
        type="button"
        class="btn-editar"
        :disabled="salvando"
        @click="editarOuSalvar"
      >
        {{
          salvando
            ? 'SALVANDO...'
            : editando
              ? 'SALVAR DADOS'
              : 'EDITAR DADOS'
        }}
      </button>
    </div>

    <div class="grid-sections">

      <div class="coluna">

        <section class="box">

          <div class="box-header">
            <h2>Higiene:</h2>

            <div class="col-labels">
              <span>Sim</span>
              <span>Não</span>
            </div>
          </div>

          <div
            v-for="item in higieneItems"
            :key="item.key"
            class="check-row"
          >
            <span>{{ item.label }}</span>

            <div class="check-pair">

              <button
                type="button"
                class="check-box"
                :class="{
                  active: cuidados.higiene[item.key] === true
                }"
                :disabled="!editando || salvando"
                @click="alternarValor('higiene', item.key, true)"
              ></button>

              <button
                type="button"
                class="check-box"
                :class="{
                  active: cuidados.higiene[item.key] === false
                }"
                :disabled="!editando || salvando"
                @click="alternarValor('higiene', item.key, false)"
              ></button>

            </div>
          </div>

        </section>

      </div>

      <div class="coluna">

        <section class="box">

          <div class="box-header">
            <h2>Locomoção:</h2>

            <div class="col-labels">
              <span>Sim</span>
              <span>Não</span>
            </div>
          </div>

          <div
            v-for="item in locomocaoItems"
            :key="item.key"
            class="check-row"
          >
            <span>{{ item.label }}</span>

            <div class="check-pair">

              <button
                type="button"
                class="check-box"
                :class="{
                  active: cuidados.locomocao[item.key] === true
                }"
                :disabled="!editando || salvando"
                @click="alternarValor('locomocao', item.key, true)"
              ></button>

              <button
                type="button"
                class="check-box"
                :class="{
                  active: cuidados.locomocao[item.key] === false
                }"
                :disabled="!editando || salvando"
                @click="alternarValor('locomocao', item.key, false)"
              ></button>

            </div>
          </div>

        </section>

        <section class="box">

          <div class="box-header">
            <h2>Alimentação:</h2>

            <div class="col-labels">
              <span>Sim</span>
              <span>Não</span>
            </div>
          </div>

          <div
            v-for="item in alimentacaoItems"
            :key="item.key"
            class="check-row"
          >
            <span>{{ item.label }}</span>

            <div class="check-pair">

              <button
                type="button"
                class="check-box"
                :class="{
                  active: cuidados.alimentacao[item.key] === true
                }"
                :disabled="!editando || salvando"
                @click="alternarValor('alimentacao', item.key, true)"
              ></button>

              <button
                type="button"
                class="check-box"
                :class="{
                  active: cuidados.alimentacao[item.key] === false
                }"
                :disabled="!editando || salvando"
                @click="alternarValor('alimentacao', item.key, false)"
              ></button>

            </div>
          </div>

        </section>

      </div>

    </div>

    <section class="box box-observacoes">

      <h2>Observações:</h2>

      <textarea
        v-model="cuidados.observacoes"
        :disabled="salvando"
        rows="4"
        placeholder="Observações gerais sobre os cuidados pessoais do residente..."
      ></textarea>

    </section>

    <div class="rodape-divisor"></div>

    <div
      v-if="mensagem"
      class="mensagem"
      :class="mensagemTipo"
    >
      {{ mensagem }}
    </div>

  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'CuidadosPessoaisView',

  props: {
    residenteId: {
      type: [String, Number],
      default: null
    }
  },

  data() {
    return {
      editando: false,
      salvando: false,

      mensagem: '',
      mensagemTipo: '',

      residente: {
        nome: ''
      },

      cuidadosId: null,

      cuidados: {
        higiene: {
          ajudaBanho: null,
          ajudaHigieneIntima: null,
          ajudaHigieneBucal: null,
          ajudaUsarBanheiro: null,
          ajudaVestirRoupas: null
        },

        locomocao: {
          ajudaLocomocao: null,
          riscoQueda: null
        },

        alimentacao: {
          ajudaAlimentar: null,
          possuiRestricoes: null
        },

        observacoes: ''
      },

      higieneItems: [
        { key: 'ajudaBanho', label: 'Ajuda no banho?' },
        { key: 'ajudaHigieneIntima', label: 'Ajuda na higiene íntima?' },
        { key: 'ajudaHigieneBucal', label: 'Ajuda na higiene bucal?' },
        { key: 'ajudaUsarBanheiro', label: 'Ajuda ao usar o banheiro?' },
        { key: 'ajudaVestirRoupas', label: 'Ajuda para vestir roupas' }
      ],

      locomocaoItems: [
        { key: 'ajudaLocomocao', label: 'Ajuda na locomoção?' },
        { key: 'riscoQueda', label: 'Possui risco de queda?' }
      ],

      alimentacaoItems: [
        { key: 'ajudaAlimentar', label: 'Ajuda ao se alimentar?' },
        { key: 'possuiRestricoes', label: 'Possui restrições?' }
      ]
    }
  },

  computed: {
    idResidente() {
      if (
        this.residenteId !== null &&
        this.residenteId !== undefined &&
        this.residenteId !== ''
      ) {
        return this.residenteId
      }

      const params = this.$route?.params || {}
      const query = this.$route?.query || {}

      if (params.id !== undefined && params.id !== '') {
        return params.id
      }

      if (params.residenteId !== undefined && params.residenteId !== '') {
        return params.residenteId
      }

      if (query.id !== undefined && query.id !== '') {
        return query.id
      }

      if (query.residenteId !== undefined && query.residenteId !== '') {
        return query.residenteId
      }

      return null
    }
  },

  created() {
    this.carregarDados()
  },

  methods: {
    mostrarMensagem(texto, tipo = 'sucesso') {
      this.mensagem = texto
      this.mensagemTipo = tipo

      setTimeout(() => {
        this.mensagem = ''
        this.mensagemTipo = ''
      }, 3000)
    },

    editarOuSalvar() {
      if (this.salvando) {
        return
      }

      if (!this.editando) {
        this.editando = true
        this.mensagem = ''
        return
      }

      this.salvarDados()
    },

    alternarValor(secao, chave, valor) {
      if (!this.editando || this.salvando) {
        return
      }

      const valorAtual = this.cuidados[secao][chave]

      if (valorAtual === valor) {
        this.cuidados[secao][chave] = null
      } else {
        this.cuidados[secao][chave] = valor
      }
    },

    async carregarDados() {
      const id = this.idResidente

      if (id === null || id === undefined || id === '') {
        this.mostrarMensagem(
          'Não foi possível identificar o residente.',
          'erro'
        )
        return
      }

      try {
        const respostaResidente = await api.get(`/residentes/${id}/`)

        this.residente.nome = respostaResidente.data?.nome || ''

        const respostaCuidados = await api.get('/cuidadospessoais/')

        let lista = respostaCuidados.data

        if (!Array.isArray(lista)) {
          lista = respostaCuidados.data?.results || []
        }

        const cuidado = lista.find(item => {
          if (item.residente && typeof item.residente === 'object') {
            return Number(item.residente.id) === Number(id)
          }

          return Number(item.residente) === Number(id)
        })

        if (!cuidado) {
          this.cuidadosId = null
          return
        }

        this.cuidadosId = cuidado.id

        this.cuidados.higiene.ajudaBanho = cuidado.ajuda_banho ?? null
        this.cuidados.higiene.ajudaHigieneIntima = cuidado.ajuda_higiene_intima ?? null
        this.cuidados.higiene.ajudaHigieneBucal = cuidado.ajuda_higiene_bucal ?? null
        this.cuidados.higiene.ajudaUsarBanheiro = cuidado.ajuda_usar_banheiro ?? null
        this.cuidados.higiene.ajudaVestirRoupas = cuidado.ajuda_vestir_roupas ?? null

        this.cuidados.locomocao.ajudaLocomocao = cuidado.ajuda_locomocao ?? null
        this.cuidados.locomocao.riscoQueda = cuidado.risco_queda ?? null

        this.cuidados.alimentacao.ajudaAlimentar = cuidado.ajuda_alimentar ?? null
        this.cuidados.alimentacao.possuiRestricoes = cuidado.possui_restricoes ?? null

        this.cuidados.observacoes = cuidado.observacoes || ''

      } catch (erro) {
        console.error('ERRO AO CARREGAR:', erro.response?.data || erro)

        this.mostrarMensagem('Erro ao carregar os dados.', 'erro')
      }
    },

    async salvarDados() {
      const id = this.idResidente

      if (id === null || id === undefined || id === '') {
        this.mostrarMensagem(
          'Não foi possível identificar o residente.',
          'erro'
        )
        return
      }

      if (this.salvando) {
        return
      }

      this.salvando = true
      this.mensagem = ''

      const dados = {
        residente: Number(id),

        ajuda_banho: this.cuidados.higiene.ajudaBanho,
        ajuda_higiene_intima: this.cuidados.higiene.ajudaHigieneIntima,
        ajuda_higiene_bucal: this.cuidados.higiene.ajudaHigieneBucal,
        ajuda_usar_banheiro: this.cuidados.higiene.ajudaUsarBanheiro,
        ajuda_vestir_roupas: this.cuidados.higiene.ajudaVestirRoupas,

        ajuda_locomocao: this.cuidados.locomocao.ajudaLocomocao,
        risco_queda: this.cuidados.locomocao.riscoQueda,

        ajuda_alimentar: this.cuidados.alimentacao.ajudaAlimentar,
        possui_restricoes: this.cuidados.alimentacao.possuiRestricoes,

        observacoes: this.cuidados.observacoes
      }

      try {
        let resposta

        if (this.cuidadosId) {
          resposta = await api.patch(
            `/cuidadospessoais/${this.cuidadosId}/`,
            dados
          )
        } else {
          resposta = await api.post('/cuidadospessoais/', dados)

          if (resposta.data?.id) {
            this.cuidadosId = resposta.data.id
          }
        }

        this.editando = false

        this.mostrarMensagem('Dados salvos com sucesso!', 'sucesso')

      } catch (erro) {
        console.error('ERRO AO SALVAR:', erro.response?.data || erro)

        const erroApi = erro.response?.data

        let mensagemErro = 'Não foi possível salvar os dados.'

        if (erroApi) {
          if (typeof erroApi === 'string') {
            mensagemErro = erroApi
          } else if (typeof erroApi === 'object') {
            const mensagens = Object.entries(erroApi)
              .map(([campo, valor]) => {
                if (Array.isArray(valor)) {
                  return `${campo}: ${valor.join(', ')}`
                }

                return `${campo}: ${valor}`
              })
              .join(' | ')

            if (mensagens) {
              mensagemErro = mensagens
            }
          }
        }

        this.editando = true

        this.mostrarMensagem(mensagemErro, 'erro')

      } finally {
        this.salvando = false
      }
    }
  }
}
</script>

<style scoped>
.cuidados-container {
  width: 100%;
  background-color: #2c5a34;
  color: #fff;
  padding: 28px 40px 32px;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
}

.topo {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.titulo-area {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.avatar-placeholder {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 50%;
  background: #d9d9d9;
}

.card-title {
  background: #24492b;
  padding: 9px 18px;
  border-radius: 6px;
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
}

.btn-editar {
  flex-shrink: 0;
  background: #7bb662;
  color: #fff;
  border: none;
  padding: 9px 18px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.8rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
  transition: filter 0.15s ease, opacity 0.15s ease;
}

.btn-editar:hover:not(:disabled) {
  filter: brightness(1.1);
}

.btn-editar:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.grid-sections {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  column-gap: 36px;
  align-items: start;
}

.coluna {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.box {
  width: 100%;
  border: 2px solid #fff;
  border-radius: 14px;
  padding: 16px 20px;
  box-sizing: border-box;
}

.box h2 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 8px;
}

.col-labels {
  display: flex;
  gap: 18px;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.col-labels span {
  width: 18px;
  text-align: center;
}

.check-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  min-height: 30px;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 5px 0;
}

.check-row > span {
  flex: 1;
}

.check-pair {
  display: flex;
  gap: 18px;
  flex-shrink: 0;
}

.check-box {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: block;
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  max-width: 16px;
  max-height: 16px;
  flex: 0 0 auto;
  aspect-ratio: 1 / 1;
  border: 1.5px solid #fff;
  border-radius: 3px;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  outline: none;
  line-height: 0;
  font-size: 0;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.check-box:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.check-box.active {
  background: #7bb662;
  border-color: #7bb662;
}

.check-box:disabled {
  cursor: default;
  opacity: 0.65;
}

.box-observacoes {
  width: 100%;
  max-width: 1000px;
  box-sizing: border-box;
  margin: 20px auto 0;
}

.box-observacoes h2 {
  margin-bottom: 10px;
}

textarea {
  display: block;
  width: 100%;
  min-height: 80px;
  box-sizing: border-box;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 0.8rem;
  resize: vertical;
  background: transparent;
  color: #fff;
  outline: none;
  transition: border-color 0.15s ease;
}

textarea:not(:disabled) {
  cursor: text;
}

textarea:focus {
  border-color: rgba(255, 255, 255, 0.6);
}

textarea::placeholder {
  color: rgba(255, 255, 255, 0.65);
}

textarea:disabled {
  opacity: 0.7;
  cursor: default;
}

.rodape-divisor {
  width: 100vw;
  height: 10px;
  background: #fff;
  margin-top: 32px;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.mensagem {
  position: fixed;
  right: 25px;
  bottom: 25px;
  max-width: 400px;
  padding: 12px 18px;
  border-radius: 6px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
}

.mensagem.sucesso {
  background: #3d9147;
}

.mensagem.erro {
  background: #a93636;
}

@media (max-width: 900px) {
  .cuidados-container {
    padding: 20px;
  }

  .grid-sections {
    max-width: 100%;
    column-gap: 20px;
  }
}

@media (max-width: 768px) {
  .topo {
    align-items: flex-start;
  }

  .card-title {
    white-space: normal;
    font-size: 0.85rem;
  }

  .grid-sections {
    grid-template-columns: 1fr;
    column-gap: 0;
    row-gap: 20px;
  }
}

@media (max-width: 480px) {
  .cuidados-container {
    padding: 14px;
  }

  .topo {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .btn-editar {
    align-self: flex-end;
  }

  .avatar-placeholder {
    width: 36px;
    height: 36px;
    min-width: 36px;
  }

  .box {
    padding: 12px;
  }

  .col-labels {
    gap: 10px;
  }

  .check-pair {
    gap: 10px;
  }

  .check-row {
    gap: 10px;
    font-size: 0.72rem;
  }
}
</style>