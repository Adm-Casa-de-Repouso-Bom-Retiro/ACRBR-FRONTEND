<template>
  <div class="voltar-wrap">
    <router-link class="btn-voltar" :to="to">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M19 12H5M11 18l-6-6 6-6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>{{ label }}</span>
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  label: {
    type: String,
    default: 'VOLTAR',
  },
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.voltar-wrap {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto 16px auto;
}

.btn-voltar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #3e7a2b;
  border: 1.5px solid #3e7a2b;
  border-radius: 8px;
  padding: 9px 18px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-voltar:hover {
  background: #e8f1e3;
}

.btn-voltar svg {
  width: 16px;
  height: 16px;
}
</style>
