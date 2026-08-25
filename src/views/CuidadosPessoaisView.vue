<template>
  <div class="cuidados-page">
    <main class="main-content">
      <section class="cuidados-painel">
        <div class="card-header">
          <div class="header-left">
            <div class="avatar" :class="{ 'avatar--foto': residente.foto }">
              <img
                v-if="residente.foto"
                :src="residente.foto.url"
                alt="Foto do residente"
                class="avatar-img"
              />

              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="avatar-icone"
              >
                <path
                  d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 2.1c-3.5 0-7 1.76-7 5.25V21h14v-1.65c0-3.49-3.5-5.25-7-5.25Z"
                  fill="#ffffff"
                  opacity="0.75"
                />
              </svg>
            </div>

            <div class="titulo-pill">
              <span>Cuidados Pessoais - {{ residente.nome }}</span>
            </div>
          </div>

          <button
            class="btn-editar"
            :class="{ 'btn-editar--cancelar': editando }"
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
                  <span>Nao</span>
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
                <h2>Locomocao:</h2>

                <div class="col-labels">
                  <span>Sim</span>
                  <span>Nao</span>
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
                <h2>Alimentacao:</h2>

                <div class="col-labels">
                  <span>Sim</span>
                  <span>Nao</span>
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
          <h2>Observacoes:</h2>

          <textarea
            v-model="cuidados.observacoes"
            :disabled="!editando || salvando"
            rows="4"
            placeholder="Observacoes gerais sobre os cuidados pessoais do residente..."
          ></textarea>
        </section>

        <p v-if="mensagem" class="msg-erro" :class="{ 'msg-sucesso': mensagemTipo === 'sucesso' }">
          {{ mensagem }}
        </p>
      </section>
    </main>

    <div class="linha-divisoria"></div>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'CuidadosPessoaisView',

  props: {
    id: {
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
        nome: '',
        foto: null
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
        { key: 'ajudaHigieneIntima', label: 'Ajuda na higiene intima?' },
        { key: 'ajudaHigieneBucal', label: 'Ajuda na higiene bucal?' },
        { key: 'ajudaUsarBanheiro', label: 'Ajuda ao usar o banheiro?' },
        { key: 'ajudaVestirRoupas', label: 'Ajuda para vestir roupas' }
      ],

      locomocaoItems: [
        { key: 'ajudaLocomocao', label: 'Ajuda na locomocao?' },
        { key: 'riscoQueda', label: 'Possui risco de queda?' }
      ],

      alimentacaoItems: [
        { key: 'ajudaAlimentar', label: 'Ajuda ao se alimentar?' },
        { key: 'possuiRestricoes', label: 'Possui restricoes?' }
      ]
    }
  },

  computed: {
    idResidente() {
      if (this.id !== null && this.id !== undefined && this.id !== '') {
        return this.id
      }

      const params = this.$route?.params || {}
      const query = this.$route?.query || {}

      if (params.id !== undefined && params.id !== '') {
        return params.id
      }

      if (query.id !== undefined && query.id !== '') {
        return query.id
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
          'Nao foi possivel identificar o residente.',
          'erro'
        )
        return
      }

      try {
        const respostaResidente = await api.get(`/residentes/${id}/`)

        const dadosResidente = respostaResidente.data || {}
        this.residente.nome = dadosResidente.nome_completo || dadosResidente.nome || ''
        this.residente.foto = dadosResidente.foto || null

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
          'Nao foi possivel identificar o residente.',
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

        let mensagemErro = 'Nao foi possivel salvar os dados.'

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
* {
  box-sizing: border-box;
}

.cuidados-page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: #2e5d2e;
  padding: 48px 60px 56px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cuidados-painel {
  width: 100%;
  max-width: 1080px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.045);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  padding: 52px 58px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-icone {
  width: 24px;
  height: 24px;
}

.avatar--foto {
  background: #d9d9d9;
  border-color: #ffffff;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.titulo-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #6ba13f;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 10px 26px;
  border-radius: 6px;
}

.btn-editar {
  flex-shrink: 0;
  background: #6ba13f;
  color: #ffffff;
  border: none;
  padding: 11px 26px;
  border-radius: 7px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.btn-editar:hover:not(:disabled) {
  background: #7caf49;
  transform: translateY(-2px);
}

.btn-editar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-editar--cancelar {
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
}

.btn-editar--cancelar:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.grid-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
  align-items: start;
  margin-bottom: 28px;
}

.coluna {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.box {
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 16px 20px;
}

.box h2 {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.6px;
  color: #ffffff;
  line-height: 1.2;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.col-labels {
  display: flex;
  gap: 18px;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.6px;
  color: rgba(255, 255, 255, 0.7);
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
  min-height: 32px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
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
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  max-width: 18px;
  max-height: 18px;
  flex: 0 0 auto;
  aspect-ratio: 1 / 1;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  border-radius: 4px;
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
  background: rgba(255, 255, 255, 0.15);
}

.check-box.active {
  background: #8fbe4a;
  border-color: #8fbe4a;
}

.check-box:disabled {
  cursor: default;
  opacity: 0.65;
}

.box-observacoes {
  margin-top: 4px;
}

.box-observacoes h2 {
  margin-bottom: 10px;
}

textarea {
  display: block;
  width: 100%;
  min-height: 80px;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 10px 12px;
  font-family: inherit;
  font-size: 13px;
  resize: vertical;
  color: #1e3e1e;
  background: #ffffff;
  outline: none;
  transition: box-shadow 0.15s ease;
}

textarea:focus:not(:disabled) {
  border-color: #8fbe4a;
  box-shadow: 0 0 0 3px rgba(143, 190, 74, 0.35);
}

textarea::placeholder {
  color: #8fa093;
}

textarea:disabled {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.25);
  color: #f0f0f0;
  cursor: default;
}

.msg-erro {
  color: #ffdada;
  font-size: 13px;
  margin: 16px 0 0 0;
}

.msg-sucesso {
  color: #d9f2c2;
  font-size: 13px;
  font-weight: 700;
  margin: 16px 0 0 0;
}

.linha-divisoria {
  height: 8px;
  background: #ffffff;
  width: 100%;
}

@media (max-width: 900px) {
  .main-content {
    padding: 28px 20px 40px 20px;
  }

  .cuidados-painel {
    padding: 32px 26px;
  }

  .grid-sections {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-editar {
    align-self: flex-start;
  }

  .grid-sections {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .cuidados-painel {
    padding: 20px 16px;
  }

  .titulo-pill {
    font-size: 14px;
    padding: 8px 18px;
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
    font-size: 12px;
  }
}
</style>
