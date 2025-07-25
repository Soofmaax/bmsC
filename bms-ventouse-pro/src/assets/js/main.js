/**
 * ==========================================================================
 * SCRIPT PRINCIPAL - BMS VENTOUSE
 * ==========================================================================
 * Point d'entrée principal pour toutes les fonctionnalités JavaScript
 * Initialise la navigation, les animations et les interactions
 * 
 * @author BMS Ventouse Dev Team
 * @version 2.0.0
 * ==========================================================================
 */

'use strict';

/**
 * ==========================================================================
 * CONFIGURATION GLOBALE
 * ==========================================================================
 */
const BMS_CONFIG = {
  // Sélecteurs DOM
  selectors: {
    header: '.header',
    nav: '.nav',
    menuToggle: '.menu-toggle',
    navLinks: '.nav-links',
    menuOverlay: '.menu-overlay',
    navLink: '.nav-link'
  },
  
  // Classes CSS
  classes: {
    menuOpen: 'menu-open',
    menuActive: 'menu-active',
    toggleActive: 'active',
    overlayActive: 'active',
    scrolled: 'scrolled',
    hidden: 'hidden'
  },
  
  // Configuration des animations
  animations: {
    duration: 300,
    easing: 'ease-out',
    stagger: 50
  },
  
  // Seuils et breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024
  },
  
  scroll: {
    threshold: 100,
    hideThreshold: 200
  }
};

/**
 * ==========================================================================
 * CLASSE PRINCIPALE - GESTIONNAIRE BMS
 * ==========================================================================
 */
class BMSManager {
  constructor() {
    this.elements = {};
    this.state = {
      isMenuOpen: false,
      isScrolled: false,
      isMobile: false,
      lastScrollY: 0,
      scrollDirection: 'up'
    };
    
    this.init();
  }

  /**
   * Initialise l'application
   */
  init() {
    console.log('🎬 BMS Ventouse: Initialisation');
    
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Configuration principale
   */
  setup() {
    try {
      this.cacheElements();
      this.detectDevice();
      this.setupEventListeners();
      this.initializeModules();
      this.setupAccessibility();
      
      console.log('✅ BMS Ventouse: Initialisation terminée');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
    }
  }

  /**
   * Met en cache les éléments DOM
   */
  cacheElements() {
    const { selectors } = BMS_CONFIG;
    
    this.elements = {
      header: document.querySelector(selectors.header),
      nav: document.querySelector(selectors.nav),
      menuToggle: document.querySelector(selectors.menuToggle),
      navLinks: document.querySelector(selectors.navLinks),
      menuOverlay: document.querySelector(selectors.menuOverlay),
      navLinkItems: document.querySelectorAll(selectors.navLink)
    };

    // Créer l'overlay s'il n'existe pas
    if (!this.elements.menuOverlay) {
      this.createMenuOverlay();
    }

    // Vérifier les éléments critiques
    if (!this.elements.header || !this.elements.menuToggle) {
      console.warn('⚠️ Éléments de navigation manquants');
    }
  }

  /**
   * Crée l'overlay du menu mobile s'il n'existe pas
   */
  createMenuOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
    this.elements.menuOverlay = overlay;
  }

  /**
   * Détecte le type d'appareil
   */
  detectDevice() {
    this.state.isMobile = window.innerWidth <= BMS_CONFIG.breakpoints.mobile;
    
    // Mise à jour de la classe sur le body
    document.body.classList.toggle('is-mobile', this.state.isMobile);
    document.body.classList.toggle('is-desktop', !this.state.isMobile);
  }

