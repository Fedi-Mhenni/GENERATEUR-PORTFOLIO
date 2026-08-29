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
- `src/prototypes/string-interpolate.js` — `String.prototype.interpolate(data)` : remplace les `{{ placeholders }}` d'une chaîne par les valeurs de `data` (voir "Interpolation de chaînes" ci-dessous)
- `src/state/` — gestion d'état réactive : `createStore(initialState)` → `getState()`, `setState(update)`, `subscribe(callback)` (implémenté avec `EventTarget`/`CustomEvent` natifs)
- `src/validation/` — validation des props de composants : `validateProps(props, schema)` → `{ valid, errors, props }` (voir "Validation des props" ci-dessous)
- `src/components/` — composants réutilisables : seul `Carte({ titre, image, description, lien })` existe pour l'instant (les 7 autres composants du backlog — header, footer, navigation, listes, pagination, éléments d'expérience, formulaire — sont reportés faute de page ou de donnée réelle les justifiant aujourd'hui)
- `tests/` — tests du framework (`node:test`) : `create-store.test.js` (`src/state/`), `validate-props.test.js` (`src/validation/`), `carte.test.js` (`src/components/`), `string-interpolate.test.js` (`src/prototypes/`)

## Interpolation de chaînes

`src/prototypes/string-interpolate.js` ajoute `interpolate(data)` à
`String.prototype` (extension de prototype natif, pas un export classique —
il suffit d'importer le fichier une fois pour que la méthode soit
disponible sur toutes les chaînes). Remplace les `{{ placeholders }}` par
la valeur correspondante dans `data`, avec support des chemins imbriqués
(`{{ a.b.c }}`). Une clé manquante à n'importe quel niveau — ou `data`
lui-même `undefined`/`null` — donne une chaîne vide, jamais une exception.

```js
import "../prototypes/string-interpolate.js";

"Bonjour {{ user.name }}".interpolate({ user: { name: "Fedi" } });
// -> "Bonjour Fedi"
```

## Validation des props

`validateProps(props, schema)` vérifie un objet `props` par rapport à un
`schema` (`{ clé: { type, required, default } }`) et retourne
`{ valid, errors, props }` — `props` est l'objet reçu complété avec les
valeurs `default` du schema pour les clés absentes. Convention du framework :
les composants reçoivent un **objet props nommé** (ex. `Carte({ titre,
image, lien })`), pas des arguments positionnels — seul `BrowserLink` fait
exception (2 paramètres simples, non concerné).

```js
import validateProps from "../validation/index.js";

const schema = { titre: { type: "string", required: true } };
const { valid, errors, props } = validateProps({ titre: "Mon projet" }, schema);
```

## Envoi d'email (EmailService)

`sendEmail(formData, config)` (`src/email/send-email.js`) envoie un email
via l'API REST d'EmailJS (appel `fetch` direct, aucun SDK). `config` porte
les identifiants EmailJS (`serviceId`, `templateId`, `publicKey`), fournis
par le site appelant.

**Répartition de la validation** : `sendEmail` ne vérifie que la
**présence** des champs requis (`nom`, `email`, `message` — schema minimal,
sans `pattern` ni `minLength`). C'est un garde-fou de dernier recours pour
le service partagé, pas la validation métier complète. Le détail des règles
(format d'email valide, longueur minimale du message, etc.) reste à la
charge du formulaire appelant (voir `sites/site-fedi/pages/contact-page.js`,
qui applique ces règles plus fines avant même d'appeler `sendEmail`). Ça
évite de dupliquer la même logique de validation à deux endroits.

Si l'appel réseau échoue (déconnexion, DNS, timeout) ou si l'API répond une
erreur, `sendEmail` retourne `{ success: false, errors }` — jamais
d'exception non gérée.

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
