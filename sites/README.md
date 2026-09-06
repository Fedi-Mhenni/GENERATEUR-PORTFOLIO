# sites/

Ce dossier contient un sous-dossier par user, chacun étant le code
applicatif propre à son portfolio (pages, routes, services, configuration).

Chaque site consomme le framework partagé situé dans `packages/vanilla-engine/`
(voir son README pour le détail du framework lui-même).

## Structure attendue par site
```
sites/site-<prenom>/
├── index.html
├── index.js
├── config.js       # configuration de production
├── config.local.js # configuration de développement, versionnée
├── vanilla-engine/ # lien symbolique vers packages/vanilla-engine/ (voir ci-dessous)
├── pages/
├── routes/
└── services/
```
## Lancer localement

Chaque site utilise le framework partagé situé dans
`packages/vanilla-engine/`. Après un clonage du dépôt, créer une seule fois
le lien symbolique depuis le dossier du site :

```bash
cd sites/site-<prenom>
ln -s ../../packages/vanilla-engine vanilla-engine
```
** Ceci n'est à faire qu'une fois.

Le lien n’est pas versionné, car il dépend du système de fichiers de chaque
machine. Il permet au site de charger le framework pendant le développement.

Lancer ensuite Strapi. Dans `backend/.env`, définir l’origine du frontend :

```env
CORS_ORIGIN=http://localhost:3000
```

Puis, depuis `backend/` :

```bash
docker compose up --build -d
```

Enfin, depuis la racine du dépôt, construire et servir le site :

```bash
node scripts/build-site.mjs site-<prenom>
cp sites/site-<prenom>/config.local.js dist/site-<prenom>/config.js
npx serve -s dist/site-<prenom>
```

Ouvrir `http://localhost:3000/`. 
L’option `-s` permet au routeur SPA de répondre aussi aux routes comme `/projects`. Si le port 3000 est occupé, `serve` choisit un autre port : reporter alors cette origine dans `CORS_ORIGIN`, puis redémarrer Strapi.

# Configuration locale et production

Les deux fichiers de configuration peuvent être versionnés : ils ne
contiennent que des URL publiques, jamais de secrets.

- `config.js` contient les URLs de **production** (API HTTPS publique). C’est
  la configuration qui doit être utilisée pour un build ou un déploiement.
- `config.local.js` contient les URLs de **développement local** :


Le code du site importe toujours `config.js`. Lors du lancement local, la
commande `cp` remplace donc seulement
`dist/site-<prenom>/config.js` par `config.local.js`. Le fichier source de
production n’est jamais modifié.

`dist/` est ignoré par Git. Ne pas déployer cet artefact après la copie locale :
un déploiement doit être construit à partir du `config.js` de production.

# Organiser un site, une branche, ses propres commits

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
