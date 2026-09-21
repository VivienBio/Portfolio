# Mesure d’audience du portfolio avec GA4

Cette intégration mesure les visites et les interactions du portfolio après accord du visiteur. Elle reste inactive tant que `GA4_MEASUREMENT_ID` est absent ou invalide. La préparation du code ne crée aucune propriété Google Analytics et ne prouve pas la réception de données dans un compte Google.

## Activer la propriété

1. Ouvrir [Google Analytics](https://analytics.google.com/) avec le compte propriétaire. S’il n’existe encore aucun compte Analytics, choisir **Commencer à mesurer**, nommer le compte **Vivien Billot** et continuer. Sinon, ouvrir **Administration → Créer → Propriété**.
2. Nommer la propriété **Portfolio Vivien Billot**, choisir le fuseau **France / Europe/Paris** et la devise **EUR**.
3. Créer un flux **Web** pour **https://vivien-billot.web.app**, nommé **Portfolio — production**. Ne pas créer un flux d’application Android : le portfolio est un site Web, même sur téléphone.
4. Copier l’identifiant de mesure du flux, au format **G-…**. Il ne s’agit ni du numéro de propriété, ni d’un identifiant `GTM-…`. Ces étapes nécessitent les droits d’édition dans la propriété. [Créer une propriété et un flux](https://support.google.com/analytics/answer/9304153?hl=fr), [retrouver l’identifiant de mesure](https://support.google.com/analytics/answer/9539598?hl=fr).
5. Dans le dépôt GitHub, ouvrir **Settings → Secrets and variables → Actions → Variables**, puis créer la variable de dépôt **GA4_MEASUREMENT_ID** avec cet identifiant. L’identifiant de mesure est public ; aucune clé de compte de service ni aucun secret d’API Google Analytics n’est nécessaire au navigateur.
6. Le workflow de déploiement transmet cette variable à l’environnement du serveur. Le navigateur lit uniquement la configuration publique via `GET /api/analytics/config`, puis vérifie que son domaine est `vivien-billot.web.app`. Les aperçus et serveurs locaux restent désactivés. Le déploiement habituel reste une étape distincte ; modifier une variable GitHub ne met pas à jour un serveur déjà déployé.

Ne pas ajouter une seconde balise dans Firebase Hosting, dans `index.html`, dans Google Tag Manager ou dans un outil tiers. Le site charge lui-même la balise après consentement.

## Réglage indispensable pour éviter les doublons

Dans **Administration → Flux de données → flux Web → Mesures améliorées**, désactiver les mesures améliorées et vérifier chaque réglage : changements de page fondés sur l’historique, défilement, clics sortants, recherche sur le site, formulaires, vidéos et téléchargements. Vérifier aussi les paramètres de détection automatique de la balise Google si l’interface les présente séparément. Cette configuration évite que des champs de formulaire, des URL complètes ou des noms de fichiers soient collectés par une deuxième instrumentation. [Paramètres des mesures améliorées](https://support.google.com/analytics/answer/9216061?hl=fr).

Le site utilise `send_page_view: false` et émet explicitement un `page_view` par changement de route. Un changement de thème, une ancre, un paramètre d’URL ou un dialogue ne crée pas une nouvelle page vue. **`send_page_view: false` seul ne suffit pas** : les événements d’historique des mesures améliorées peuvent encore générer leurs propres pages vues. [Pages vues manuelles et historique des applications monopages](https://developers.google.com/analytics/devguides/collection/ga4/views?hl=fr).

Les événements de session et l’engagement standard restent gérés par la bibliothèque GA4 après accord. Il ne faut pas recréer un chronomètre de session ni envoyer soi-même `user_engagement`. L’engagement correspond au temps pendant lequel la page est active, pas au temps écoulé depuis son ouverture. [Engagement utilisateur](https://support.google.com/analytics/answer/11109416?hl=en).

## Consentement et données transmises

Le mode retenu est un consentement **basique** : aucun chargement de balise et aucune requête Google avant **Accepter**. **Refuser** garde le portfolio, les CV et l’assistant utilisables. Les préférences se rouvrent depuis le lien du pied de page ; choisir **Refuser** après un accord retire celui-ci. Ce fonctionnement diffère du mode avancé, qui peut envoyer des signaux sans cookies lorsque le consentement est refusé. [Modes de consentement Google](https://developers.google.com/tag-platform/security/concepts/consent-mode).

Le choix est mémorisé localement pendant 180 jours dans `portfolio-analytics-consent`, sans être envoyé comme événement à Google. Le retrait désactive la collecte, supprime les cookies GA accessibles au site et recharge la page pour décharger la bibliothèque. Il n’efface pas les données déjà reçues par Google. La personnalisation publicitaire, le stockage publicitaire et les données publicitaires restent refusés ; Google Signals est désactivé dans la configuration du site. [Désactivation de la collecte par la balise](https://developers.google.com/tag-platform/security/guides/privacy).

Les événements applicatifs utilisent des valeurs prédéfinies : langue, thème, emplacement d’un bouton, canal de contact et nom des deux CV publics. Les questions du chatbot, ses réponses, les noms, emails, numéros de téléphone et contenus de formulaires ne sont pas transmis. Un clic sur le téléphone transmet uniquement le canal `phone`, jamais le numéro ni l’adresse `tel:`. Les URL de page sont normalisées vers les routes publiques, y compris les pages de confidentialité `/privacy` et `/fr/confidentialite` ; query strings et fragments sont exclus, et une URL inconnue devient `/404` ou `/fr/404`. Le référent externe est réduit à son origine ; pour une navigation interne, il indique la précédente route publique, sans paramètres ni fragment.

Pour reconnaître un lien diffusé dans un CV ou sur LinkedIn, seules ces balises de campagne sont acceptées : `utm_source` = `linkedin`, `github`, `email` ou `qrcode` ; `utm_medium` = `social`, `referral`, `email` ou `qr` ; `utm_campaign` = `portfolio`, `candidature` ou `cv`. Medium et campagne sont ignorés sans source autorisée. Exemple : `https://vivien-billot.web.app/fr?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio`. Ne jamais mettre un nom de recruteur ou une adresse email dans ces paramètres.

## Comprendre les chiffres, sans jargon

Une fois la collecte active, commencer par choisir **la même période** dans les rapports, par exemple les 28 derniers jours. Les résultats concernent uniquement la partie de l’audience qui accepte la mesure ; un zéro avant configuration n’indique pas que personne ne visite le site.

| Indicateur         | À comprendre                                                                                                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Utilisateurs       | Visiteurs distingués par GA4, pas une liste de personnes identifiées. Un même humain sur deux appareils peut être compté plusieurs fois. Vérifier si le rapport affiche les utilisateurs totaux ou actifs. |
| Sessions           | Visites : un utilisateur peut revenir plusieurs fois. Par défaut, une session expire après 30 minutes d’inactivité.                                                                                        |
| Vues               | Nombre de consultations de pages ; une personne peut générer plusieurs vues.                                                                                                                               |
| Durée d’engagement | Temps pendant lequel la page est au premier plan. Ne pas l’interpréter comme le temps total où l’onglet est resté ouvert.                                                                                  |
| Événements         | Actions comptées : ouvrir le bot, télécharger un CV, choisir une langue… Un visiteur peut effectuer la même action plusieurs fois.                                                                         |
| Événements clés    | Actions que vous avez choisies comme objectifs utiles, par exemple un clic de téléchargement du CV.                                                                                                        |

Ces notions correspondent aux métriques de GA4 ; elles répondent à des questions différentes. [Sessions](https://support.google.com/analytics/answer/12798876?hl=fr), [définitions des dimensions et métriques](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema?hl=fr).

Pour une première lecture hebdomadaire :

1. **Rapports → Temps réel** : vérifier que la visite de test apparaît après accord.
2. **Rapports → Pages et écrans** : comparer l’accueil français, l’accueil anglais et les études de cas. Regarder vues et engagement ensemble.
3. **Rapports → Acquisition de trafic** : voir d’où viennent les visites disponibles, notamment les campagnes autorisées ci-dessus.
4. **Rapports → Détails technologiques** : comparer mobile et ordinateur, puis les navigateurs. Les intitulés ou leur emplacement peuvent varier selon les objectifs choisis lors de la création ; utiliser la recherche de GA4 pour retrouver le rapport.
5. **Rapports → Événements** : ouvrir `file_download` et distinguer les CV FR/EN ; ouvrir `assistant_error` pour repérer les échecs du bot.

Trois ratios simples à comparer dans le temps, sans objectif arbitraire :

| Question                             | Calcul                                                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Les visiteurs récupèrent-ils le CV ? | Sessions comportant au moins un `file_download` ÷ sessions mesurées × 100                                                         |
| Le bot répond-il ?                   | `assistant_success` ÷ (`assistant_success` + `assistant_error`) × 100 ; les demandes encore en cours n’entrent pas dans ce calcul |
| Le bot suscite-t-il des questions ?  | Utilisateurs ayant envoyé une question après ouverture ÷ utilisateurs ayant ouvert le bot × 100, dans l’entonnoir                 |

Pour le premier ratio, utiliser des **sessions avec téléchargement**, pas le nombre brut de clics : plusieurs clics dans une même session ne doivent pas gonfler le pourcentage. Pour le deuxième, un nouvel essai est une nouvelle tentative. Comparer d’abord plusieurs semaines et lire les effectifs : un résultat sur trois visites est fragile.

## Événements et lecture des résultats

Les clics de contact instrumentés sont ceux vers l’email, le téléphone et le lien LinkedIn de la rubrique Contact. « Lire les recommandations » émet un événement distinct `recommendation_click` : c’est un intérêt pour les références professionnelles, pas une intention de contact. Les clics GitHub ne sont pas comptés comme prises de contact. Cette distinction s’applique aux événements collectés après sa mise en ligne ; les anciens clics de recommandations restent dans l’historique `contact_click`.

| Événement                               | Ce qu’il mesure                              | Interprétation                                                                                                      |
| --------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `page_view`                             | Consultation d’une route du portfolio        | Pages publiques FR/EN et études de cas ; pas les ancres                                                             |
| `file_download`                         | Clic sur l’un des CV PDF                     | `file_name`, `file_extension`, `cv_language`, `placement` ; le clic ne prouve pas que le téléchargement est terminé |
| `contact_click`                         | Clic sur un moyen de contact                 | `channel` = `email`, `phone` ou `linkedin` ; ne prouve pas qu’un message a été envoyé ou qu’un appel a abouti       |
| `recommendation_click`                  | Clic pour consulter les recommandations      | `channel: linkedin`, `placement: recommendations` ; intérêt pour les références, séparé des contacts                |
| `project_view`                          | Consultation d’une étude de cas              | `target` vaut `betclic` ou `tf1` ; aucune URL arbitraire                                                            |
| `scroll`                                | Première lecture à 90 % d’une page défilable | `percent_scrolled: 90`, une fois par page après accord                                                              |
| `assistant_open`                        | Ouverture de l’assistant                     | Intérêt pour le parcours conversationnel                                                                            |
| `assistant_send`                        | Envoi d’une question                         | Aucun texte de question                                                                                             |
| `assistant_success` / `assistant_error` | Réponse reçue ou échec                       | Aucun texte de réponse ni détail d’erreur brut                                                                      |
| `theme_change` / `language_change`      | Choix d’affichage                            | Aide à comparer les parcours FR/EN et clair/sombre                                                                  |

Consulter d’abord **Temps réel** pour la réception, **Pages et écrans** pour les routes consultées, **Acquisition de trafic** pour la provenance disponible et **Détails technologiques** pour les appareils et navigateurs. Comparer les langues et appareils avant de conclure qu’un contenu est moins utile : seuls les visiteurs ayant accepté la mesure sont représentés. [Rapport Pages et écrans](https://support.google.com/analytics/answer/12926732?co=GENIE.Platform%3DDesktop&hl=fr-FR), [rapports prédéfinis](https://developers.google.com/analytics/devguides/reporting/data/v1/predefined-reports).

Dans **Administration → Définitions personnalisées**, créer des dimensions de portée **Événement** pour les paramètres métier réellement émis : `locale`, `cv_language`, `placement`, `channel`, `theme` et `target`. Par exemple, nommer la dimension **Langue du CV**, choisir la portée **Événement**, puis saisir exactement **cv_language** comme paramètre. Ne pas dupliquer les dimensions natives de page ou d’appareil. Prévoir 24 à 48 heures pour exploiter de nouvelles dimensions dans les rapports. [Dimensions personnalisées](https://support.google.com/analytics/answer/14240153?hl=en).

Marquer `file_download` comme **événement clé** ; `contact_click` peut être ajouté comme objectif secondaire d’intention. Le portfolio ouvre un email, le téléphone ou LinkedIn et ne propose pas de formulaire d’envoi : aucun de ces clics ne prouve qu’un message est arrivé ou qu’un appel a abouti. Garder `recommendation_click` comme indicateur de lecture, séparé de cet objectif de contact. Les dimensions existantes `channel` et `placement` suffisent pour les nouvelles valeurs ; aucun nouveau paramètre personnalisé n’est nécessaire. Le terme actuel dans GA4 est « événement clé » ; une conversion Google Ads est une configuration supplémentaire qui n’est pas nécessaire ici. [Événements clés](https://support.google.com/analytics/answer/9267568?hl=en).

Créer une **Exploration de l’entonnoir** avec les étapes indirectement suivies : `page_view` → consultation d’une étude de cas (`page_view` filtré sur `/work/` ou `/fr/work/`) → `file_download` ou `contact_click`. Faire un second parcours `assistant_open` → `assistant_send` → `assistant_success`. Comparer appareil et langue, en conservant les abandons visibles. Il s’agit de modèles d’analyse proposés, pas de rapports déjà créés dans le compte. [Explorations de l’entonnoir](https://support.google.com/analytics/answer/9327974?hl=en).

## Vérification avant et après activation

Les tests `e2e/analytics.spec.ts` remplacent la configuration publique par un identifiant fictif et interceptent le script Google. Ils vérifient les commandes locales sans envoyer d’événement à une propriété réelle. Ils couvrent choix FR/EN, refus persistant, retrait, pages vues sans doublons, PDF, distinction recommandations/contact, clics téléphone sans numéro transmis, absence de texte de conversation, affichage à 320 px et accessibilité.

Après un déploiement autorisé avec le véritable identifiant :

1. Ouvrir une session privée, puis vérifier dans le réseau qu’aucune requête `googletagmanager.com` ou `google-analytics.com` ne part avant accord et après refus.
2. Accepter, naviguer de l’accueil à une étude de cas, puis télécharger un CV. Contrôler un événement par action et une page vue par route, sans query string, fragment ni texte personnel.
3. Vérifier leur réception dans **Temps réel**. Pour un diagnostic détaillé, utiliser une session de test en **DebugView**, puis désactiver le débogage ; ne pas activer `debug_mode` pour tous les visiteurs. [DebugView](https://support.google.com/analytics/answer/7201382?hl=en).
4. Retirer l’accord depuis les préférences, confirmer le rechargement et l’arrêt de la mesure. Refaire les choix en français et en anglais sur un Android réel.

La réception GA4, les réglages de propriété et les rapports nécessitent l’accès au compte propriétaire et restent à vérifier tant que cet accès et le véritable identifiant ne sont pas disponibles.
