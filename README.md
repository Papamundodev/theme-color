# Theme Color - Outil de Sélection de Couleurs Accessibles

Theme Color est un outil interactif qui aide les développeurs et designers à choisir des combinaisons de couleurs accessibles pour leurs sites web, en respectant les recommandations WCAG pour le contraste.

## 🎨 Fonctionnalités

- **Sélecteur de Couleurs**: Choisissez une couleur d'accent principale qui générera automatiquement un thème complet
- **Calcul du Ratio de Contraste**: Affichage en temps réel des ratios de contraste pour chaque combinaison de couleurs
- **Filtre d'Accessibilité**: Bouton pour afficher uniquement les combinaisons respectant le ratio minimal de 4.5:1
- **Mode Sombre/Clair**: Basculez entre les modes sombre et clair pour tester votre palette dans différents contextes
- **Couleurs Similaires**: Génération automatique de couleurs harmonieuses basées sur votre couleur d'accent

## 📊 Ratios d'Accessibilité WCAG

- **Niveau AA (minimum)**: 4.5:1 pour le texte normal
- **Niveau AAA (amélioré)**: 7:1 pour le texte normal
- **Niveau AA pour grands textes**: 3:1 (18pt ou 14pt gras)

## 🎯 Comment Utiliser

1. Ouvrez l'application dans votre navigateur
2. Utilisez le sélecteur de couleurs dans la barre de navigation pour choisir votre couleur d'accent
3. Observez les différentes combinaisons de couleurs générées dans les cartes
4. Cliquez sur le bouton "Only keep card with a ratio of 4.5:1 or more" pour filtrer les combinaisons accessibles
5. Basculez entre les modes sombre et clair avec le bouton thème
6. Cliquez sur une carte pour voir un exemple de contenu avec cette combinaison de couleurs

## 🛠️ Personnalisation

Vous pouvez personnaliser les variables CSS dans `style.css` (lignes 19-39) pour ajuster.


## 💡 Astuces pour Obtenir Plus de Combinaisons Accessibles

1. Choisissez des couleurs d'accent plus sombres pour obtenir de meilleurs ratios de contraste
2. Ajustez les pourcentages dans les fonctions `color-mix` pour modifier l'intensité des mélanges
3. Expérimentez avec différentes valeurs de `--contrast-color` pour améliorer la lisibilité
4. Testez vos combinaisons dans les deux modes (clair et sombre)


