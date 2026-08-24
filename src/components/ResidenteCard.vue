<template>
  <div
    class="residente-card"
    role="button"
    tabindex="0"
    :title="`Ver perfil de ${residente.nome_completo}`"
    @click="irParaPerfil"
    @keydown.enter="irParaPerfil"
  >
    <div class="residente-foto" :class="{ 'residente-foto--vazia': !residente.foto }">
      <img v-if="!!residente.foto" :src="residente.foto.url" class="residente-img" />

      <svg
        v-else
        class="icone-foto-vazia"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 8a2 2 0 0 1 2-2h1.17a2 2 0 0 0 1.63-.84l.4-.57A2 2 0 0 1 10.8 3.6h2.4a2 2 0 0 1 1.6.98l.4.57A2 2 0 0 0 16.83 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
          stroke="#ffffff"
          stroke-width="1.4"
        />
        <circle cx="12" cy="13" r="3.2" stroke="#ffffff" stroke-width="1.4" />
      </svg>
    </div>

    <div class="residente-corpo">
      <span class="residente-nome">{{ residente.nome_completo }}</span>
      <span class="residente-meta">Quarto {{ residente.quarto || '—' }} · {{ rotuloGrau }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const { residente } = defineProps({
  residente: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

const rotuloGrau = computed(() => {
  const numero = parseInt(String(residente.grau_dependencia ?? '').replace(/\D/g, ''), 10)

  return Number.isNaN(numero) || !numero ? 'Sem grau' : `Grau ${numero}`
})

function irParaPerfil() {
  router.push(`/residente/${residente.id}`)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* Card minimalista: foto, identificação e nada além disso.
   O clique em qualquer área leva ao perfil. */
.residente-card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.residente-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.26);
}

.residente-card:focus-visible {
  outline: 3px solid rgba(143, 190, 74, 0.9);
  outline-offset: 2px;
}

.residente-foto {
  width: 100%;
  height: 140px;
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.residente-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}

.residente-card:hover .residente-img {
  transform: scale(1.04);
}

.icone-foto-vazia {
  width: 38px;
  height: 38px;
  opacity: 0.5;
}

.residente-corpo {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 14px 14px 14px;
}

.residente-nome {
  color: #2e5d2e;
  font-size: 13px;
  font-weight: bold;
  line-height: 1.3;
}

.residente-meta {
  color: #6b7d6f;
  font-size: 11.5px;
}
</style>
