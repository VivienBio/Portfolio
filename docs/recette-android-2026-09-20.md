# Recette du portfolio — 20 septembre 2026

## Version et périmètre

- Dépôt : [VivienBio/Portfolio](https://github.com/VivienBio/Portfolio).
- Base GitHub vérifiée : `main`, commit `791fb5983dad36c63d556c7ec1655da8eea35a1b`.
- Branche locale : `codex/portfolio-android-polish`.
- Objet : stabilité du français après choix de langue, changement de thème et discussion ; amélioration de l'affichage mobile et recette des parcours publics.
- Le dépôt initial reste intact. Aucun push, aucune fusion et aucun déploiement ne font partie de cette livraison locale.

## Défauts corrigés

| Défaut constaté                                                                                                                                                        | Correction                                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Depuis `/fr`, les liens `#work`, `#contact`, `#accueil` et le lien d'évitement se résolvaient sur `/` à cause de `<base href="/">`. Le parcours retournait en anglais. | Liens Angular avec chemin de langue explicite et fragment ; défilement, focus sur la cible et restauration de position. Reproduction avant correction : clic « Lire les études de cas » → `/#work` et titre anglais. |
| Actions du bandeau rognées sur certaines largeurs ; petites cibles tactiles.                                                                                           | Boutons de langue, CV, thème et navigation accessibles ; cibles de 48 px ; navigation sur une seconde ligne et défilante sur mobile.                                                                                 |
| Texte du bandeau de principes pratiquement invisible en thème sombre.                                                                                                  | Couleurs cohérentes avec le thème, vérifiées par Axe.                                                                                                                                                                |
| Le personnage du bot pouvait recouvrir le retour en haut du pied de page.                                                                                              | Action déplacée hors de la zone du personnage et test par clic réel.                                                                                                                                                 |
| Une réponse tardive pouvait rejoindre une conversation d'une autre langue ; réception d'une réponse pouvait reprendre le focus et rappeler le clavier.                 | Conversation isolée par langue dans le composant et réponse associée à sa langue de départ ; aucune reprise de focus à réception.                                                                                    |
| Saisie vide composée d'espaces acceptée ; absence de réessai et erreurs parfois affichées dans une autre langue.                                                       | Validation des espaces, prévention des doubles envois, délai maximal de 45 s, erreurs traduites, réessai conservant la question sans doublon.                                                                        |
| Dialogue peu adapté au clavier mobile et navigation clavier incomplète.                                                                                                | Hauteur/position fondées sur `visualViewport`, ouverture sans appeler le clavier, focus modal, Tab/Maj+Tab/Échap, arrière-plan inerte et restauration du focus.                                                      |
| Une indisponibilité de `localStorage` pouvait interrompre le thème.                                                                                                    | Lecture/écriture tolérantes aux erreurs ; changement de couleur conservé pendant la session.                                                                                                                         |
| Page 404 et titre anglais sur une URL française.                                                                                                                       | Page et titre français, retour vers `/fr`, `noindex` retiré en revenant au portfolio. Test de deux 404 françaises successives.                                                                                       |

L'introduction française et anglaise a été raccourcie sans ajouter de faits ; les titres, espacements,
cartes de chiffres et diagrammes sont adaptés aux petits écrans. Les styles redondants ont été
supprimés pour conserver les budgets de compilation existants.

Le lanceur du bot devient une capsule compacte sur téléphone (environ 56 px de haut), avec son
avatar et son bouton Masquer, pour moins couvrir le contenu. Le texte indicatif du champ de
discussion reste entièrement lisible à 320 px.

## Validation locale

| Contrôle                            | Résultat                                                                                                 |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------- |
| TypeScript strict                   | Réussi                                                                                                   |
| Tests unitaires et intégration HTTP | 112 tests réussis, 20 fichiers                                                                           |
| Compilation de production SSR       | Réussie, 6 routes prérendues, aucun avertissement de budget                                              |
| Budget initial                      | 306,27 kB bruts ; transfert estimé 84,81 kB                                                              |
| Formatage Prettier                  | Réussi ; gestion des fins de ligne Windows/Linux                                                         |
| Audit npm                           | Aucune vulnérabilité signalée après mise à jour des correctifs                                           |
| Génération CV FR/EN                 | Réussie ; 2 pages A4 par langue, PDF balisés                                                             |
| Inspection PDF                      | Les 4 pages rendues avec Poppler ont été relues visuellement ; aucun débordement ni texte coupé constaté |
| Recette Chromium finale             | 46 scénarios réussis, 0 échec ; 6 exclusions car spécifiques à un autre profil ; durée 36,5 s            |
| Firefox responsive                  | Non exécuté : navigateur bloqué au lancement par Windows SideBySide/mozglue                              |

Les correctifs de dépendances restent dans la série Angular 22.1 : framework 22.1.7 et outils
22.1.8. Ils couvrent notamment les avis officiels
[SSR XSS](https://github.com/angular/angular/security/advisories/GHSA-v3p8-whq6-r5jg) et
[résolution d'URL SSR](https://github.com/angular/angular/security/advisories/GHSA-f6mr-pjwc-34m4).

### Parcours navigateur couverts

- Accueil anglais → bouton français → navigation par sections → changement clair/sombre → rechargement → question au bot → fermeture/réouverture → retour en haut.
- Parcours anglais équivalent, contrôle de l'URL, de `html.lang`, du titre principal et de la langue transmise à `/api/assistant`.
- Conversation conservée au changement de thème et réponses locales réelles en français/anglais.
- Passage FR → EN → FR, thème conservé.
- Études de cas Betclic et TF1 : navigation suivante, retour au portfolio, historique et rechargement en français.
- PDF : clic de téléchargement, nom de fichier, réponse HTTP, type MIME et signature PDF.
- Erreur du bot simulée, bouton Réessayer, question non dupliquée et reprise dans la bonne langue.
- Contrôles Axe des pages et du dialogue, thèmes clair/sombre, français/anglais ; navigation clavier du dialogue.
- Cibles tactiles, débordements horizontaux, boutons masqués ou recouverts, erreurs JavaScript/console sur les parcours principaux.
- Largeurs Android émulées : 320, 360, 390 et 430 px ; paysage 844 × 390. Bandeau desktop contrôlé à 1101, 1200 et 1440 px.

Les tests utilisent un serveur isolé et n'appellent pas OpenAI. Les scénarios de réponse nominale
utilisent le moteur local existant via la vraie API HTTP. Les tests de panne et certains tests
de géométrie utilisent des réponses simulées. Les captures des scénarios mobiles sont conservées
dans `.playwright-results/` après `npm run test:e2e`.

## Limites et recette physique restante

Aucun téléphone n'était connecté à ADB. Les preuves locales portent sur Edge/Chromium avec
émulation Android ; elles ne constituent pas une
validation sur Chrome Android, Samsung Internet et Firefox Android réels.

La suite complémentaire Firefox responsive est prête (`npm run test:e2e:firefox`), mais son
lancement est bloqué sur ce poste par l'erreur Windows SideBySide « mozglue », persistante après
réinstallation du navigateur Playwright. Aucun scénario Gecko n'a donc pu être exécuté. Cette
suite est séparée de la recette Chromium validée et reste à exécuter sur un hôte compatible.

Après publication, vérifier sur téléphone :

1. Ouvrir le site public, choisir FR par le bouton du site et alterner dix fois clair/sombre.
2. Visiter les sections et les études de cas, revenir en arrière et recharger : rester sur `/fr`.
3. Ouvrir le bot, écrire avec Gboard ou le clavier Samsung, passer portrait/paysage et fermer le clavier : saisie et bouton de fermeture toujours accessibles.
4. Envoyer une question, fermer puis rouvrir le bot pendant la réponse ; vérifier la langue et la conservation de la conversation.
5. Couper puis rétablir le réseau et utiliser Réessayer ; ne pas dupliquer la question.
6. Télécharger les deux CV et vérifier leur ouverture dans le lecteur PDF Android.
7. Vérifier TalkBack, taille de police agrandie et zoom système.

L'API IA de production, l'envoi externe de contact, la CI GitHub hébergée et le déploiement
n'ont pas été exécutés. Le site public ne change pas tant que cette version n'est pas publiée.