  /**
   * ==========================================================================
   * GESTION DES ÉVÉNEMENTS
   * ==========================================================================
   */
  setupEventListeners() {
    // Menu hamburger
    if (this.elements.menuToggle) {
      this.elements.menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMobileMenu();
      });
    }

    // Overlay du menu
    if (this.elements.menuOverlay) {
      this.elements.menuOverlay.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Liens de navigation
    this.elements.navLinkItems.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavClick(e, link);
      });
    });

    // Gestion du scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, 10);
    }, { passive: true });

    // Gestion du redimensionnement
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Gestion des touches clavier
    document.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });

    // Gestion des clics extérieurs
    document.addEventListener('click', (e) => {
      this.handleOutsideClick(e);
    });
  }

  /**
   * ==========================================================================
   * MENU MOBILE
   * ==========================================================================
   */
  
  /**
   * Bascule l'état du menu mobile
   */
  toggleMobileMenu() {
    if (this.state.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Ouvre le menu mobile
   */
  openMobileMenu() {
    this.state.isMenuOpen = true;
    const { classes } = BMS_CONFIG;
    
    // Mise à jour des classes
    document.body.classList.add(classes.menuOpen);
    this.elements.header?.classList.add(classes.menuActive);
    this.elements.menuToggle?.classList.add(classes.toggleActive);
    this.elements.menuOverlay?.classList.add(classes.overlayActive);
    
    // Attributs d'accessibilité
    this.elements.menuToggle?.setAttribute('aria-expanded', 'true');
    this.elements.menuToggle?.setAttribute('aria-label', 'Fermer le menu');
    this.elements.navLinks?.setAttribute('aria-hidden', 'false');
    this.elements.menuOverlay?.setAttribute('aria-hidden', 'false');
    
    // Animation d'ouverture avec Anime.js si disponible
    if (window.anime && this.elements.navLinks) {
      // Animation du menu
      anime({
        targets: this.elements.navLinks,
        translateX: ['-100%', '0%'],
        duration: BMS_CONFIG.animations.duration,
        easing: 'easeOutCubic'
      });
      
      // Animation des liens
      anime({
        targets: this.elements.navLinkItems,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 200,
        delay: anime.stagger(BMS_CONFIG.animations.stagger, { start: 100 }),
        easing: 'easeOutQuad'
      });
    }
    
    // Focus sur le premier lien
    setTimeout(() => {
      const firstLink = this.elements.navLinks?.querySelector('.nav-link');
      firstLink?.focus();
    }, BMS_CONFIG.animations.duration);
    
    console.log('📱 Menu mobile ouvert');
  }

  /**
   * Ferme le menu mobile
   */
  closeMobileMenu() {
    if (!this.state.isMenuOpen) return;
    
    this.state.isMenuOpen = false;
    const { classes } = BMS_CONFIG;
    
    // Animation de fermeture avec Anime.js si disponible
    if (window.anime && this.elements.navLinks) {
      anime({
        targets: this.elements.navLinks,
        translateX: ['0%', '-100%'],
        duration: BMS_CONFIG.animations.duration,
        easing: 'easeInCubic',
        complete: () => {
          this.resetMobileMenuClasses();
        }
      });
    } else {
      this.resetMobileMenuClasses();
    }
    
    console.log('📱 Menu mobile fermé');
  }

  /**
   * Remet à zéro les classes du menu mobile
   */
  resetMobileMenuClasses() {
    const { classes } = BMS_CONFIG;
    
    document.body.classList.remove(classes.menuOpen);
    this.elements.header?.classList.remove(classes.menuActive);
    this.elements.menuToggle?.classList.remove(classes.toggleActive);
    this.elements.menuOverlay?.classList.remove(classes.overlayActive);
    
    // Attributs d'accessibilité
    this.elements.menuToggle?.setAttribute('aria-expanded', 'false');
    this.elements.menuToggle?.setAttribute('aria-label', 'Ouvrir le menu');
    this.elements.navLinks?.setAttribute('aria-hidden', 'true');
    this.elements.menuOverlay?.setAttribute('aria-hidden', 'true');
  }

  /**
   * ==========================================================================
   * GESTION DU SCROLL
   * ==========================================================================
   */
  handleScroll() {
    const currentScrollY = window.scrollY;
    const { scroll, classes } = BMS_CONFIG;
    
    // Direction du scroll
    this.state.scrollDirection = currentScrollY > this.state.lastScrollY ? 'down' : 'up';
    
    // Header sticky
    if (currentScrollY > scroll.threshold && !this.state.isScrolled) {
      this.state.isScrolled = true;
      this.elements.header?.classList.add(classes.scrolled);
    } else if (currentScrollY <= scroll.threshold && this.state.isScrolled) {
      this.state.isScrolled = false;
      this.elements.header?.classList.remove(classes.scrolled);
    }
    
    // Masquage du header (optionnel)
    if (currentScrollY > scroll.hideThreshold) {
      if (this.state.scrollDirection === 'down' && !this.state.isMenuOpen) {
        this.elements.header?.classList.add(classes.hidden);
      } else if (this.state.scrollDirection === 'up') {
        this.elements.header?.classList.remove(classes.hidden);
      }
    }
    
    this.state.lastScrollY = currentScrollY;
  }

  /**
   * ==========================================================================
   * NAVIGATION ET LIENS
   * ==========================================================================
   */
  handleNavClick(e, link) {
    const href = link.getAttribute('href');
    
    // Gestion des ancres internes
    if (href && href.startsWith('#')) {
      e.preventDefault();
      this.scrollToSection(href);
      this.closeMobileMenu();
      return;
    }
    
    // Fermer le menu pour les liens externes
    if (this.state.isMenuOpen) {
      this.closeMobileMenu();
    }
    
    // Mettre à jour le lien actif
    this.setActiveLink(link);
  }

  /**
   * Scroll fluide vers une section
   */
  scrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;
    
    const headerHeight = this.elements.header?.offsetHeight || 70;
    const targetPosition = target.offsetTop - headerHeight - 20;
    
    if (window.anime) {
      anime({
        targets: document.documentElement,
        scrollTop: targetPosition,
        duration: 800,
        easing: 'easeInOutCubic'
      });
    } else {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Met à jour le lien actif
   */
  setActiveLink(activeLink) {
    this.elements.navLinkItems.forEach(link => {
      link.classList.remove('active');
      link.setAttribute('aria-current', 'false');
    });
    
    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.setAttribute('aria-current', 'page');
    }
  }

  /**
   * ==========================================================================
   * GESTION DES ÉVÉNEMENTS CLAVIER ET SOURIS
   * ==========================================================================
   */
  handleKeydown(e) {
    switch (e.key) {
      case 'Escape':
        this.closeMobileMenu();
        break;
        
      case 'Tab':
        if (this.state.isMenuOpen) {
          this.handleTabNavigation(e);
        }
        break;
    }
  }

  /**
   * Gestion de la navigation au clavier dans le menu
   */
  handleTabNavigation(e) {
    if (!this.elements.navLinks) return;
    
    const focusableElements = this.elements.navLinks.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  }

  /**
   * Gestion des clics extérieurs
   */
  handleOutsideClick(e) {
    if (this.state.isMenuOpen && 
        !this.elements.nav?.contains(e.target) && 
        !this.elements.menuToggle?.contains(e.target)) {
      this.closeMobileMenu();
    }
  }

  /**
   * ==========================================================================
   * GESTION DU REDIMENSIONNEMENT
   * ==========================================================================
   */
  handleResize() {
    const wasMobile = this.state.isMobile;
    this.detectDevice();
    
    // Fermer le menu si on passe en desktop
    if (wasMobile && !this.state.isMobile && this.state.isMenuOpen) {
      this.closeMobileMenu();
    }
    
    // Redémarrer les animations si nécessaire
    if (window.bmsAnimations && wasMobile !== this.state.isMobile) {
      window.bmsAnimations.restart();
    }
  }

  /**
   * ==========================================================================
   * INITIALISATION DES MODULES
   * ==========================================================================
   */
  initializeModules() {
    // Initialiser les animations si disponibles
    if (window.initBMSAnimations) {
      window.initBMSAnimations();
    }
    
    // Initialiser d'autres modules si nécessaires
    this.initializeFormHandlers();
    this.initializeScrollSpy();
  }

  /**
   * Initialise les gestionnaires de formulaires
   */
  initializeFormHandlers() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        this.handleFormSubmit(e, form);
      });
    });
  }

  /**
   * Gestion de la soumission de formulaires
   */
  handleFormSubmit(e, form) {
    // Validation basique
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });
    
    if (!isValid) {
      e.preventDefault();
      console.log('❌ Formulaire invalide');
    }
  }

  /**
   * Initialise le scroll spy pour les liens de navigation
   */
  initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const navLink = document.querySelector(`a[href="#${id}"]`);
          if (navLink) {
            this.setActiveLink(navLink);
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
  }

  /**
   * ==========================================================================
   * ACCESSIBILITÉ
   * ==========================================================================
   */
  setupAccessibility() {
    // Configuration ARIA pour la navigation
    if (this.elements.navLinks) {
      this.elements.navLinks.setAttribute('role', 'navigation');
      this.elements.navLinks.setAttribute('aria-label', 'Navigation principale');
    }
    
    // Configuration du bouton de menu
    if (this.elements.menuToggle) {
      this.elements.menuToggle.setAttribute('aria-expanded', 'false');
      this.elements.menuToggle.setAttribute('aria-controls', 'main-navigation');
      this.elements.menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
    }
    
    // Gestion du focus visible
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  /**
   * ==========================================================================
   * MÉTHODES UTILITAIRES
   * ==========================================================================
   */
  
  /**
   * Nettoie les événements et réinitialise l'état
   */
  destroy() {
    this.closeMobileMenu();
    document.body.classList.remove('menu-open', 'is-mobile', 'is-desktop');
    console.log('🧹 BMS Manager détruit');
  }
}

/**
 * ==========================================================================
 * INITIALISATION GLOBALE
 * ==========================================================================
 */

// Instance globale du gestionnaire
let bmsManager = null;

/**
 * Initialise l'application BMS
 */
function initBMS() {
  if (bmsManager) {
    bmsManager.destroy();
  }
  
  bmsManager = new BMSManager();
  
  // Exposer globalement pour le debug
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.bmsManager = bmsManager;
    window.BMS_CONFIG = BMS_CONFIG;
  }
}

// Auto-initialisation
initBMS();

// Export pour les modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BMSManager, initBMS, BMS_CONFIG };
} else {
  window.BMSManager = BMSManager;
  window.initBMS = initBMS;
}

