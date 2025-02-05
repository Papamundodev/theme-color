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

// Variable pour suivre l'état du filtre
let isFilterActive = false;

// Fonction pour mettre à jour le ratio
function updateContrastRatio() {
    const cards = document.querySelectorAll('.element-ratio-calculating');
    cards.forEach(card => {
        // Calculer le ratio une seule fois par carte
        const bg = getComputedColor(card, 'background-color');
        const color = getComputedColor(card, 'color');
        const ratio = getContrastRatio(bg, color);
        const ratioFormatted = ratio.toFixed(2);
    
        // Mettre à jour l'affichage
        card.querySelector('.ratio').textContent = `${ratioFormatted}:1`;
        card.querySelector('.bg-color-computed').textContent = bg;
        card.querySelector('.text-color-computed').textContent = color;

        // Trouver la carte parente (.card) et la masquer si le filtre est actif et le ratio est inférieur à 4.5
        const parentCard = card.closest('.card');
        if (parentCard) {
            if (isFilterActive && ratio < 4.5) {
                parentCard.style.display = 'none';
            } else {
                parentCard.style.display = '';
            }
        }
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

// Fonction pour convertir HEX en HSL
function hexToHSL(hex) {
    // Convertir hex en RGB
    let r = parseInt(hex.slice(1,3), 16) / 255;
    let g = parseInt(hex.slice(3,5), 16) / 255;
    let b = parseInt(hex.slice(5,7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatique
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// Fonction pour convertir HSL en HEX
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Fonction pour générer des couleurs similaires
function generateSimilarColors(baseColor, count = 5) {
    const hsl = hexToHSL(baseColor);
    const colors = [];
    
    // Garder la même saturation et luminosité, changer la teinte
    const hueStep = 360 / count;
    
    for (let i = 0; i < count; i++) {
        let newHue = (hsl.h + (hueStep * (i + 5))) % 360;
        colors.push(hslToHex(newHue, hsl.s, hsl.l));
    }
    
    return colors;
}

// Utilisation
document.getElementById('color-picker').addEventListener('change', function() {
    const baseColor = this.value;
    const similarColors = generateSimilarColors(baseColor);
    
    // Mettre à jour la couleur principale
    document.documentElement.style.setProperty('--accent-color', baseColor);
    
    // Mettre à jour les variables CSS pour les couleurs similaires
    similarColors.forEach((color, index) => {
        document.documentElement.style.setProperty(`--accent-color-${index + 1}`, color);
    });
    
    updateAllCalculations();
});

// Écouter aussi l'événement 'input' pour une mise à jour en temps réel
document.getElementById('color-picker').addEventListener('input', function() {
    document.documentElement.style.setProperty('--accent-color', this.value);
    updateAllCalculations();
});

// Calculer le ratio initial
document.addEventListener('DOMContentLoaded', updateAllCalculations);

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

// Ajouter l'écouteur d'événements pour le bouton de filtre
document.querySelector('.button__primary').addEventListener('click', () => {
    isFilterActive = !isFilterActive;
    updateContrastRatio();
    
    // Mettre à jour le texte du bouton
    const button = document.querySelector('.button__primary');
    if (isFilterActive) {
        button.textContent = 'Show all cards';
    } else {
        button.textContent = 'Only keep card with a ratio of 4.5:1 or more';
    }
});


// event on the pourcentage input to calculate the ratio of the cards
document.getElementById('pourcentage-input').addEventListener('input', function() {
  const pourcentage = this.value;
  document.documentElement.style.setProperty('--pourcentage', `${pourcentage}%`);
  document.documentElement.style.setProperty('--pourcentage-2', `${pourcentage / 2}%`);
  updateAllCalculations();
});