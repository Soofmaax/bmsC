/**
 * ==========================================================================
 * MODULE NAVIGATION - BMS VENTOUSE
 * ==========================================================================
 * Gère la navigation responsive et les interactions du menu
 * Optimisé pour l'accessibilité et les performances
 * 
 * @author BMS Ventouse Dev Team
 * @version 2.0.0
 * ==========================================================================
 */

'use strict';

/**
 * ==========================================================================
 * CLASSE GESTIONNAIRE DE NAVIGATION
 * ==========================================================================
 */
class BMSNavigation {
  constructor() {
    this.header = document.querySelector('.header');
    this.nav = document.querySelector('.nav');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.menuOverlay = document.querySelector('.menu-overlay');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.dropdowns = document.querySelectorAll('.dropdown');
    
    // États
    this.isMenuOpen = false;
    this.isScrolled = false;
    this.lastScrollY = 0;
    this.scrollDirection = 'up';
    
    // Configuration
    this.config = {
      scrollThreshold: 100,        // Seuil pour header sticky
      hideThreshold: 200,          // Seuil pour masquer le header
      debounceDelay: 10,          // Délai pour le debounce du scroll
      animationDuration: 300      // Durée des animations
    };
    
    this.init();
  }

  /**
   * Initialise tous les composants de navigation
   */
  init() {
    if (!this.header) {
      console.warn('🧭 Navigation: Header non trouvé');
      return;
    }

    console.log('🧭 Navigation: Initialisation');
    
    this.setupEventListeners();
    this.setupAccessibility();
    this.setupScrollBehavior();
    this.setupActiveLink();
  }

  /**
   * ==========================================================================
   * GESTION DES ÉVÉNEMENTS
   * ==========================================================================
   */
  setupEventListeners() {
    // Menu hamburger
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }

