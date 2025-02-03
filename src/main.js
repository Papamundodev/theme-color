// theme toggle
const themeToggle = document.getElementById("theme-toggle");

// Vérifier le thème initial (optionnel)
if (window.matchMedia('(prefers-color-scheme: light)').matches) {
  document.body.classList.add('light-theme');
}

themeToggle.addEventListener("click", () => {
  // Basculer entre light-theme et dark-theme
  document.body.classList.toggle("light-theme");
  document.body.classList.toggle("dark-theme");
});


function getLuminance(r, g, b) {
  // Convertir les valeurs RGB en sRGB
  let [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 
          ? c / 12.92 
          : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  // Calculer la luminance relative
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  // Convertir les couleurs hex en RGB
  let rgb1 = {
      r: parseInt(color1.slice(1,3), 16),
      g: parseInt(color1.slice(3,5), 16),
      b: parseInt(color1.slice(5,7), 16)
  };
  
  let rgb2 = {
      r: parseInt(color2.slice(1,3), 16),
      g: parseInt(color2.slice(3,5), 16),
      b: parseInt(color2.slice(5,7), 16)
  };

  // Calculer les luminances
  let l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  let l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  // Calculer le ratio
  let lighter = Math.max(l1, l2);
  let darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Fonction pour obtenir la couleur calculée d'un élément
function getComputedColor(element, property) {
    const style = window.getComputedStyle(element);
    const color = style.getPropertyValue(property);
    
    // Gérer le format color(srgb x y z)
    if (color.startsWith('color(srgb')) {
        const [r, g, b] = color.match(/[\d.]+/g)
            .map(Number)
            .map(x => Math.round(x * 255)); // Convertir les valeurs sRGB (0-1) en RGB (0-255)
        
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    
    // Gérer le format rgb(x, y, z)
    if (color.startsWith('rgb')) {
        const [r, g, b] = color.match(/[\d.]+/g)
            .map(Number)
            .map(Math.round);
        
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    
    return color;
}

// Fonction pour mettre à jour le ratio
function updateContrastRatio() {
    const cards = document.querySelectorAll('.element-ratio-calculating');
    cards.forEach(card => {
        // Calculer le ratio une seule fois par carte
        const bg = getComputedColor(card, 'background-color');
        const color = getComputedColor(card, 'color');
        const ratio = getContrastRatio(bg, color).toFixed(2);
    
        // Mettre à jour l'affichage
        card.querySelector('.ratio').textContent = `${ratio}:1`;
        card.querySelector('.bg-color-computed').textContent = bg;
        card.querySelector('.text-color-computed').textContent = color;
    });
}

// Fonction pour mettre à jour tous les calculs
function updateAllCalculations() {
    // Mettre à jour les ratios de contraste
    updateContrastRatio();
    
    // Déclencher un événement personnalisé pour informer d'autres parties de l'application si nécessaire
    document.dispatchEvent(new CustomEvent('themeUpdated'));
}

// Observer les changements de thème
const observer = new MutationObserver(updateAllCalculations);
observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
});

// Écouter les changements de couleur
document.getElementById('color-picker').addEventListener('change', function() {
    // Mettre à jour la variable CSS
    document.documentElement.style.setProperty('--accent-color', this.value);
    // Recalculer tous les ratios
    updateAllCalculations();
});

// Écouter aussi l'événement 'input' pour une mise à jour en temps réel
document.getElementById('color-picker').addEventListener('input', function() {
    document.documentElement.style.setProperty('--accent-color', this.value);
    updateAllCalculations();
});

// Calculer le ratio initial
document.addEventListener('DOMContentLoaded', updateAllCalculations);