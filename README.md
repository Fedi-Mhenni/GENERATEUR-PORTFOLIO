## Objectif du projet

Concevoir et piloter le développement d'un générateur de portfolio dynamique,
en démontrant une maîtrise complète du cycle de vie projet : conception UI/UX,
ingénierie frontend (framework maison), et pilotage (appels d'offres, risques,
recette).

# Structure du projet
GENERATEUR-PORTFOLIO/
├── .github/
│   └── workflows/
│       ├── backend-deploy.yml        # Strapi → Render
│       ├── sites-deploy.yml          # 3 fronts → Vercel (path-filtered)
│       └── ci.yml                    # lint + tests on PR
├── backend/                          # Strapi
│   ├── src/api/                      # content-types, controllers
│   ├── config/
│   └── Dockerfile
├── packages/
│   └── vanilla-engine/               # Le framework
│       ├── src/
│       │   ├── core/                 # render engine (DOM/VDOM)
│       │   ├── router/               # SPA router
│       │   ├── state/                # reactive state management
│       │   ├── components/           # composants réutilisables (header, footer, pagination)
│       │   ├── validation/           # props validation
│       │   ├── prototypes/           # String.interpolate, extensions natives
│       │   └── index.js              # point d'entrée ES module
│       └── tests/
├── sites/                            # 3 workstreams individuels
│   ├── site-etudiant1/
│   │   ├── public/                   # index.html, assets
│   │   ├── src/
│   │   │   ├── templates/            # markup + bindings uniquement
│   │   │   ├── pages/
│   │   │   └── main.js
│   │   ├── scss/                     # thème = couche CSS séparée
│   │   └── vercel.json
│   ├── site-etudiant2/
│   └── site-etudiant3/
├── package.json                      # npm workspaces (racine)
└── README.md