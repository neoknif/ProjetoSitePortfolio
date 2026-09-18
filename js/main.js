// ============================================
// Efeito Matrix Rain
// ============================================
(function () {
  var canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var chars = '011010010101010101';
  var fontSize = 14;
  var drops = [];
  var intervalId = null;

  function setupDrops() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = 1;
    }
  }

  function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 8, 17, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff88';
    ctx.font = fontSize + 'px monospace';

    for (var i = 0; i < drops.length; i++) {
      var text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  function startAnimation() {
    if (intervalId || prefersReducedMotion) return;
    intervalId = setInterval(drawMatrix, 33);
  }

  function stopAnimation() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Se o usuário prefere menos movimento, não anima o canvas
  if (!prefersReducedMotion) {
    setupDrops();
    startAnimation();
  }

  // Pausa a animação quando a aba não está visível (economiza CPU/bateria)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopAnimation();
    } else {
      startAnimation();
    }
  });

  // Debounce no resize para não recalcular a cada pixel
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      if (!prefersReducedMotion) {
        setupDrops();
      }
    }, 200);
  });
})();


// ============================================
// Efeito Typewriter
// ============================================
(function () {
  var el = document.getElementById('typewriter');
  if (!el) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lidera com o foco profissional (Full Stack/ADS); jogos aparece como paixão pessoal, não como especialização concorrente
  var roles = ['Dev Full Stack em Formação', 'Estudante de ADS', 'Apaixonado por Jogos & Unity/C#', 'Sempre Aprendendo'];

  // Para quem prefere menos movimento, mostra só o primeiro item, fixo
  if (prefersReducedMotion) {
    el.textContent = roles[0];
    return;
  }

  var roleIndex = 0, charIndex = 0, erasing = false;

  function tick() {
    var role = roles[roleIndex];
    if (!erasing) {
      charIndex++;
      el.textContent = role.slice(0, charIndex);
      if (charIndex === role.length) {
        erasing = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 80);
    } else {
      charIndex--;
      el.textContent = role.slice(0, charIndex);
      if (charIndex === 0) {
        erasing = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
      setTimeout(tick, 50);
    }
  }

  setTimeout(tick, 600);
})();


// ============================================
// Renderização Dinâmica de Skills
// ============================================
(function () {
  var grid = document.getElementById('skills-grid');
  if (!grid) return;

  // Grupo 1: skills que sustentam os projetos já entregues (AbsenceIQ, Projeto Vale)
  var professionalSkills = [
    { name: 'HTML5 & CSS3', level: 85, category: 'Frontend' },
    { name: 'JavaScript ES6+', level: 75, category: 'Frontend' },
    { name: 'SQL & Banco de Dados', level: 72, category: 'Backend' },
    { name: 'Git & GitHub', level: 78, category: 'Tools' }
  ];

  // Grupo 2: interesse pessoal/estudo — sem % de proficiência, já que ainda não há
  // projeto de jogo publicado que sustente um número de confiança
  var hobbySkills = [
    { name: 'Unity 3D & C#', category: 'Game Dev' },
    { name: 'Física & Mecânicas 3D', category: 'Game Dev' }
  ];

  function groupLabelHtml(text) {
    return (
      '<div class="skills-group-label" style="grid-column: 1 / -1; font-family: var(--font-mono); ' +
      'font-size: 12px; color: var(--dim); text-transform: uppercase; letter-spacing: 2px; ' +
      'padding-bottom: 8px; border-bottom: 1px solid var(--border); margin-top: 8px;">' +
        text +
      '</div>'
    );
  }

  function professionalCardHtml(s) {
    return (
      '<div class="skill-card">' +
        '<div class="skill-header">' +
          '<div>' +
            '<div class="skill-name">' + s.name + '</div>' +
            '<div class="skill-cat">' + s.category + '</div>' +
          '</div>' +
          '<span class="skill-pct">' + s.level + '%</span>' +
        '</div>' +
        '<div class="skill-track" role="progressbar" ' +
             'aria-label="Nível de proficiência em ' + s.name + '" ' +
             'aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + s.level + '">' +
          '<div class="skill-fill" data-level="' + s.level + '"></div>' +
        '</div>' +
      '</div>'
    );
  }

  function hobbyCardHtml(s) {
    return (
      '<div class="skill-card">' +
        '<div class="skill-header">' +
          '<div>' +
            '<div class="skill-name">' + s.name + '</div>' +
            '<div class="skill-cat">' + s.category + '</div>' +
          '</div>' +
        '</div>' +
        '<span class="tech-tag">Em aprendizado</span>' +
      '</div>'
    );
  }

  var cardsHtml =
    groupLabelHtml('Foco Profissional') +
    professionalSkills.map(professionalCardHtml).join('') +
    groupLabelHtml('Hobby / Estudo Pessoal') +
    hobbySkills.map(hobbyCardHtml).join('');

  grid.innerHTML = cardsHtml;

  // Animação das barras ao rolar a página
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fills = document.querySelectorAll('.skill-fill');

  if (prefersReducedMotion) {
    // Sem animação: aplica o valor final direto
    fills.forEach(function (f) {
      f.style.width = f.getAttribute('data-level') + '%';
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.width = e.target.getAttribute('data-level') + '%';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(function (f) {
      io.observe(f);
    });
  }
})();