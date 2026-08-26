# sites/

Ce dossier contient un sous-dossier par user, chacun étant le code
applicatif propre à son portfolio (pages, routes, services, configuration).

Chaque site consomme le framework partagé situé dans `packages/vanilla-engine/`
(voir son README pour le détail du framework lui-même).

## Structure attendue par site

sites/site-<prenom>/
├── index.html
├── index.js
├── config.js
├── vanilla-engine/ # lien symbolique vers packages/vanilla-engine/ (voir ci-dessous)
├── pages/
├── routes/
└── services/

## Mise en place initiale (une seule fois, après avoir cloné le repo)

Chaque site dépend de `packages/vanilla-engine/`. Pour pouvoir développer et
tester son site **de façon isolée** (sans dépendre du reste du monorepo),
chaque étudiant doit créer un lien symbolique vers le framework partagé,
**depuis son propre dossier** :

```bash
cd sites/site-<prenom>
ln -s ../../packages/vanilla-engine vanilla-engine
```

Puis, dans `index.js`, importer le framework via ce lien local plutôt qu'un
chemin relatif traversant plusieurs dossiers :

```js
import BrowserRouter from "./vanilla-engine/src/router/browser-router.js";
```

Ce lien symbolique n'est **pas committé** dans Git (pour éviter tout
problème de compatibilité entre systèmes d'exploitation) — chacun le recrée
une fois localement après avoir cloné ou pull le repo.

## Démarrage en développement

Une fois le lien symbolique créé, chaque site peut être servi et testé de
façon totalement indépendante, directement depuis son propre dossier :

```bash
cd sites/site-<prenom>
npx serve -s -S .
```

- `-s` : mode SPA (redirige les routes inconnues vers `index.html`, nécessaire
  pour le routeur History API du framework)
- `-S` : suit les liens symboliques (indispensable, sans ce flag le serveur
  renvoie une erreur 404 sur tout ce qui passe par `vanilla-engine/`)

Puis ouvrir directement :
http://localhost:3000/

Aucun préfixe `/sites/site-xxx/` n'est nécessaire avec cette méthode — le
dossier du site devient lui-même la racine du serveur.

## Organisation Git un site, une branche, ses propres commits

Chaque étudiant travaille **exclusivement dans son propre dossier**
(`sites/site-<prenom>/`) et ne doit jamais modifier le dossier d'un autre
site. Pour éviter tout conflit :

- Toujours créer une branche dédiée avant de commencer à travailler sur son
  site (`feature/site-fedi-navigation`, `feature/site-fedi-styles`, etc.),
  jamais commit directement sur `main`.
- Ouvrir une Pull Request vers `main` une fois la fonctionnalité prête,
  avec des commits de taille raisonnable (une étape logique = un commit),
  pour faciliter la review.
- Toute modification touchant `packages/vanilla-engine/` (le framework
  partagé) doit être discutée en équipe avant d'être poussée, car elle
  impacte les 3 sites simultanément — contrairement au contenu de
  `sites/site-xxx/`, qui n'engage que son propriétaire.

## Avant tout déploiement en production

Aucun site n'est autonome tel quel en développement : chacun référence
`packages/vanilla-engine/` via un lien symbolique local, pratique pour
développer mais **incompatible avec un déploiement en production**, où
chaque site doit être isolé et ne jamais dépendre d'un dossier externe à
lui-même.

**Procédure obligatoire avant déploiement** :

1. Remplacer le lien symbolique par une vraie copie physique de
   `packages/vanilla-engine/` dans `sites/site-xxx/vanilla-engine/`
2. Vérifier que les imports restent cohérents (`./vanilla-engine/...`,
   inchangés puisque déjà relatifs au dossier local)
3. Ne déployer que ce dossier résultant, rendu autonome

Cette étape doit être automatisée dans le pipeline CI/CD

## Ajouter un nouveau site

1. Créer `sites/site-<prenom>/` en suivant la structure ci-dessus
2. S'inspirer de `site-fedi/` comme référence d'implémentation
3. Créer le lien symbolique vers le framework partagé (voir "Mise en place
   initiale" ci-dessus)
