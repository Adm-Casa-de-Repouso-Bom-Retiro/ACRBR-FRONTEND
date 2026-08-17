<template>
  <div class="residente-card" @click="irParaPerfil" :title="`Ver perfil de ${residente.nome_completo}`">
    <div class="residente-foto" :class="{ 'residente-foto--vazia': !residente.foto }">
      <img v-if="!!residente.foto" :src="residente.foto.url" class="residente-img" />
    </div>
    <span class="residente-nome">{{ residente.nome_completo }}</span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const { residente } = defineProps({
  residente: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

function irParaPerfil() {
  // TODO: ajustar quando a rota de perfil do residente existir
  router.push(`/residente/${residente.id}`)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.residente-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.residente-foto {
  width: 90px;
  height: 90px;
  border-radius: 10px;
  background: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.residente-card:hover .residente-foto {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.residente-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.residente-nome {
  font-size: 12px;
  font-weight: bold;
  color: #000000;
  text-align: center;
}
</style>