# Strapi — Projet Portfolio

Instance Strapi 5 (Community, TypeScript) servant de CMS Headless pour le
générateur de portfolio. Consommé en lecture seule par le framework frontend
Vanilla JS via son API REST.

## Types de contenu

| Type         | Description                         | Statut |
| ------------ | ----------------------------------- | ------ |
| `Projet`     | Projets présentés dans le portfolio |
| `Experience` | Expériences professionnelles        |
| `Competence` | Compétences techniques              |

## Workflow éditorial

Un champ personnalisé `statut` simule un workflow à 4 états, en complément du
système natif Draft/Published de Strapi (qui n'en gère nativement que 2) :
brouillon → pret_a_relire → publie → archive

Ce champ est **indépendant** du statut natif Strapi (Draft/Published).
La visibilité réelle via l'API publique reste conditionnée par l'action
"Publish" native de Strapi — le champ `statut` sert de convention d'équipe
pour suivre l'avancement éditorial, pas d'automatisation technique.

## API publique

Les endpoints en lecture seule doivent être activés manuellement pour chaque
type de contenu : **Settings → Users & Permissions → Roles → Public**, puis
autoriser `find` et `findOne`.

## Commandes disponibles

```bash
npm run develop   # Mode développement (autoReload, Content-Type Builder actif)
npm run start     # Mode production (nécessite npm run build au préalable)
npm run build     # Build de l'admin panel + compilation TypeScript
```

## Documentation Strapi

- [Documentation officielle Strapi 5](https://docs.strapi.io)
- [CLI Strapi](https://docs.strapi.io/dev-docs/cli)
