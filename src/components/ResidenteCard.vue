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

      <div class="residente-chips">
        <span class="chip">Quarto {{ residente.quarto || '—' }}</span>
        <span class="chip">{{ rotuloGrau }}</span>
      </div>
    </div>

    <span class="residente-seta">→</span>
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

/* Card mobile: linha com foto à esquerda e metadados, estilo app. */
.residente-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border-radius: 16px;
  padding: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.residente-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.14);
}

.residente-card:focus-visible {
  outline: 3px solid rgba(143, 190, 74, 0.9);
  outline-offset: 2px;
}

.residente-foto {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 12px;
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
}

.icone-foto-vazia {
  width: 24px;
  height: 24px;
  opacity: 0.5;
}

.residente-corpo {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.residente-nome {
  color: #2e5d2e;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.residente-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  background: #eef4ec;
  color: #4a5f4e;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
}

.residente-seta {
  color: #6ba13f;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}

/* Desktop: card em coluna (foto grande no topo). */
@media (min-width: 768px) {
  .residente-card {
    flex-direction: column;
    align-items: stretch;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
  }

  .residente-foto {
    width: 100%;
    height: 140px;
    border-radius: 0;
  }

  .icone-foto-vazia {
    width: 38px;
    height: 38px;
  }

  .residente-corpo {
    padding: 12px 14px 14px 14px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .residente-nome {
    white-space: normal;
  }

  .residente-seta {
    display: none;
  }
}
</style>
