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
  background: linear-gradient(160deg, #2e5d2e 0%, #3c7039 45%, #6ba13f 100%);
  padding: 28px 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.perfil-painel {
  width: 100%;
  max-width: 1080px;
}

.perfil-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.foto-coluna {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
  width: 100%;
}

.foto-box {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #ffffff;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
}

.foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icone-foto-vazia {
  width: 48px;
  height: 48px;
  opacity: 0.55;
}

.btn-editar,
.btn-sair {
  width: 100%;
  max-width: 280px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 13px 0;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease;
}

.btn-editar {
  background: #6ba13f;
  color: #ffffff;
  border: none;
}

.btn-editar:hover {
  background: #7caf49;
  transform: translateY(-2px);
}

.btn-sair {
  background: #ffffff;
  color: #2e5d2e;
  border: none;
}

.btn-sair:hover {
  background: #e8f0e8;
}

.info-coluna {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 0;
  width: 100%;
}

.nome {
  color: #ffffff;
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  line-height: 1.15;
  text-align: center;
}

.titulo-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #2e5d2e;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.4px;
  padding: 7px 20px;
  border-radius: 999px;
}

.bloco-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
}

.linha-info {
  color: #4a5f4e;
  font-size: 14px;
  margin: 0;
  text-align: center;
}

.label {
  font-weight: 700;
  color: #2e5d2e;
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

@media (min-width: 768px) {
  .main-content {
    background: #2e5d2e;
    padding: 48px 60px 56px 60px;
  }

  .perfil-painel {
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.045);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
    padding: 52px 58px;
  }

  .perfil-card {
    flex-direction: row;
    gap: 56px;
    align-items: flex-start;
  }

  .foto-coluna {
    max-width: 260px;
    gap: 16px;
  }

  .foto-box {
    width: 260px;
    height: 290px;
    border-radius: 10px;
    border: none;
    box-shadow: none;
  }

  .icone-foto-vazia {
    width: 64px;
    height: 64px;
  }

  .btn-editar,
  .btn-sair {
    max-width: none;
    border-radius: 7px;
    font-size: 12px;
    padding: 12px 0;
  }

  .btn-sair {
    background: transparent;
    color: #ffffff;
    border: 1.5px solid rgba(255, 255, 255, 0.7);
  }

  .btn-sair:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .info-coluna {
    align-items: flex-start;
    gap: 24px;
  }

  .nome {
    font-size: 28px;
    font-weight: 600;
    text-align: left;
  }

  .titulo-pill {
    background: #6ba13f;
    color: #ffffff;
    font-size: 17px;
    padding: 10px 26px;
    border-radius: 6px;
  }

  .bloco-info {
    gap: 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.4);
    padding-top: 22px;
    background: transparent;
    border-radius: 0;
    box-shadow: none;
  }

  .linha-info {
    color: #ffffff;
    font-size: 15px;
    text-align: left;
  }

  .label {
    color: #ffffff;
  }
}
</style>
