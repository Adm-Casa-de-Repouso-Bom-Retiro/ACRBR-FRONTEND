<template>
  <div class="perfil-funcionario-page">
    <main class="main-content">
      <section class="perfil-painel">
        <div class="perfil-card">
          <div class="foto-coluna">
            <div class="foto-box" :class="{ 'foto-box--vazia': !administrador.foto_url }">
              <img
                v-if="administrador.foto_url"
                :src="administrador.foto_url"
                alt="Foto de perfil"
                class="foto-img"
              />

              <svg
                v-else
                class="icone-foto-vazia"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 2.1c-3.5 0-7 1.76-7 5.25V21h14v-1.65c0-3.49-3.5-5.25-7-5.25Z"
                  fill="#ffffff"
                  opacity="0.75"
                />
              </svg>
            </div>

            <button class="btn-editar" @click="$router.push('/editar-perfil')">EDITAR CONTA</button>

            <button class="btn-sair" @click="sair">SAIR DA CONTA</button>
          </div>

          <div class="info-coluna">
            <h1 class="nome">{{ administrador.nome || '...' }}</h1>

            <div class="titulo-pill">
              <span>{{ cargoFormatado }}</span>
            </div>

            <div class="bloco-info">
              <p class="linha-info">
                <span class="label">E-mail:</span>
                <span class="valor">{{ administrador.email || '...' }}</span>
              </p>

              <p class="linha-info">
                <span class="label">Telefone:</span>
                <span class="valor">{{ telefoneFormatado }}</span>
              </p>

              <p class="linha-info">
                <span class="label">Data de Registro:</span>
                <span class="valor">{{ dataFormatada }}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <div class="linha-divisoria"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const administrador = ref({})

const cargoFormatado = computed(() => {
  const cargos = {
    chefe: 'Chefe',
    gerente: 'Gerente',
    nutricionista: 'Nutricionista',
    cuidador: 'Cuidador',
  }

  return cargos[administrador.value.cargo] || administrador.value.cargo || '...'
})

const telefoneFormatado = computed(() => {
  const tel = (administrador.value.telefone || '').replace(/\D/g, '')

  if (tel.length === 11) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`
  }

  if (tel.length === 10) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`
  }

  return administrador.value.telefone || '...'
})

const dataFormatada = computed(() => {
  const data = administrador.value.data_registro

  if (!data) return '...'

  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
})

async function buscarDados() {
  try {
    const response = await api.get('/administradores/me/')
    administrador.value = response.data
  } catch (error) {
    router.push('/login')
  }
}

onMounted(buscarDados)

function sair() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  router.push('/login')
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.perfil-funcionario-page {
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

/* Painel: mesmo tratamento de card usado no perfil do residente,
   para que as duas telas leiam como parte do mesmo sistema. */
.perfil-painel {
  width: 100%;
  max-width: 1080px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.045);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  padding: 52px 58px;
}

.perfil-card {
  display: flex;
  gap: 56px;
  align-items: flex-start;
}

.foto-coluna {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.foto-box {
  width: 260px;
  height: 290px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icone-foto-vazia {
  width: 64px;
  height: 64px;
  opacity: 0.55;
}

.btn-editar {
  width: 100%;
  background: #6ba13f;
  color: #ffffff;
  border: none;
  padding: 12px 0;
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

.btn-editar:hover {
  background: #7caf49;
  transform: translateY(-2px);
}

.btn-sair {
  width: 100%;
  background: transparent;
  color: #ffffff;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  padding: 11px 0;
  border-radius: 7px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.btn-sair:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #ffffff;
}

.info-coluna {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.nome {
  color: #ffffff;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  line-height: 1.15;
}

.titulo-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  background: #6ba13f;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 10px 26px;
  border-radius: 6px;
}

.bloco-info {
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  padding-top: 22px;
}

.linha-info {
  color: #ffffff;
  font-size: 15px;
  margin: 0;
}

.label {
  font-weight: 700;
  margin-right: 6px;
}

.valor {
  font-weight: 400;
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

  .perfil-painel {
    padding: 32px 26px;
  }

  .perfil-card {
    flex-direction: column;
    align-items: center;
  }

  .foto-coluna {
    width: 100%;
    max-width: 260px;
  }

  .foto-box {
    width: 100%;
    height: 220px;
  }
}
</style>
