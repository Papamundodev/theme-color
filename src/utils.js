// Fonction pour calculer la luminance
export function getLuminance(r, g, b) {
    let [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 
            ? c / 12.92 
            : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Fonction pour calculer le ratio de contraste
export function getContrastRatio(color1, color2) {
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

    let l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    let l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    let lighter = Math.max(l1, l2);
    let darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

// Fonction pour obtenir la couleur calculée
export function getComputedColor(element, property) {
    const style = window.getComputedStyle(element);
    const color = style.getPropertyValue(property);
    
    if (color.startsWith('color(srgb')) {
        const [r, g, b] = color.match(/[\d.]+/g)
            .map(Number)
            .map(x => Math.round(x * 255));
        
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    
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

// Fonction pour convertir HEX en HSL
export function hexToHSL(hex) {
    let r = parseInt(hex.slice(1,3), 16) / 255;
    let g = parseInt(hex.slice(3,5), 16) / 255;
    let b = parseInt(hex.slice(5,7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
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
export function hslToHex(h, s, l) {
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
export function generateSimilarColors(baseColor, count = 5) {
    const hsl = hexToHSL(baseColor);
    const colors = [];
    
    const hueStep = 360 / count;
    
    for (let i = 0; i < count; i++) {
        let newHue = (hsl.h + (hueStep * (i + 5))) % 360;
        colors.push(hslToHex(newHue, hsl.s, hsl.l));
    }
    
    return colors;
}
