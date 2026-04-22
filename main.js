import './style.css';

document.addEventListener('DOMContentLoaded', () => {

  // 0. Navigation: Scroll Glassmorphism + Hamburger + Active Links
  const header = document.getElementById('main-header');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Scroll effect on header
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click (mobile)
    allNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link on scroll via IntersectionObserver
  const sections = document.querySelectorAll('section[id], div[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allNavLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(sec => navObserver.observe(sec));

  // 1. Slow Design - Intersection Observer para animaciones de Scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active', 'visible');
        // Opcionalmente dejar de observar una vez animado
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal, .fade-in, .stagger-item');
  revealElements.forEach(el => observer.observe(el));

  // 2. Interacción del Diagrama de las 5 Zonas (Gamificación Pasiva)
  const nodes = document.querySelectorAll('.diagram-node');
  
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      // Toggle active class on click for mobile/desktop
      const isActive = node.classList.contains('active');
      
      // Close all others
      nodes.forEach(n => n.classList.remove('active'));
      
      // If it wasn't active, activate it
      if (!isActive) {
        node.classList.add('active');
      }
    });
  });

  // Activate first node by default for demonstration
  if(nodes.length > 0) {
    setTimeout(() => {
      nodes[0].classList.add('active');
    }, 1000);
  }

  // 3. Sostenibilidad Digital - Dark Mode Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  
  // Check local storage or system preference
  const currentTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else if (currentTheme === 'light') {
    document.documentElement.classList.add('light');
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark') || 
                   (!document.documentElement.classList.contains('light') && prefersDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

  // 4. Animación dinámica: Red Neuronal en Hero (Salud Mental)
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, particles;
    
    const initCanvas = () => {
      width = canvas.width = window.innerWidth;
      const hero = document.querySelector('.hero');
      height = canvas.height = hero ? hero.offsetHeight : window.innerHeight;
      particles = [];
      const isDark = document.documentElement.classList.contains('dark');
      const particleColor = isDark ? 'rgba(183, 133, 255, 0.4)' : 'rgba(106, 59, 180, 0.3)';
      
      const numParticles = window.innerWidth < 768 ? 25 : 55; // optimización móvil
      
      for(let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          size: Math.random() * 2.5 + 1,
          color: particleColor
        });
      }
    };
    
    initCanvas();
    window.addEventListener('resize', initCanvas);
    
    // Observar cambio de tema para actualizar colores de animación
    const obs = new MutationObserver(initCanvas);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const animateCanvas = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if(p.x < 0 || p.x > width) p.vx *= -1;
        if(p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      
      for(let i = 0; i < particles.length; i++) {
        for(let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if(dist < 180) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            const isDark = document.documentElement.classList.contains('dark');
            const opacity = 1 - (dist / 180);
            // Color de la línea de conexión (Sináptica)
            const strokeColor = isDark ? `rgba(183, 133, 255, ${opacity * 0.25})` : `rgba(106, 59, 180, ${opacity * 0.15})`;
            
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateCanvas);
    };
    
    animateCanvas();
  }

  // 5. Reproductor de Podcast Interactivo NATIVO (Ondas Sonoras)
  const podcastPlayBtn = document.getElementById('podcast-play-btn');
  const soundwaveViz = document.getElementById('soundwave-viz');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const audioEl = document.getElementById('podcast-audio');
  let isPodcastPlaying = false;

  // 5.1 Automatización Dinámica del RSS
  const rssUrl = 'https://anchor.fm/s/1106186fc/podcast/rss';
  
  const updatePodcastFromRSS = async () => {
    try {
      // Intentamos obtener el RSS (Nota: En producción, Anchor permite fetch si se configura bien o vía proxy)
      const response = await fetch(rssUrl);
      if (!response.ok) return;
      
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const latestItem = xmlDoc.querySelector("item");

      if (latestItem) {
        const title = latestItem.querySelector("title").textContent;
        // Limpiamos el HTML de la descripción y limitamos longitud
        const fullDesc = latestItem.querySelector("description").textContent.replace(/<[^>]*>/g, '');
        const cleanDesc = fullDesc.length > 160 ? fullDesc.substring(0, 157) + '...' : fullDesc;
        const audioUrl = latestItem.querySelector("enclosure").getAttribute("url");

        const titleEl = document.getElementById('podcast-title');
        const descEl = document.getElementById('podcast-desc');
        
        if (titleEl) titleEl.innerText = title;
        if (descEl) descEl.innerText = cleanDesc;
        if (audioEl) audioEl.src = audioUrl;
      }
    } catch (error) {
      console.log("Sincronización de Podcast: Usando versión estática (CORS o conexión offline).");
    }
  };

  updatePodcastFromRSS();

  if (podcastPlayBtn && soundwaveViz && audioEl) {
    podcastPlayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (audioEl.paused) {
        audioEl.play().then(() => {
          isPodcastPlaying = true;
          soundwaveViz.classList.add('playing');
          iconPlay.style.display = 'none';
          iconPause.style.display = 'block';
        }).catch(err => console.error("Error reproduciendo audio:", err));
      } else {
        audioEl.pause();
        isPodcastPlaying = false;
        soundwaveViz.classList.remove('playing');
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
      }
    });
    
    // Al terminar el audio, resetear UI
    audioEl.addEventListener('ended', () => {
      isPodcastPlaying = false;
      soundwaveViz.classList.remove('playing');
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
    });
  }
});
