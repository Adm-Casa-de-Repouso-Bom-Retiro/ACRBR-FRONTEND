<script setup>
import { ref } from 'vue'
// Valores serão preenchidos via API futuramente
const funcionarios = ref(null)
const residentes = ref(null)
</script>

<template>
  <main class="home">
    <section class="hero">
      <div class="hero-content">
        <div class="hero-left">
          <div class="welcome-box">
            <p>
              Bem-vindo(a) ao sistema de gestão do asilo. Aqui você pode cadastrar, organizar e
              acompanhar as informações dos residentes de forma prática e segura, auxiliando na
              rotina de cuidados.
            </p>
          </div>
          <div class="stats-row">
            <div class="stat-card">
              <span class="stat-label">Quantidade de<br />Funcionários</span>
              <span class="stat-number">{{ funcionarios ?? '—' }}</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Quantidade de<br />Residentes</span>
              <span class="stat-number">{{ residentes ?? '—' }}</span>
            </div>
          </div>
        </div>
        <div class="hero-right">
          <img src="@/assets/images/idoso4k.png" alt="Casal de idosos" class="hero-image" />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ── HOME ─────────────────────────────────────────────── */
.home {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* ── HERO ─────────────────────────────────────────────── */
.hero {
  position: relative;
  flex: 1;
  background-image: url('@/assets/images/background.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  /* overflow: hidden REMOVIDO — cortava os outlines dos cards */
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 140px 120px 80px;
  gap: 40px;
  height: 100%;
}

/* ── ESQUERDA ─────────────────────────────────────────── */
.hero-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 460px;
}

.welcome-box {
  border-radius: 12px;
  outline: 3px solid #ffffff;
  outline-offset: 5px;
}

.welcome-box p {
  margin: 0;
  color: #2e5d2e;
  font-weight: bold;
  text-align: center;
  background: #ffffff;
  padding: 28px 30px;
  border-radius: 12px;
}

.stats-row {
  display: flex;
  gap: 20px;
}

.stat-card {
  flex: 1;
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  outline: 3px solid #ffffff;
  outline-offset: 5px;
}

.stat-label {
  color: #2e5d2e;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  line-height: 1.4;
}

.stat-number {
  color: #2e5d2e;
  font-size: 38px;
  font-weight: 800;
  line-height: 1;
}

/* ── DIREITA ─────────────────────────────────────────── */
.hero-right {
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.hero-image {
  height: 340px;
  object-fit: contain;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15));
}
</style>