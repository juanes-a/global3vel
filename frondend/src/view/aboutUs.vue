<template>
  <div class="about-container">
    <!-- Sección Hero con animación -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="glitch" data-text="LEVEL UP WITH US">LEVEL UP WITH US</h1>
        <div class="pixel-corners"></div>
        <div class="scanline"></div>
      </div>
    </div>

    <!-- Contenedor principal con márgenes -->
    <div class="content-wrapper">
      <!-- Misión/Visión -->
      <div class="mission-section">
        <div class="grid-container">
          <div class="card" @mouseover="hoverEffect($event)" @mouseleave="resetEffect($event)">
            <div class="card-content">
              <h2><span class="icon">🕹️</span> OUR MISSION</h2>
              <p>Connect gamers worldwide through an interactive map where every pin tells a story. No borders, just headshots and high scores.</p>
            </div>
            <div class="card-border"></div>
          </div>
          
          <div class="card" @mouseover="hoverEffect($event)" @mouseleave="resetEffect($event)">
            <div class="card-content">
              <h2><span class="icon">🌐</span> GLOBAL IMPACT</h2>
              <p>From Bogotá to Tokyo, we're mapping gaming culture in real-time. Discover trends like "MOBA dominance in SEA" or "RPG love in EU".</p>
            </div>
            <div class="card-border"></div>
          </div>
        </div>
      </div>

      <!-- Team -->
      <div class="team-section">
        <h2 class="section-title"><span class="highlight">THE</span> CREW</h2>
        <div class="team-grid">
          <div class="team-card" v-for="(member, index) in team" :key="index">
            <div class="card-frame">
              <div class="avatar" :style="{ backgroundImage: `url(${member.avatar || 'https://via.placeholder.com/150'})` }"></div>
            </div>
            <h3>{{ member.name }}</h3>
            <p class="role">{{ member.role }}</p>
            <p class="quote">"{{ member.quote }}"</p>
            <div class="social-links">
              <a v-for="(link, platform) in member.socials" :key="platform" :href="link" target="_blank">
                {{ platform }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-section">
        <div class="stat" v-for="(stat, index) in stats" :key="index">
          <div class="number" :data-value="stat.value">{{ stat.value }}</div>
          <div class="label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Partículas de fondo -->
    <div class="particles">
      <div v-for="i in 50" :key="i" class="particle" :style="particleStyle(i)"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Datos del equipo
const team = ref([
  {
    name: "Danna Raigoso",
    role: "Game Dev & UX",
    quote: "Let's build bridges, not walls. GG!",
    avatar: "https://i.imgur.com/avatar1.jpg",
    socials: {
      Twitter: "#",
      Discord: "#"
    }
  },
  {
    name: "Juan Nomesque",
    role: "Full-Stack Wizard",
    quote: "Code like it's speedrun night!",
    avatar: "https://i.imgur.com/avatar2.jpg",
    socials: {
      GitHub: "#",
      Steam: "#"
    }
  }
]);

// Estadísticas
const stats = ref([
  { value: "10K+", label: "Gamers Pinned" },
  { value: "150+", label: "Countries" },
  { value: "24/7", label: "Live Feed" }
]);

// Animación de partículas
const particleStyle = (i) => {
  const colors = ['#00f0ff', '#0066ff', '#7ae7ff'];
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 3 + 1}px`,
    height: `${Math.random() * 3 + 1}px`,
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    animation: `float ${Math.random() * 10 + 5}s linear infinite`
  };
};

// Efectos hover
const hoverEffect = (e) => {
  e.currentTarget.style.transform = 'translateY(-5px)';
  e.currentTarget.querySelector('.card-border').style.opacity = '1';
};

const resetEffect = (e) => {
  e.currentTarget.style.transform = '';
  e.currentTarget.querySelector('.card-border').style.opacity = '0';
};
</script>

<style scoped>
/* Estilo base futurista */
.about-container {
  font-family: 'Orbitron', sans-serif;
  background-color: #0a0e17;
  color: #e0e0e0;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Hero Section con efecto glitch */
.hero-section {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00172d 0%, #000000 100%);
  overflow: hidden;
  margin-bottom: 4rem;
}

.hero-content {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.glitch {
  position: relative;
  font-size: 4rem;
  font-weight: 700;
  color: #00f0ff;
  text-transform: uppercase;
  letter-spacing: 3px;
  z-index: 1;
  text-shadow: 0 0 10px #0066ff;
  margin: 0;
  text-align: center;
  padding: 1rem;
}

.glitch::before, .glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.glitch::before {
  color: #002c8a;
  z-index: -1;
  animation: glitch-effect 3s infinite;
}

.glitch::after {
  color: #00ffaa;
  z-index: -2;
  animation: glitch-effect 2s infinite reverse;
}

/* Efecto pixelado */
.pixel-corners {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  border: 2px solid #00f0ff;
  pointer-events: none;
}

.scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 240, 255, 0) 0%,
    rgba(0, 240, 255, 0.1) 50%,
    rgba(0, 240, 255, 0) 100%
  );
  animation: scanline 8s linear infinite;
  pointer-events: none;
}

/* Cards */
.mission-section {
  margin-bottom: 6rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin: 0 auto;
}

.card {
  position: relative;
  background: rgba(0, 30, 60, 0.3);
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: 2px;
  height: 100%;
}

.card-content {
  background: rgba(0, 30, 60, 0.5);
  padding: 2rem;
  border-radius: 6px;
  height: 100%;
  backdrop-filter: blur(5px);
}

.card-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid #00f0ff;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.card:hover .card-border {
  opacity: 1;
}

.card h2 {
  color: #00f0ff;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.card p {
  line-height: 1.6;
}

.icon {
  margin-right: 10px;
}

/* Team Section */
.team-section {
  margin-bottom: 6rem;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #e0e0e0;
}

.highlight {
  color: #00f0ff;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.team-card {
  background: rgba(0, 20, 40, 0.3);
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 112, 204, 0.3);
}

.team-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid transparent;
  border-radius: 10px;
  z-index: -1;
  transition: all 0.3s;
}

.team-card:hover::before {
  border-color: #00f0ff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
}

.card-frame {
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
  border: 3px solid #007acc;
  border-radius: 50%;
  padding: 5px;
  position: relative;
}

.card-frame::before {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid #00f0ff;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.team-card:hover .card-frame::before {
  opacity: 1;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  transition: all 0.3s;
  background-color: #001a33;
}

.team-card:hover .avatar {
  transform: scale(1.05);
}

.team-card h3 {
  margin: 1rem 0 0.5rem;
  color: #00f0ff;
  font-size: 1.3rem;
}

.role {
  color: #7ae7ff;
  font-weight: 500;
  margin-bottom: 1rem;
}

.quote {
  font-style: italic;
  margin-bottom: 1.5rem;
  color: #b3e0ff;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-links a {
  color: #00f0ff;
  text-decoration: none;
  padding: 0.3rem 0.8rem;
  border: 1px solid #007acc;
  border-radius: 4px;
  transition: all 0.3s;
}

.social-links a:hover {
  background: rgba(0, 112, 204, 0.2);
  border-color: #00f0ff;
}

/* Stats */
.stats-section {
  display: flex;
  justify-content: space-around;
  background: rgba(0, 40, 80, 0.3);
  padding: 3rem;
  border-radius: 10px;
  margin-bottom: 4rem;
  border: 1px solid rgba(0, 112, 204, 0.3);
}

.stat {
  text-align: center;
  padding: 0 2rem;
}

.number {
  font-size: 3rem;
  font-weight: 700;
  color: #00f0ff;
  text-shadow: 0 0 10px #0066ff;
  margin-bottom: 0.5rem;
}

.label {
  font-size: 1.1rem;
  color: #b3e0ff;
}

/* Partículas */
.particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    height: 300px;
  }
  
  .glitch {
    font-size: 2.5rem;
  }
  
  .grid-container {
    grid-template-columns: 1fr;
  }
  
  .stats-section {
    flex-direction: column;
    gap: 2rem;
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
}
</style>