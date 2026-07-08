# Frontend — Vanilla-Engine

Framework JavaScript Vanilla fourni en cours , utilisé et étendu
pour consommer l'API du CMS Headless (Strapi) et générer dynamiquement les
pages du portfolio.

## Principe du framework

Pas de JSX, pas de classes de composants : un "composant" est une simple
fonction qui retourne un objet littéral décrivant une structure DOM :

```js
{
  type: "div",                          // tag HTML (obligatoire)
  attributes: [["class", ["foo"]]],     // optionnel
  events: [["click", handler]],         // optionnel
  children: ["texte", { ... }],         // optionnel, string ou objet récursif
}
```

Cet objet est ensuite converti en vrais nœuds DOM par `lib/generate-structure.js`.

## Structure

frontend/
├── index.html # Page hôte, charge index.js
├── index.js # Point d'entrée : initialise le routeur
├── config.js # Configuration (URL de l'API selon l'environnement)
├── components/
│ └── router/
│ ├── browser-router.js # Routeur (History API), adapté pour l'async
│ └── link.js # Composant de navigation
├── lib/
│ └── generate-structure.js # Moteur de rendu (objet → DOM réel)
├── pages/
│ ├── home-page.js # Page d'accueil
│ ├── projets-page.js # Liste des projets (consomme Strapi)
│ └── not-found-page.js # Page 404 (route "\*")
├── routes/
│ └── index.js # Manifeste des routes : { "/chemin": Page }
└── services/
└── strapi-api.js # Fonctions fetch vers l'API Strapi

## Origine du framework et modifications apportées

Le framework provient du dépôt de cours `decode-js`. Éléments conservés à
l'identique : `generate-structure.js`, `link.js`, `not-found-page.js`,
`index.js`.

**Seule modification apportée** : `browser-router.js` a été adapté pour
supporter des pages asynchrones (nécessaire pour appeler l'API Strapi avant de générer le rendu) :

```js
// Avant (framework original) :
const structure = generator();

// Après (notre adaptation) :
const structure = await generator();
```

## Configuration

`config.js` centralise les valeurs qui changent selon l'environnement
(actuellement, l'URL de l'API) :

```js
const config = {
  API_URL: "http://localhost:1337/api",
};

export default config;
```

Au déploiement (Raspberry Pi / VPS), seul ce fichier doit être modifié pour
pointer vers la bonne URL de l'API Strapi en production — aucun autre fichier
du projet n'a besoin d'être touché.

## Connexion à l'API Strapi

`services/strapi-api.js` centralise les appels `fetch()` vers le backend,
en s'appuyant sur `config.js` :

```js
import config from "../config.js";

export async function getProjets() {
  const response = await fetch(`${config.API_URL}/projets`);
  const json = await response.json();
  return json.data;
}
```

## Routing

Défini dans `routes/index.js`, sous forme d'un objet simple associant un
chemin à une fonction "page" :

```js
export default {
  "/": HomePage,
  "/projets": ProjetsPage,
  "*": Page404,
};
```

Le routeur ne supporte que l'égalité stricte de chemin (pas de paramètres
dynamiques du type `/projets/:id` pour l'instant).

## Démarrage local

Le routeur utilisant l'History API, le serveur doit être lancé en **mode
SPA** pour rediriger toute route inconnue vers `index.html` :

```bash
cd frontend
npx serve -s .
```

Assurez-vous que le backend Strapi tourne en parallèle (voir
`backend/README.md`) pour que les appels API fonctionnent.
