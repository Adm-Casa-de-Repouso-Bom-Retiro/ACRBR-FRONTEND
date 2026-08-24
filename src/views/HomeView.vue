<template>
  <main class="home">
    <section class="hero">
      <div class="hero-content">
        <div class="hero-left">

          <div class="welcome-card">
            <h1>Gestão simples e segura para a sua casa de repouso</h1>

            <p>
              Bem-vindo(a) ao sistema de gestão do asilo. Aqui você pode cadastrar, organizar e
              acompanhar as informações dos residentes de forma prática e segura, auxiliando na
              rotina de cuidados.
            </p>

            <div class="cta-row">
              <router-link to="/prontuario" class="btn btn-primario">VER PRONTUÁRIOS</router-link>
              <router-link to="/cadastroresidente" class="btn btn-secundario">
                CADASTRAR RESIDENTE
              </router-link>
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
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ── HERO ─────────────────────────────────────────────── */
.hero {
  position: relative;
  flex: 1;
  min-height: calc(100vh - 80px);
  background-image: url('@/assets/images/background.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 56px 110px 96px 110px;
  min-height: inherit;
}

/* ── ESQUERDA ─────────────────────────────────────────── */
.hero-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
  max-width: 560px;
}

.welcome-card {
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
  padding: 36px 38px;
}

.welcome-card h1 {
  margin: 0 0 14px 0;
  color: #2e5d2e;
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
}

.welcome-card p {
  margin: 0;
  color: #4a5f4e;
  font-size: 15px;
  line-height: 1.6;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 26px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 13px 28px;
  border-radius: 8px;
  transition:
    background 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.2s ease;
}

.btn-primario {
  background: #6ba13f;
  color: #ffffff;
}

.btn-primario:hover {
  background: #7caf49;
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(46, 93, 46, 0.28);
}

.btn-secundario {
  background: transparent;
  color: #2e5d2e;
  border: 1.5px solid #2e5d2e;
}

.btn-secundario:hover {
  background: rgba(46, 93, 46, 0.08);
  transform: translateY(-2px);
}

/* ── DIREITA ─────────────────────────────────────────── */
.hero-right {
  flex-shrink: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.hero-image {
  height: 460px;
  margin-right: 100px;
  object-fit: contain;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15));
}

@media (max-width: 900px) {
  .hero-content {
    flex-direction: column;
    justify-content: center;
    padding: 40px 24px 64px 24px;
    gap: 32px;
  }

  .hero-left {
    max-width: none;
    align-items: stretch;
  }

  .welcome-card {
    padding: 28px 24px;
  }

  .welcome-card h1 {
    font-size: 26px;
  }

  .cta-row .btn {
    flex: 1;
  }

  .hero-image {
    height: 320px;
  }
}
</style>
