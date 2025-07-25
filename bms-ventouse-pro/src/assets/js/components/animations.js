/**
 * ==========================================================================
 * MODULE ANIMATIONS - BMS VENTOUSE
 * ==========================================================================
 * Gère toutes les animations du site avec Anime.js
 * Optimisé pour le secteur audiovisuel avec des effets cinématographiques
 * 
 * @author BMS Ventouse Dev Team
 * @version 2.0.0
 * @requires anime.js
 * ==========================================================================
 */

'use strict';

/**
 * ==========================================================================
 * CONFIGURATION GLOBALE DES ANIMATIONS
 * ==========================================================================
 * Centralise tous les paramètres pour faciliter les ajustements
 */
const ANIMATION_CONFIG = {
  // Durées standard (en millisecondes)
  durations: {
    fast: 400,
    normal: 800,
    slow: 1200,
    hero: 1500
  },
  
  // Easings adaptés au secteur cinématographique
  easings: {
    smooth: 'easeOutExpo',      // Pour les entrées élégantes
    bounce: 'easeOutElastic',   // Pour les interactions ludiques
    sharp: 'easeOutCubic',      // Pour les transitions rapides
    cinematic: 'easeInOutQuart' // Pour les effets dramatiques
  },
  
  // Délais pour les animations séquentielles
  delays: {
    stagger: 100,    // Décalage entre éléments
    section: 200,    // Délai entre sections
    interaction: 50  // Délai pour les micro-interactions
  },
  
  // Seuils pour l'Intersection Observer
  thresholds: {
    mobile: 0.1,   // 10% visible sur mobile
    desktop: 0.3   // 30% visible sur desktop
  }
};

/**
 * ==========================================================================
 * CLASSE PRINCIPALE - GESTIONNAIRE D'ANIMATIONS
 * ==========================================================================
 */
class BMSAnimations {
  constructor() {
    this.isReducedMotion = this.checkReducedMotion();
    this.isMobile = this.checkMobile();
    this.observers = new Map();
    this.activeAnimations = new Set();
    
    // Initialisation différée pour optimiser les performances
    this.init();
  }

  /**
   * Vérifie si l'utilisateur préfère les animations réduites
   * @returns {boolean} True si les animations doivent être réduites
   */
  checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Détecte si l'utilisateur est sur mobile
   * @returns {boolean} True si mobile
   */
  checkMobile() {
    return window.innerWidth <= 768;
  }

  /**
   * Initialise tous les systèmes d'animation
   */
  init() {
    if (this.isReducedMotion) {
      console.log('🎬 BMS Animations: Mode réduit activé (accessibilité)');
      this.initReducedMotionMode();
      return;
    }

    console.log('🎬 BMS Animations: Initialisation complète');
    
    // Attendre que les polices soient chargées pour éviter les décalages
    document.fonts.ready.then(() => {
      this.initHeroAnimations();
      this.initScrollAnimations();
      this.initInteractionAnimations();
      this.initServiceAnimations();
    });
  }

  /**
   * Mode animations réduites pour l'accessibilité
   */
  initReducedMotionMode() {
    // Affiche immédiatement tous les éléments sans animation
    const hiddenElements = document.querySelectorAll('[data-animate]');
    hiddenElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /**
   * ==========================================================================
   * ANIMATIONS HERO - SECTION D'ACCUEIL
   * ==========================================================================
   * Séquence d'entrée dramatique adaptée au secteur audiovisuel
   */
  initHeroAnimations() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Timeline principale pour orchestrer la séquence
    const heroTimeline = anime.timeline({
      easing: ANIMATION_CONFIG.easings.cinematic,
      complete: () => {
        console.log('🎬 Animation hero terminée');
        this.triggerHeroComplete();
      }
    });

    // 1. Titre principal - Effet de révélation cinématographique
    heroTimeline.add({
      targets: '.hero h1',
      opacity: [0, 1],
      translateY: [60, 0],
      scale: [0.9, 1],
      duration: ANIMATION_CONFIG.durations.hero,
      delay: 300
    });

    // 2. Sous-titre - Apparition fluide
    heroTimeline.add({
      targets: '.hero .hero-subtitle',
      opacity: [0, 1],
      translateY: [30, 0],
      duration: ANIMATION_CONFIG.durations.normal,
      delay: ANIMATION_CONFIG.delays.section
    }, '-=800');

    // 3. Boutons d'action - Apparition séquentielle
    heroTimeline.add({
      targets: '.hero-buttons .btn',
      opacity: [0, 1],
      scale: [0.8, 1],
      translateY: [20, 0],
      duration: ANIMATION_CONFIG.durations.fast,
      delay: anime.stagger(ANIMATION_CONFIG.delays.stagger)
    }, '-=600');

    // 4. Éléments décoratifs - Effet parallaxe subtil
    heroTimeline.add({
      targets: '.hero-decoration',
      opacity: [0, 0.7],
      rotate: ['-5deg', '0deg'],
      duration: ANIMATION_CONFIG.durations.slow
    }, '-=1000');

    this.activeAnimations.add(heroTimeline);
  }

