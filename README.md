# Générateur de portfolios

Ce projet scolaire consiste à concevoir un générateur de portfolios web moderne et réutilisable.
Il permet de mettre en valeur le parcours, les compétences et les projets de chaque étudiant à travers un site personnel.

L’architecture repose sur un CMS headless Strapi pour administrer les contenus (profil, expériences, projets et compétences), séparé du frontend.
Les sites consomment ensuite ces données grâce à un framework frontend développé sur mesure dans le projet. Ce framework mutualise les briques essentielles, comme le rendu des pages, le routage, la gestion de l’état et des composants réutilisables.

Trois portfolios indépendants ont été réalisés à partir de cette base commune. Chaque site conserve son identité visuelle et ses contenus propres, tout en profitant de la même architecture technique.

# Structure de projet

```text
GENERATEUR-PORTFOLIO/
├── .github/workflows/          # Intégration continue et déploiements
├── backend/                    # CMS headless Strapi et sa configuration
│   ├── app/                    # Code source, types de contenu et API Strapi
│   └── production/             # Configuration de mise en production
├── packages/
│   └── vanilla-engine/         # Framework frontend développé pour le projet
├── sites/                      # Les trois portfolios indépendants
│   ├── site-aijing/ 
│   ├── site-fedi/  
│   └── site-azer/ 
├── scripts/                    # Scripts utilitaires de build
└── README.md                   
```

Chaque portfolio possède ses propres pages, composants, styles, routes et
services. Ils s’appuient tous sur `vanilla-engine` pour partager le même socle
technique, tout en restant visuellement et fonctionnellement indépendants.

# Liens de portfolios

- [Portfolio d’Aijing](https://portfolio-aijing.vercel.app)
- [Portfolio de Fedi](https://portfolio-fedi-two.vercel.app)
- [Portfolio d’Azer](https://portfolio-azer.vercel.app)

Les détails techniques et les consignes de chaque partie du projet sont disponibles dans les README de leurs dossiers respectifs.
