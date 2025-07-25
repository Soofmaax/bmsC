/**
 * ==========================================================================
 * Script principal pour BMS Ventouse
 * ==========================================================================
 * Gère les interactions du site comme le menu hamburger et l'accordéon FAQ.
 * Le code est structuré en modules pour une meilleure lisibilité et maintenance.
 */

// 'DOMContentLoaded' s'assure que le script ne s'exécute que lorsque
// la totalité de la page HTML est chargée et prête. C'est une bonne pratique
// pour éviter les erreurs JavaScript.
document.addEventListener('DOMContentLoaded', () => {

  /**
   * --------------------------------------------------------------------------
   * MODULE: MENU HAMBURGER (pour la navigation mobile)
   * --------------------------------------------------------------------------
   * Gère l'ouverture et la fermeture du menu de navigation sur les petits écrans.
   */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // On vérifie que les éléments du menu existent avant d'ajouter des écouteurs.
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      // Ajoute ou retire la classe 'active' sur le bouton et le menu
      // pour déclencher les animations et l'affichage en CSS.
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Met à jour l'attribut aria-expanded pour l'accessibilité.
      // C'est crucial pour les lecteurs d'écran.
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
    });
  }


  /**
   * --------------------------------------------------------------------------
   * MODULE: ACCORDÉON POUR LA FAQ
   * --------------------------------------------------------------------------
   * Rend les questions de la FAQ cliquables pour afficher/masquer les réponses.
   */
  const faqItems = document.querySelectorAll('.faq-item');

  // On vérifie qu'il y a bien des éléments de FAQ sur la page.
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      // On s'assure que chaque item a bien une question et une réponse.
      if (question && answer) {
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');

          // On ferme d'abord tous les autres items pour n'en avoir qu'un d'ouvert.
          faqItems.forEach(otherItem => {
            if (otherItem !== item) { // On ne ferme pas celui sur lequel on vient de cliquer
              otherItem.classList.remove('is-open');
              otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
              otherItem.querySelector('.faq-answer').style.maxHeight = null; // Réinitialise la hauteur
            }
          });

          // Ensuite, on gère l'ouverture/fermeture de l'item cliqué.
          if (isOpen) {
            // Si c'était déjà ouvert, on le ferme.
            item.classList.remove('is-open');
            question.setAttribute('aria-expanded', 'false');
            answer.style.maxHeight = null;
          } else {
            // Sinon, on l'ouvre.
            item.classList.add('is-open');
            question.setAttribute('aria-expanded', 'true');
            // On calcule la hauteur nécessaire pour l'animation de déploiement.
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        });
      }
    });
  }

});