  /**
   * Callback exécuté à la fin de l'animation hero
   */
  triggerHeroComplete() {
    // Déclenche l'animation des éléments suivants
    this.animateNextSection();
    
    // Active les micro-interactions
    this.enableMicroInteractions();
  }

  /**
   * ==========================================================================
   * ANIMATIONS AU SCROLL - INTERSECTION OBSERVER
   * ==========================================================================
   * Système optimisé pour animer les éléments lors du défilement
   */
  initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length) return;

    // Configuration de l'observer selon l'appareil
    const threshold = this.isMobile ? 
      ANIMATION_CONFIG.thresholds.mobile : 
      ANIMATION_CONFIG.thresholds.desktop;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold,
      rootMargin: '50px 0px -50px 0px'
    });

    // Observer tous les éléments animables
    animatedElements.forEach(el => {
      // Prépare l'élément pour l'animation
      this.prepareElement(el);
      observer.observe(el);
    });

    this.observers.set('scroll', observer);
  }

  /**
   * Prépare un élément pour l'animation (état initial)
   * @param {HTMLElement} element - Élément à préparer
   */
  prepareElement(element) {
    const animationType = element.dataset.animate;
    
    switch (animationType) {
      case 'fade-up':
        anime.set(element, {
          opacity: 0,
          translateY: 50
        });
        break;
        
      case 'fade-left':
        anime.set(element, {
          opacity: 0,
          translateX: -50
        });
        break;
        
      case 'fade-right':
        anime.set(element, {
          opacity: 0,
          translateX: 50
        });
        break;
        
      case 'scale-in':
        anime.set(element, {
          opacity: 0,
          scale: 0.8
        });
        break;
        
      case 'rotate-in':
        anime.set(element, {
          opacity: 0,
          rotate: -10,
          scale: 0.9
        });
        break;
        
      default:
        anime.set(element, {
          opacity: 0,
          translateY: 30
        });
    }
  }

  /**
   * Anime un élément selon son type d'animation
   * @param {HTMLElement} element - Élément à animer
   */
  animateElement(element) {
    const animationType = element.dataset.animate;
    const delay = parseInt(element.dataset.delay) || 0;
    
    let animationConfig = {
      targets: element,
      opacity: 1,
      duration: ANIMATION_CONFIG.durations.normal,
      easing: ANIMATION_CONFIG.easings.smooth,
      delay
    };

    // Configuration spécifique selon le type
    switch (animationType) {
      case 'fade-up':
        animationConfig.translateY = 0;
        break;
        
      case 'fade-left':
        animationConfig.translateX = 0;
        break;
        
      case 'fade-right':
        animationConfig.translateX = 0;
        break;
        
      case 'scale-in':
        animationConfig.scale = 1;
        animationConfig.easing = ANIMATION_CONFIG.easings.bounce;
        break;
        
      case 'rotate-in':
        animationConfig.rotate = 0;
        animationConfig.scale = 1;
        animationConfig.easing = ANIMATION_CONFIG.easings.cinematic;
        break;
        
      default:
        animationConfig.translateY = 0;
    }

    const animation = anime(animationConfig);
    this.activeAnimations.add(animation);
  }

  /**
   * ==========================================================================
   * ANIMATIONS DES SERVICES - SPÉCIFIQUE AU MÉTIER
   * ==========================================================================
   * Animations adaptées aux services BMS (ventousage, sécurité, etc.)
   */
  initServiceAnimations() {
    this.animateServiceCards();
    this.animateStatsCounters();
    this.animateProcessSteps();
  }

  /**
   * Animation des cartes de services
   */
  animateServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    if (!serviceCards.length) return;

    serviceCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        anime({
          targets: card,
          scale: 1.05,
          translateY: -10,
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          duration: ANIMATION_CONFIG.durations.fast,
          easing: ANIMATION_CONFIG.easings.sharp
        });
      });

      card.addEventListener('mouseleave', () => {
        anime({
          targets: card,
          scale: 1,
          translateY: 0,
          boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
          duration: ANIMATION_CONFIG.durations.fast,
          easing: ANIMATION_CONFIG.easings.sharp
        });
      });
    });
  }

  /**
   * Animation des compteurs de statistiques
   */
  animateStatsCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.counter);
      const suffix = counter.dataset.suffix || '';
      
      anime({
        targets: { value: 0 },
        value: target,
        duration: ANIMATION_CONFIG.durations.slow,
        easing: ANIMATION_CONFIG.easings.smooth,
        update: function(anim) {
          counter.textContent = Math.round(anim.animatables[0].target.value) + suffix;
        }
      });
    });
  }

  /**
   * Animation des étapes de processus
   */
  animateProcessSteps() {
    const steps = document.querySelectorAll('.process-step');
    if (!steps.length) return;

    const timeline = anime.timeline({
      easing: ANIMATION_CONFIG.easings.smooth
    });

    steps.forEach((step, index) => {
      timeline.add({
        targets: step,
        opacity: [0, 1],
        translateX: [index % 2 === 0 ? -50 : 50, 0],
        duration: ANIMATION_CONFIG.durations.normal,
        delay: ANIMATION_CONFIG.delays.stagger * index
      }, index === 0 ? 0 : '-=600');
    });
  }

  /**
   * ==========================================================================
   * MICRO-INTERACTIONS
   * ==========================================================================
   * Petites animations qui améliorent l'expérience utilisateur
   */
  initInteractionAnimations() {
    this.animateButtons();
    this.animateFormElements();
    this.animateNavigation();
  }

  /**
   * Active les micro-interactions après l'animation hero
   */
  enableMicroInteractions() {
    // Animation des boutons au hover
    const buttons = document.querySelectorAll('.btn, .button');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        anime({
          targets: btn,
          scale: 1.05,
          duration: 200,
          easing: 'easeOutQuad'
        });
      });

      btn.addEventListener('mouseleave', () => {
        anime({
          targets: btn,
          scale: 1,
          duration: 200,
          easing: 'easeOutQuad'
        });
      });
    });
  }

  /**
   * Animation des boutons
   */
  animateButtons() {
    const ctaButtons = document.querySelectorAll('.btn-primary');
    
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Effet de ripple au clic
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        btn.appendChild(ripple);
        
        anime({
          targets: ripple,
          scale: [0, 4],
          opacity: [1, 0],
          duration: 600,
          easing: 'easeOutExpo',
          complete: () => ripple.remove()
        });
      });
    });
  }

  /**
   * Animation des éléments de formulaire
   */
  animateFormElements() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        anime({
          targets: input,
          borderColor: '#FF8C42',
          boxShadow: '0 0 0 3px rgba(255, 140, 66, 0.1)',
          duration: 300,
          easing: 'easeOutQuad'
        });
      });

      input.addEventListener('blur', () => {
        anime({
          targets: input,
          borderColor: '#e0e0e0',
          boxShadow: '0 0 0 0px rgba(255, 140, 66, 0)',
          duration: 300,
          easing: 'easeOutQuad'
        });
      });
    });
  }

  /**
   * Animation de la navigation
   */
  animateNavigation() {
    const navItems = document.querySelectorAll('.nav-link');
    
    navItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        anime({
          targets: item,
          translateY: -2,
          duration: 200,
          easing: 'easeOutQuad'
        });
      });

      item.addEventListener('mouseleave', () => {
        anime({
          targets: item,
          translateY: 0,
          duration: 200,
          easing: 'easeOutQuad'
        });
      });
    });
  }

  /**
   * ==========================================================================
   * MÉTHODES UTILITAIRES
   * ==========================================================================
   */

  /**
   * Anime la section suivante après le hero
   */
  animateNextSection() {
    const nextSection = document.querySelector('.services-preview');
    if (!nextSection) return;

    anime({
      targets: nextSection.querySelectorAll('.service-item'),
      opacity: [0, 1],
      translateY: [30, 0],
      duration: ANIMATION_CONFIG.durations.normal,
      delay: anime.stagger(ANIMATION_CONFIG.delays.stagger),
      easing: ANIMATION_CONFIG.easings.smooth
    });
  }

  /**
   * Nettoie toutes les animations actives
   */
  cleanup() {
    this.activeAnimations.forEach(animation => {
      if (animation.pause) animation.pause();
    });
    
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    
    this.activeAnimations.clear();
    this.observers.clear();
  }

  /**
   * Redémarre les animations (utile pour les changements de viewport)
   */
  restart() {
    this.cleanup();
    this.isMobile = this.checkMobile();
    this.init();
  }
}

/**
 * ==========================================================================
 * INITIALISATION ET EXPORT
 * ==========================================================================
 */

// Instance globale du gestionnaire d'animations
let bmsAnimations = null;

/**
 * Initialise le système d'animations
 */
function initBMSAnimations() {
  if (bmsAnimations) {
    bmsAnimations.cleanup();
  }
  
  bmsAnimations = new BMSAnimations();
  
  // Gestion du redimensionnement de fenêtre
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      bmsAnimations.restart();
    }, 250);
  });
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BMSAnimations, initBMSAnimations };
} else {
  window.BMSAnimations = BMSAnimations;
  window.initBMSAnimations = initBMSAnimations;
}

