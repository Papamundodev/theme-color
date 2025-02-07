import { getContrastRatio, getComputedColor, generateSimilarColors } from './utils.js';

// ============= Theme Management =============
function initThemeManager() {
    const themeToggle = document.getElementById("theme-toggle");
    
    function setThemeBasedOnSystem() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
    }

    // Écouter les changements de thème système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setThemeBasedOnSystem);
    setThemeBasedOnSystem();

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        document.body.classList.toggle("dark-theme");
        updateContrastRatio();
    });
}

// ============= Safari Detection =============
function initSafariDetection() {
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        document.body.classList.add('no-motion');
    }
}

// ============= Contrast Management =============
let isFilterActive = false;

function updateContrastRatio() {
    const cards = document.querySelectorAll('.element-ratio-calculating');
    cards.forEach(card => {
        const bg = getComputedColor(card, 'background-color');
        const color = getComputedColor(card, 'color');
        const ratio = getContrastRatio(bg, color);
        const ratioFormatted = ratio.toFixed(2);
    
        card.querySelector('.ratio').textContent = `${ratioFormatted}:1`;
        card.querySelector('.bg-color-computed').textContent = bg;
        card.querySelector('.text-color-computed').textContent = color;

        const parentCard = card.closest('.card');
        if (parentCard) {
            parentCard.style.display = isFilterActive && ratio < 4.5 ? 'none' : '';
        }
    });
}

function initContrastManager() {
    const filterButton = document.querySelector('.button__primary');
    filterButton.addEventListener('click', () => {
        isFilterActive = !isFilterActive;
        updateContrastRatio();
        filterButton.textContent = isFilterActive 
            ? 'Show all cards' 
            : 'Only keep card with a ratio of 4.5:1 or more';
    });

    // Observer theme changes
    const observer = new MutationObserver(updateContrastRatio);
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// ============= Color Management =============
function initColorManager() {
    const colorPicker = document.getElementById('color-picker');
    const percentageInput = document.getElementById('pourcentage-input');

    function updateColors(baseColor) {
        document.documentElement.style.setProperty('--accent-color', baseColor);
        localStorage.setItem('colorPickerValue', baseColor);
        
        const similarColors = generateSimilarColors(baseColor);
        similarColors.forEach((color, index) => {
            document.documentElement.style.setProperty(`--accent-color-${index + 1}`, color);
        });
        
        updateContrastRatio();
    }

    colorPicker.addEventListener('change', () => updateColors(colorPicker.value));
    colorPicker.addEventListener('input', () => updateColors(colorPicker.value));
    
    // Handle hex input mode
    colorPicker.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            this.type = 'text';
            if (this.type === 'text') {
                this.value = this.value;
            }
        }
    });

    // Handle percentage changes
    percentageInput.addEventListener('input', function() {
        const pourcentage = this.value;
        document.documentElement.style.setProperty('--pourcentage', `${pourcentage}%`);
        document.getElementById('pourcentage-selected').textContent = `${pourcentage}%`;
        document.documentElement.style.setProperty('--pourcentage-2', `${pourcentage / 2}%`);
        updateContrastRatio();
    });
}

// ============= Initialize Everything =============
function init() {
    // Récupérer et appliquer la couleur sauvegardée
    const colorPickerValue = localStorage.getItem('colorPickerValue') || '#473ae0';
    document.getElementById('color-picker').value = colorPickerValue;
    // Appliquer immédiatement la couleur aux variables CSS
    document.documentElement.style.setProperty('--accent-color', colorPickerValue);
    
    // Générer et appliquer les couleurs similaires
    const similarColors = generateSimilarColors(colorPickerValue);
    similarColors.forEach((color, index) => {
        document.documentElement.style.setProperty(`--accent-color-${index + 1}`, color);
    });

    // Init card flipping
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('flipped'));
    });
    
    initThemeManager();
    initSafariDetection();
    initContrastManager();
    initColorManager();
    
    // Initial contrast calculation
    document.addEventListener('DOMContentLoaded', updateContrastRatio);
}

init();