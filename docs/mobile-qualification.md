# Qualification mobile et navigateurs

## Contrôles automatisés à chaque livraison

La CI des branches et des pull requests, puis la vérification précédant tout déploiement,
installent Chromium **et Firefox** sous Linux et exécutent `npm run test:e2e:all`.
Une erreur dans l'un des trois profils bloque le déploiement.

| Profil Playwright    | Moteur                                 | Vérifications                                                                 |
| -------------------- | -------------------------------------- | ----------------------------------------------------------------------------- |
| `desktop`            | Chromium sous Linux, Edge sous Windows | Parcours FR/EN, clavier, navigation, accessibilité, seuils du menu de bureau  |
| `mobile`             | Chromium, profil tactile Pixel 7       | Parcours FR/EN, petits écrans, portrait/paysage, assistant, PDF, consentement |
| `firefox-responsive` | Firefox, fenêtre tactile               | Mêmes parcours et matrices de tailles tactiles, avec le moteur Gecko          |

Les matrices tactiles couvrent 320, 360, 390 et 430 pixels de largeur, ainsi que
844 × 390 en paysage. Les contrôles vérifient notamment la langue après navigation,
changement de thème, rechargement et conversation, les zones tactiles de 48 pixels,
l'absence de débordement horizontal, les choix de consentement, les PDF FR/EN et AXE.
Les scénarios réservés au menu de bureau sont ignorés dans les profils tactiles, et
les matrices tactiles dans le profil de bureau : ces exclusions sont explicites.

Les captures et traces des tests échoués sont conservées sept jours dans les artefacts
GitHub Actions `browser-test-failures` ou `release-browser-test-failures`.
Ils n'utilisent ni le compte Analytics public ni les données de visiteurs.

La suite couvre aussi les seuils de navigation à 600, 760, 761, 768, 820, 1024,
1100, 1101 et 1280 px. Un parcours garde une conversation ouverte pendant les
changements téléphone → paysage → tablette → bureau → petit écran : le brouillon,
la réponse, la langue, le thème et l'accès aux commandes doivent rester conservés.

Les tests de texte agrandi à 200 % contrôlent la taille racine réellement appliquée,
les glyphes et boutons dans l'écran, le consentement, le bot et le décalage des ancres
sous un en-tête devenu plus haut. Cette simulation CSS ne remplace pas une preuve
de tous les réglages d'accessibilité Android. Les captures font l'objet d'une relecture
visuelle ; ces contrôles ne garantissent pas une identité de rendu entre tous les appareils.

## Reproduire les contrôles

Avec la version de Node indiquée par `.nvmrc` et les dépendances verrouillées :

```sh
npm ci
npx playwright install --with-deps chromium firefox
npm run build
npm run test:e2e:all
```

Pour limiter un diagnostic :

```sh
npm run test:e2e
npm run test:e2e:firefox
```

Playwright lance lui-même le serveur SSR local. Ses appels à l'assistant utilisent
le mode local sans clé OpenAI. Les tests Analytics interceptent Google : ils
vérifient le comportement du site sans générer de fausses visites publiques.

## Portée et limites des preuves

Le profil Pixel 7 de Playwright est une émulation de navigateur de bureau : il ne
prouve pas le comportement d'un téléphone physique, du clavier Android ou de TalkBack.
De même, Firefox avec une fenêtre étroite ne constitue pas un test de Firefox Android.
Samsung Internet ne doit jamais être annoncé comme testé à partir d'un simple profil
Chromium ou d'un changement de chaîne User-Agent.

Le 21 septembre 2026, un essai de lancement de Firefox sur le poste Windows a échoué
avant le chargement du site (`browserType.launch: spawn UNKNOWN`). Le contrôle Linux
dans GitHub Actions est donc la preuve attendue pour Firefox ; cette erreur locale
n'est ni une réussite de test ni une régression du site.

Un émulateur Android existant peut compléter ces contrôles avec Chrome Android sans
effacer ses données ni modifier les autres applications. Le rapport de chaque recette
doit préciser la version Android, la version de Chrome, les parcours réellement exécutés,
la révision testée et les limites éventuelles. Une qualification physique et une
évaluation TalkBack restent des preuves distinctes.
