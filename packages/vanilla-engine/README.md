# vanilla-engine

Framework JavaScript Vanilla partagé. Fournit le routeur (History API) et
le moteur de rendu déclaratif (`generateStructure`).

## Ce package n'est PAS déployé seul

Ce dossier est une **dépendance interne** du monorepo, consommée par chaque
site individuel dans `sites/site-xxx/`. Il ne sera pas déployé
tel quel sur un serveur de production.

## Structure

- `src/router/browser-router.js` — routeur History API (adapté pour supporter
  des pages asynchrones, seule modification par rapport au framework fourni)
- `src/router/link.js` — composant de navigation
- `src/core/generate-structure.js` — moteur de rendu (objet → DOM réel)
- `src/prototypes/string-interpolate.js` — (placeholder) méthode `String.interpolate` (extension de prototype à implémenter)
- `src/state/` — gestion d'état réactive : `createStore(initialState)` → `getState()`, `setState(update)`, `subscribe(callback)` (implémenté avec `EventTarget`/`CustomEvent` natifs)
- `src/validation/` — réservé pour la validation des props de composants (à venir)
- `src/components/` — réservé pour les composants réutilisables partagés (à venir)
- `tests/` — tests du framework (`node:test`) : `create-store.test.js` couvre `src/state/`

## Utilisation en développement

Ce package n'est pas consommé directement à sa racine — chaque site (dans
`sites/site-xxx/`) crée un lien symbolique local vers ce dossier, et le
sert de façon indépendante. Voir `sites/README.md` pour la procédure
complète (création du lien, commande `serve -s -S`).

## Tests

Le test runner natif de Node (`node:test`) est utilisé — aucune dépendance
externe nécessaire.

```bash
cd packages/vanilla-engine && node --test
```

⚠️ Sur Node v26, `node --test <chemin>` ciblant ce dossier depuis la racine
du repo ne fonctionne pas correctement (il tente de `require()` le dossier
au lieu de le scanner). Il faut soit se placer dans le package avant de
lancer la commande, soit cibler un fichier de test explicitement :
`node --test packages/vanilla-engine/tests/create-store.test.js`.

## Avant tout déploiement en production

Ce package doit être **copié** (et non lié) à l'intérieur du dossier du
site à déployer, car un site déployé doit être autonome (le serveur de
production d'un étudiant ne doit pas exposer le code des autres étudiants,
ni dépendre d'un lien symbolique fragile).
