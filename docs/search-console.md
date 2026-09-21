# Visibilité du portfolio dans Google

Le site utilise Google Search Console pour la propriété de type **Préfixe de l’URL** `https://vivien-billot.web.app/`. Ce suivi complète GA4 : il sert à comprendre l’indexation des pages et leur visibilité dans la recherche Google.

## Vérification de propriété

La balise `google-site-verification` de `src/index.html` est fournie par le compte propriétaire dans Search Console. Elle est publique, ne charge aucun script et n’exige pas l’acceptation des cookies Analytics. La conserver après validation, y compris lors d’une refonte du site.

La présence de cette balise dans le code ne prouve pas la validation du compte : après déploiement, ouvrir la propriété dans [Search Console](https://search.google.com/search-console), choisir **Balise HTML**, puis **Valider**. La page d’accueil publique doit contenir la balise exacte dans son `<head>`.

## Sitemap et rapports

Soumettre `https://vivien-billot.web.app/sitemap.xml` dans **Sitemaps**. Le fichier contient les pages FR/EN et les pages de confidentialité avec leurs liens de langue. Une soumission acceptée ou une demande d’indexation ne garantit pas une apparition dans Google ; le traitement dépend de Google.

- **Performances** : impressions, clics, requêtes et pages dans les résultats de recherche. Comparer une période cohérente, par exemple les 28 derniers jours.
- **Indexation → Pages** : vérifier les pages découvertes et les éventuelles exclusions. Les 404 ne doivent pas être ajoutées au sitemap.
- **Inspection de l’URL** : contrôler une page précise et, après un changement significatif, demander son indexation.
- **GA4** : mesurer ensuite les visites et actions des visiteurs qui acceptent Analytics. Les chiffres des deux outils répondent à des questions différentes et ne doivent pas nécessairement coïncider.

Les premiers rapports peuvent être vides pendant le traitement initial. Ne pas modifier le code ni créer de seconde balise Analytics pour remplir ces rapports.

Références : [premiers pas dans Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start?hl=fr), [méthodes de validation](https://support.google.com/webmasters/answer/9008080?hl=fr).
