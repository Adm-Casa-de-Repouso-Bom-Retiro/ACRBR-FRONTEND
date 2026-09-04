<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const autenticado = computed(() => !!localStorage.getItem('access_token'))

const itens = computed(() => {
  if (autenticado.value) {
    return [
      { rotulo: 'Início', para: '/', icone: 'inicio' },
      { rotulo: 'Prontuários', para: '/prontuario', icone: 'prontuarios' },
      { projeto: true, para: '/cadastroresidente' },
      { rotulo: 'Conta', para: '/perfilfuncionario', icone: 'conta' },
    ]
  }

  return [
    { rotulo: 'Início', para: '/', icone: 'inicio' },
    { rotulo: 'Entrar', para: '/login', icone: 'conta' },
  ]
})

function estaAtivo(para) {
  if (para === '/') return route.path === '/'
  return route.path.startsWith(para)
}

function navegar(para) {
  router.push(para)
}
</script>

<template>
  <nav class="bottom-nav">
    <template v-for="item in itens" :key="item.para">
      <button
        v-if="!item.projeto"
        type="button"
        class="nav-item"
        :class="{ ativo: estaAtivo(item.para) }"
        @click="navegar(item.para)"
      >
        <svg class="nav-icone" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            v-if="item.icone === 'inicio'"
            d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3v-10.5Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            v-else-if="item.icone === 'prontuarios'"
            d="M6 2h9l5 5v15H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            v-else-if="item.icone === 'conta'"
            d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 2.1c-3.5 0-7 1.76-7 5.25V21h14v-1.65c0-3.49-3.5-5.25-7-5.25Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
        <span class="nav-rotulo">{{ item.rotulo }}</span>
      </button>

      <button
        v-else
        type="button"
        class="nav-fab"
        aria-label="Cadastrar residente"
        @click="navegar(item.para)"
      >
        <svg class="fab-icone" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="12"
            y1="6"
            x2="12"
            y2="18"
            stroke="currentColor"
            stroke-width="2.6"
            stroke-linecap="round"
          />
          <line
            x1="6"
            y1="12"
            x2="18"
            y2="12"
            stroke="currentColor"
            stroke-width="2.6"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </template>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: var(--branco);
  border-top: 1px solid rgba(46, 93, 46, 0.15);
  padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  max-width: 120px;
  background: none;
  border: none;
  padding: 6px 4px;
  cursor: pointer;
  color: var(--texto-fraco);
  font-family: inherit;
  transition: color 0.15s ease;
}

.nav-item:hover {
  color: var(--verde);
}

.nav-item.ativo {
  color: var(--verde);
}

.nav-item.ativo .nav-rotulo {
  font-weight: 700;
}

.nav-icone {
  width: 24px;
  height: 24px;
}

.nav-rotulo {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.nav-fab {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: var(--verde-medio);
  color: var(--branco);
  box-shadow: 0 6px 16px rgba(107, 161, 63, 0.45);
  display: flex;
  margin-top: -22px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    transform 0.12s ease;
}

.nav-fab:hover {
  background: var(--verde-hover);
}

.nav-fab:active {
  transform: scale(0.94);
}

.fab-icone {
  width: 24px;
  height: 24px;
}

@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}
</style>
