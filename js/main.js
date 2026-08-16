// --- Efeito Matrix Rain ---
var canvas = document.getElementById('matrix-canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var chars = '011010010101010101';
var fontSize = 14;
var columns = canvas.width / fontSize;
var drops = [];

for (var i = 0; i < columns; i++) {
  drops[i] = 1;
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

setInterval(drawMatrix, 33);

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


// --- Efeito Typewriter ---
var roles = ['Unity Game Dev', 'C# Programmer', 'Simuladores & Mecânicas 3D', 'Estudante de ADS'];
var roleIndex = 0, charIndex = 0, erasing = false;
var el = document.getElementById('typewriter');

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


// --- Renderização Dinâmica de Skills ---
var skills = [
  { name: 'Unity 3D & C#', level: 80, category: 'Game Dev' },
  { name: 'Física & Mecânicas 3D', level: 75, category: 'Game Dev' },
  { name: 'HTML5 & CSS3', level: 85, category: 'Frontend' },
  { name: 'JavaScript ES6+', level: 75, category: 'Frontend' },
  { name: 'SQL & Banco de Dados', level: 72, category: 'Backend' },
  { name: 'Git & GitHub', level: 78, category: 'Tools' }
];

var grid = document.getElementById('skills-grid');
for (var i = 0; i < skills.length; i++) {
  var s = skills[i];
  grid.innerHTML += '<div class="skill-card">' +
    '<div class="skill-header">' +
      '<div><div class="skill-name">' + s.name + '</div><div class="skill-cat">' + s.category + '</div></div>' +
      '<span class="skill-pct">' + s.level + '%</span>' +
    '</div>' +
    '<div class="skill-track"><div class="skill-fill" data-level="' + s.level + '"></div></div>' +
  '</div>';
}

// Animação das barras ao rolar a página
var io = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.style.width = e.target.getAttribute('data-level') + '%';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-fill').forEach(function(f) { 
  io.observe(f); 
});