    // Overlay du menu mobile
    if (this.menuOverlay) {
      this.menuOverlay.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Liens de navigation
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavClick(e, link);
      });
    });

    // Dropdowns (si présents)
    this.dropdowns.forEach(dropdown => {
      this.setupDropdown(dropdown);
    });

    // Gestion du scroll avec debounce
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
      }, this.config.debounceDelay);
    }, { passive: true });

    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Gestion de l'échappement pour fermer les menus
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
        this.closeAllDropdowns();
      }
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
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Ouvre le menu mobile avec animation
   */
  openMobileMenu() {
    this.isMenuOpen = true;
    
    // Mise à jour des classes CSS
    document.body.classList.add('menu-open');
    this.header.classList.add('menu-active');
    this.menuToggle.classList.add('active');
    this.menuToggle.setAttribute('aria-expanded', 'true');
    
    // Animation d'ouverture si Anime.js est disponible
    if (window.anime) {
      // Animation du menu
      anime({
        targets: this.nav,
        translateX: ['-100%', '0%'],
        duration: this.config.animationDuration,
        easing: 'easeOutCubic'
      });
      
      // Animation des liens avec stagger
      anime({
        targets: this.navLinks,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 200,
        delay: anime.stagger(50, { start: 100 }),
        easing: 'easeOutQuad'
      });
      
      // Animation de l'overlay
      anime({
        targets: this.menuOverlay,
        opacity: [0, 1],
        duration: this.config.animationDuration,
        easing: 'easeOutQuad'
      });
    }
    
    // Focus sur le premier lien pour l'accessibilité
    const firstLink = this.nav.querySelector('.nav-link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), this.config.animationDuration);
    }
    
    console.log('🧭 Menu mobile ouvert');
  }

  /**
   * Ferme le menu mobile avec animation
   */
  closeMobileMenu() {
    if (!this.isMenuOpen) return;
    
    this.isMenuOpen = false;
    
    // Animation de fermeture si Anime.js est disponible
    if (window.anime) {
      anime({
        targets: this.nav,
        translateX: ['0%', '-100%'],
        duration: this.config.animationDuration,
        easing: 'easeInCubic',
        complete: () => {
          this.resetMobileMenuClasses();
        }
      });
      
      anime({
        targets: this.menuOverlay,
        opacity: [1, 0],
        duration: this.config.animationDuration,
        easing: 'easeInQuad'
      });
    } else {
      this.resetMobileMenuClasses();
    }
    
    console.log('🧭 Menu mobile fermé');
  }

  /**
   * Remet à zéro les classes du menu mobile
   */
  resetMobileMenuClasses() {
    document.body.classList.remove('menu-open');
    this.header.classList.remove('menu-active');
    this.menuToggle.classList.remove('active');
    this.menuToggle.setAttribute('aria-expanded', 'false');
  }

  /**
   * ==========================================================================
   * GESTION DU SCROLL
   * ==========================================================================
   */
  
  /**
   * Gère le comportement du header au scroll
   */
  handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDifference = currentScrollY - this.lastScrollY;
    
    // Détermine la direction du scroll
    if (scrollDifference > 0) {
      this.scrollDirection = 'down';
    } else if (scrollDifference < 0) {
      this.scrollDirection = 'up';
    }
    
    // Header sticky
    if (currentScrollY > this.config.scrollThreshold && !this.isScrolled) {
      this.isScrolled = true;
      this.header.classList.add('scrolled');
      
      // Animation d'apparition du header sticky
      if (window.anime) {
        anime({
          targets: this.header,
          translateY: [-100, 0],
          duration: 400,
          easing: 'easeOutCubic'
        });
      }
    } else if (currentScrollY <= this.config.scrollThreshold && this.isScrolled) {
      this.isScrolled = false;
      this.header.classList.remove('scrolled');
    }
    
    // Masquage du header lors du scroll vers le bas (optionnel)
    if (currentScrollY > this.config.hideThreshold) {
      if (this.scrollDirection === 'down' && !this.isMenuOpen) {
        this.header.classList.add('hidden');
      } else if (this.scrollDirection === 'up') {
        this.header.classList.remove('hidden');
      }
    }
    
    this.lastScrollY = currentScrollY;
  }

  /**
   * ==========================================================================
   * GESTION DES LIENS ET NAVIGATION
   * ==========================================================================
   */
  
  /**
   * Gère le clic sur un lien de navigation
   * @param {Event} e - Événement de clic
   * @param {HTMLElement} link - Lien cliqué
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
    
    // Ferme le menu mobile pour les liens externes
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    }
    
    // Mise à jour du lien actif
    this.setActiveLink(link);
  }

  /**
   * Scroll fluide vers une section
   * @param {string} targetId - ID de la section cible
   */
  scrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;
    
    const headerHeight = this.header.offsetHeight;
    const targetPosition = target.offsetTop - headerHeight - 20;
    
    // Scroll fluide natif ou avec animation
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
    
    console.log(`🧭 Scroll vers ${targetId}`);
  }

  /**
   * Met à jour le lien actif dans la navigation
   * @param {HTMLElement} activeLink - Lien à marquer comme actif
   */
  setActiveLink(activeLink) {
    // Retire la classe active de tous les liens
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      link.setAttribute('aria-current', 'false');
    });
    
    // Ajoute la classe active au lien courant
    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.setAttribute('aria-current', 'page');
    }
  }

  /**
   * Détermine et marque le lien actif selon la page courante
   */
  setupActiveLink() {
    const currentPath = window.location.pathname;
    
    this.navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      
      if (linkPath === currentPath || 
          (currentPath === '/' && linkPath === '/index.html') ||
          (currentPath.includes(linkPath) && linkPath !== '/')) {
        this.setActiveLink(link);
      }
    });
  }

  /**
   * ==========================================================================
   * DROPDOWNS (SI PRÉSENTS)
   * ==========================================================================
   */
  
  /**
   * Configure un dropdown
   * @param {HTMLElement} dropdown - Élément dropdown
   */
  setupDropdown(dropdown) {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (!trigger || !menu) return;
    
    // Événements du trigger
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleDropdown(dropdown);
    });
    
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleDropdown(dropdown);
      }
    });
    
    // Fermeture au clic extérieur
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        this.closeDropdown(dropdown);
      }
    });
  }

  /**
   * Bascule l'état d'un dropdown
   * @param {HTMLElement} dropdown - Dropdown à basculer
   */
  toggleDropdown(dropdown) {
    const isOpen = dropdown.classList.contains('open');
    
    // Ferme tous les autres dropdowns
    this.closeAllDropdowns();
    
    if (!isOpen) {
      this.openDropdown(dropdown);
    }
  }

  /**
   * Ouvre un dropdown
   * @param {HTMLElement} dropdown - Dropdown à ouvrir
   */
  openDropdown(dropdown) {
    dropdown.classList.add('open');
    
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'true');
    }
    
    // Animation d'ouverture
    if (window.anime && menu) {
      anime({
        targets: menu,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 200,
        easing: 'easeOutQuad'
      });
    }
  }

  /**
   * Ferme un dropdown
   * @param {HTMLElement} dropdown - Dropdown à fermer
   */
  closeDropdown(dropdown) {
    dropdown.classList.remove('open');
    
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Ferme tous les dropdowns
   */
  closeAllDropdowns() {
    this.dropdowns.forEach(dropdown => {
      this.closeDropdown(dropdown);
    });
  }

  /**
   * ==========================================================================
   * ACCESSIBILITÉ
   * ==========================================================================
   */
  
  /**
   * Configure l'accessibilité de la navigation
   */
  setupAccessibility() {
    // Configuration du menu toggle
    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-expanded', 'false');
      this.menuToggle.setAttribute('aria-controls', 'main-navigation');
      this.menuToggle.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    }
    
    // Configuration de la navigation
    if (this.nav) {
      this.nav.setAttribute('id', 'main-navigation');
      this.nav.setAttribute('aria-label', 'Navigation principale');
    }
    
    // Configuration des liens
    this.navLinks.forEach(link => {
      link.setAttribute('aria-current', 'false');
    });
    
    console.log('🧭 Accessibilité configurée');
  }

  /**
   * ==========================================================================
   * GESTION DU REDIMENSIONNEMENT
   * ==========================================================================
   */
  
  /**
   * Gère le redimensionnement de la fenêtre
   */
  handleResize() {
    // Ferme le menu mobile si on passe en desktop
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMobileMenu();
    }
    
    // Ferme tous les dropdowns
    this.closeAllDropdowns();
  }

  /**
   * ==========================================================================
   * MÉTHODES UTILITAIRES
   * ==========================================================================
   */
  
  /**
   * Nettoie les événements et animations
   */
  destroy() {
    // Supprime les classes ajoutées
    document.body.classList.remove('menu-open');
    this.header.classList.remove('scrolled', 'hidden', 'menu-active');
    
    // Ferme tous les menus
    this.closeMobileMenu();
    this.closeAllDropdowns();
    
    console.log('🧭 Navigation détruite');
  }

  /**
   * Redémarre la navigation (utile pour les changements dynamiques)
   */
  restart() {
    this.destroy();
    this.init();
  }
}

/**
 * ==========================================================================
 * INITIALISATION ET EXPORT
 * ==========================================================================
 */

// Instance globale de la navigation
let bmsNavigation = null;

/**
 * Initialise le système de navigation
 */
function initBMSNavigation() {
  if (bmsNavigation) {
    bmsNavigation.destroy();
  }
  
  bmsNavigation = new BMSNavigation();
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BMSNavigation, initBMSNavigation };
} else {
  window.BMSNavigation = BMSNavigation;
  window.initBMSNavigation = initBMSNavigation;
}

