
Ce dossier contient un sous-dossier par user, chacun étant le code
applicatif propre à son portfolio (pages, routes, services, configuration).

Chaque site consomme le framework partagé situé dans `packages/vanilla-engine/`
(voir son README pour le détail du framework lui-même).

# Structure attendue par site
```
sites/site-<prenom>/
├── index.html
├── index.js
├── config.js       # configuration de production
├── config.local.js # configuration de développement
├── vanilla-engine/ # lien symbolique vers packages/vanilla-engine/ (voir ci-dessous)
├── pages/
├── routes/
└── services/
```

# Lancer localement
Pour lancer localement et connecter le front local et le back local:

---
** Ceci n'est à faire qu'une fois.

1. Créer un fichier `config.local.js` dans `sites/site-<prenom à remplacer>` avec
```
const config = {
    API_ORIGIN: "http://localhost:1337",
    API_URL: "http://localhost:1337/api",
};

export default config;
```
2. Créer une seule fois le lien symbolique depuis `sites/site-<prenom à remplacer>`
```bash
cd sites/site-<prenom>
ln -s ../../packages/vanilla-engine vanilla-engine
```
Chaque site utilise le framework partagé situé dans `packages/vanilla-engine/`.

3. Dans `backend/.env`, ajouter une ligne:
```
CORS_ORIGIN=http://localhost:3000
```

** Ceci n'est à faire qu'une fois.

---

4.Lance le compose à `/backend`

5.Depuis racine de projet, lance
```
node scripts/build-site.mjs site-<prenom>
cp sites/site-<prenom>/config.local.js dist/site-<prenom>/config.js
npx serve -s dist/site-<prenom>
```
Normalement le site est servi à  `http://localhost:3000/`.  Si le port 3000 est occupé, `serve` choisit un autre port : reporter alors cette origine dans `CORS_ORIGIN`, puis redémarrer Strapi.

**❗️ À CHAQUE modification, relancez les commandes de l’étape 5 afin de reconstruire et visualiser le site. ❗️**

## Petite explication
- `config.js` contient les URLs de **production** (API HTTPS publique). C’est
  la configuration qui doit être utilisée pour un build ou un déploiement.
- `config.local.js` contient les URLs de **développement local** :


Le code du site importe toujours `config.js`. Lors du lancement local, la  commande `cp` remplace donc seulement `dist/site-<prenom>/config.js` par `config.local.js`. Le fichier source de
production n’est jamais modifié.

`dist/` est ignoré par Git. Ne pas déployer cet artefact après la copie locale : un déploiement doit être construit à partir du `config.js` de production.


# Production
L'environnement local et la production est complètement séparés.

Pour accéder admin Strapi et sites en production:

| Portfolio | Front | Back office |
|---|---|---|
| Aijing | https://portfolio-aijing.vercel.app | https://api-portfolio-aijing.aijing.li/admin |
| Fedi | https://portfolio-fedi-two.vercel.app | https://api-portfolio-fedi.aijing.li/admin |
| Azer | https://portfolio-azer.vercel.app | https://api-portfolio-azer.aijing.li/admin |


# Ajouter un nouveau site

1. Créer `sites/site-<prenom>/` en suivant la structure ci-dessus
2. S'inspirer de `site-fedi/` comme référence d'implémentation
3. Créer le lien symbolique vers le framework partagé (voir "Mise en place
   initiale" ci-dessus)
