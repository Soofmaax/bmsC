/**
 * ==========================================================================
 * FICHIER DE CONFIGURATION FINAL POUR ELEVENTY - PROJET C
 * ==========================================================================
 * Ce fichier est optimisé pour la structure de dossiers propre du projet final.
 * Il garantit que tous les assets (CSS, JS, images) et les pages
 * sont correctement traités et placés dans le site final.
 */

module.exports = function(eleventyConfig) {

  // --------------------------------------------------------------------------
  // PASSTHROUGH FILE COPY
  // --------------------------------------------------------------------------
  // Indique à Eleventy de copier les assets et autres fichiers statiques
  // depuis le dossier `src` vers le dossier de sortie `_site`.

  // Copie le dossier entier des assets (CSS, JS, images, etc.)
  // Le chemin "src/assets" devient "assets" dans le site final.
  eleventyConfig.addPassthroughCopy("src/assets");

  // Copie les fichiers de configuration de Netlify depuis le dossier `config`
  // vers la racine du site final. C'est crucial pour que Netlify les lise.
  eleventyConfig.addPassthroughCopy({ "config": "/" });


  // --------------------------------------------------------------------------
  // CONFIGURATION DES DOSSIERS
  // --------------------------------------------------------------------------
  // Définit la structure de notre projet pour qu'Eleventy sache où chercher.

  return {
    dir: {
      // Le dossier principal où se trouvent toutes nos sources.
      input: "src",

      // Le dossier où se trouvent les pages de contenu (index.html, etc.).
      // Ce chemin est relatif au dossier `input`, donc il cherche dans `src/pages`.
      data: "../_data", // Si vous avez un dossier _data, sinon ignorez
      includes: "_includes",

      // Le dossier où le site final sera généré.
      output: "_site"
    },

    // Permet d'utiliser des fonctionnalités avancées (variables, includes)
    // dans les fichiers .html, .md, etc.
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
