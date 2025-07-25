# 🎬 BMS Ventouse - Site Vitrine Professionnel

Site vitrine pour BMS Ventouse, spécialiste en logistique audiovisuelle, ventousage et services pour l'industrie cinématographique.

## 📋 Services Proposés

- **Ventousage** - Spécialité principale pour tournages
- **Sécurité plateaux et gardiennage** (Vista Prime)
- **Convoyage véhicules** (22m3, poids lourds, transport décors)
- **Shooting photo, publicité, Fashion week**
- **Réservation stationnement** pour déménagements
- **Couverture nationale** avec équipe qualifiée
- **Services complets** : loges, cantine, parking sécurisé
- **Signalétique** : pose panneaux, roulettage, affichages

## 🏗️ Architecture du Projet

```
bms-ventouse-pro/
├── src/                          # Code source
│   ├── pages/                    # Pages HTML du site
│   │   ├── index.html           # Page d'accueil
│   │   ├── services.html        # Services détaillés
│   │   ├── realisations.html    # Portfolio/références
│   │   ├── contact.html         # Contact et devis
│   │   └── mentions.html        # Mentions légales
│   ├── _includes/               # Templates Eleventy
│   │   ├── layout.html          # Template principal
│   │   ├── header.html          # En-tête navigation
│   │   └── footer.html          # Pied de page
│   └── assets/                  # Ressources statiques
│       ├── images/              # Images organisées
│       │   ├── icons/           # Favicons et icônes
│       │   └── content/         # Images de contenu
│       ├── css/                 # Feuilles de style
│       └── js/                  # Scripts JavaScript
│           └── components/      # Modules JS organisés
├── config/                      # Configuration déploiement
│   ├── netlify.toml            # Config Netlify
│   ├── _headers                # Headers HTTP
│   ├── _redirects              # Redirections
│   └── site.webmanifest        # Manifest PWA
├── .eleventy.js                # Configuration Eleventy
├── package.json                # Dépendances et scripts
└── README.md                   # Cette documentation
```

## 🚀 Installation et Développement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd bms-ventouse-pro

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start
```

### Scripts Disponibles
```bash
npm start          # Serveur de développement avec hot-reload
npm run build      # Build de production
npm run lint       # Vérification du code (ESLint + Stylelint)
npm run format     # Formatage automatique (Prettier)
npm run deploy     # Déploiement sur Netlify
```

## 🎨 Technologies Utilisées

- **Eleventy (11ty)** - Générateur de site statique
- **Anime.js** - Animations fluides et professionnelles
- **CSS Custom Properties** - Variables CSS modernes
- **JavaScript ES6+** - Code moderne et modulaire
- **Netlify** - Hébergement et déploiement

## 🎯 Optimisations Implémentées

### Performance
- Images optimisées et lazy loading
- CSS et JS minifiés en production
- Fonts préchargées avec `font-display: swap`
- Cache optimisé (1 an pour les assets)

### SEO
- Données structurées JSON-LD
- Meta tags Open Graph complets
- Sitemap.xml automatique
- URLs canoniques
- Robots.txt optimisé

### Accessibilité
- Navigation au clavier
- Attributs ARIA appropriés
- Respect des préférences `prefers-reduced-motion`
- Contraste et tailles de police optimisés

### Sécurité
- Content Security Policy (CSP)
- Headers de sécurité (HSTS, X-Frame-Options)
- Protection XSS et clickjacking

## 🎬 Animations et Interactions

Le site utilise **Anime.js** pour des animations fluides adaptées au secteur audiovisuel :

- **Hero section** : Apparition séquentielle des éléments
- **Services** : Animations au scroll avec Intersection Observer
- **Portfolio** : Transitions dynamiques entre projets
- **Contact** : Micro-interactions sur les formulaires

### Personnalisation des Animations
Les animations sont configurables dans `src/assets/js/components/animations.js` :
```javascript
// Durées et easings personnalisables
const ANIMATION_CONFIG = {
  duration: 800,
  easing: 'easeOutExpo',
  stagger: 100
};
```

## 🎨 Personnalisation du Design

### Variables CSS
Toutes les couleurs et espacements sont centralisés dans `src/assets/css/style.css` :
```css
:root {
  --color-primary: #FF8C42;     /* Orange BMS */
  --color-dark: #2c3e50;        /* Bleu foncé */
  --spacing-section: 5rem;      /* Espacement sections */
}
```

### Responsive Design
- Mobile-first approach
- Breakpoints optimisés pour tous les écrans
- Navigation adaptative avec menu hamburger

## 📞 Contact et Support

**BMS Ventouse**
- 📱 Téléphone : +33 6 46 00 56 42
- 📧 Email : contact@bmsventouse.fr
- 🌍 Zone d'intervention : France entière

## 🤝 Contribution

### Standards de Code
- **ESLint** pour JavaScript
- **Stylelint** pour CSS
- **Prettier** pour le formatage
- **Conventional Commits** pour les messages

### Workflow de Développement
1. Créer une branche feature : `git checkout -b feature/nom-feature`
2. Développer avec les outils de linting actifs
3. Tester localement : `npm start`
4. Commit avec message conventionnel : `feat: add new service section`
5. Push et créer une Pull Request

## 📄 Licence

Projet propriétaire - BMS Ventouse © 2025

