<template>
  <main class="home">
    <section class="hero">
      <div class="hero-conteudo">
        <div class="intro">
          <span class="intro-caps">ACRBR · SISTEMA DE GESTÃO</span>
          <h1 class="hero-titulo">Gestão simples e segura para a sua casa de repouso</h1>
          <p class="hero-texto">
            Bem-vindo(a)! Cadastre, organize e acompanhe as informações dos residentes de forma
            prática e segura.
          </p>
        </div>

        <img src="@/assets/images/idoso4k.png" alt="Casal de idosos" class="hero-foto" />

        <div class="acoes">
          <router-link to="/prontuario" class="acao-card">
            <span class="acao-icone">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2h9l5 5v15H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" fill="currentColor" />
                <path
                  d="M9 12h6M9 16h6"
                  stroke="#ffffff"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <span class="acao-info">
              <strong>Ver prontuários</strong>
              <small>Residentes cadastrados</small>
            </span>
            <span class="acao-seta">→</span>
          </router-link>

          <router-link to="/cadastroresidente" class="acao-card">
            <span class="acao-icone">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 2.1c-3.5 0-7 1.76-7 5.25V21h14v-1.65c0-3.49-3.5-5.25-7-5.25Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span class="acao-info">
              <strong>Cadastrar residente</strong>
              <small>Novo cadastro completo</small>
            </span>
            <span class="acao-seta">→</span>
          </router-link>

          <router-link to="/login" class="acao-card">
            <span class="acao-icone">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm2-3 3 3-3 3"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Z"
                  stroke="currentColor"
                  stroke-width="1.8"
                />
              </svg>
            </span>
            <span class="acao-info">
              <strong>Área administrativa</strong>
              <small>Entrar com sua conta</small>
            </span>
            <span class="acao-seta">→</span>
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ── HOME (mobile-first, minimalista) ───────────────── */
.home {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hero {
  flex: 1;
  display: flex;
  align-items: stretch;
  background: linear-gradient(160deg, #2e5d2e 0%, #3c7039 60%, #6ba13f 100%);
}

.hero-conteudo {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 36px 20px 32px;
}

.intro {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
}

.intro-caps {
  color: #d7e3d4;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.hero-titulo {
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.18;
  margin: 0;
}

.hero-texto {
  color: #e4eee2;
  font-size: 14px;
  line-height: 1.55;
  margin: 0 auto;
  max-width: 420px;
}

.hero-foto {
  width: 100%;
  max-width: 220px;
  margin: 0 auto;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
}

.acoes {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.acao-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.acao-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

.acao-icone {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6ba13f;
  border-radius: 12px;
  color: #ffffff;
}

.acao-icone svg {
  width: 26px;
  height: 26px;
}

.acao-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.acao-info strong {
  color: #2e5d2e;
  font-size: 15px;
  font-weight: 700;
}

.acao-info small {
  color: #6b7d6f;
  font-size: 12px;
}

.acao-seta {
  color: #6ba13f;
  font-size: 20px;
  font-weight: 700;
}

/* ── DESKTOP: mantém o hero original ───────────────── */
@media (min-width: 768px) {
  .hero {
    position: relative;
    min-height: calc(100vh - 80px);
    background-image: url('@/assets/images/background.png');
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
  }

  .hero-conteudo {
    position: relative;
    z-index: 1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    padding: 56px 110px 96px 110px;
    min-height: inherit;
  }

  .intro {
    max-width: 560px;
    text-align: left;
    align-items: flex-start;
    gap: 22px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
    padding: 36px 38px;
  }

  .intro-caps {
    color: #6ba13f;
  }

  .hero-titulo {
    color: #2e5d2e;
    font-size: 32px;
  }

  .hero-texto {
    color: #4a5f4e;
    font-size: 15px;
    margin: 0;
  }

  .hero-foto {
    height: 460px;
    max-width: none;
    margin-right: 100px;
    border-radius: 0;
    object-fit: contain;
    filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.15));
    box-shadow: none;
  }

  .acoes {
    display: none;
  }
}

@media (max-width: 900px) and (min-width: 768px) {
  .hero-conteudo {
    flex-direction: column;
    justify-content: center;
    padding: 40px 24px 64px 24px;
    gap: 32px;
  }

  .intro {
    max-width: none;
    align-items: stretch;
  }

  .hero-foto {
    height: 320px;
    margin-right: 0;
  }
}
</style>
