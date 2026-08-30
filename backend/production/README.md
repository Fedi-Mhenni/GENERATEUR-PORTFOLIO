# Production : trois instances Strapi

Cette configuration lance trois instances Strapi indépendantes depuis une
même image Docker, ainsi qu'un unique serveur PostgreSQL contenant trois
bases. Elle est destinée au VPS ; `../docker-compose.yml` reste la
configuration de développement local.

## Prérequis

- Docker Engine et le plugin Docker Compose sont installés sur le VPS.
- Le dépôt est présent sur le VPS, ou les fichiers de cette configuration y
  sont déployés par CI/CD.
- Les quatre fichiers de secrets existent dans `env/` et ne sont jamais
  commités : `postgres.env`, `strapi-a.env`, `strapi-b.env` et
  `strapi-c.env`.

Crée les fichiers de secrets une seule fois à partir des modèles :

```bash
cd backend
cp production/env/postgres.env.example production/env/postgres.env
cp production/env/strapi-a.env.example production/env/strapi-a.env
cp production/env/strapi-b.env.example production/env/strapi-b.env
cp production/env/strapi-c.env.example production/env/strapi-c.env
chmod 600 production/env/*.env
```

Génère les secrets Strapi avec `openssl rand -base64 32`. Chaque
`DATABASE_PASSWORD` doit être identique au `STRAPI_<A|B|C>_PASSWORD`
correspondant dans `postgres.env`. Ne donne jamais `postgres.env` à un
conteneur Strapi : il contient les secrets des trois instances.

## Construire et démarrer localement

Depuis `backend/`, construis l'image de test puis démarre les services :

```bash
docker build -f app/Dockerfile.prod -t portfolio-strapi:local app
docker compose -f compose.prod.yml up -d
docker compose -f compose.prod.yml ps
```

Les services Strapi et PostgreSQL n'ont volontairement pas de `ports:`
publiés. Ils ne sont donc pas accessibles depuis le navigateur à cette étape.
MMP-28 ajoutera Nginx, les noms de domaine et HTTPS.

## Déploiement et redéploiement sur le VPS

La CI/CD MMP-26 définira `STRAPI_IMAGE` avec une image GHCR immuable, par
exemple `ghcr.io/organisation/generateur-portfolio:<sha>`.

```bash
cd /chemin/vers/le/depot/backend
export STRAPI_IMAGE=ghcr.io/organisation/generateur-portfolio:<sha>
docker compose -f compose.prod.yml pull
docker compose -f compose.prod.yml up -d --remove-orphans
docker compose -f compose.prod.yml ps
```

Les volumes nommés `postgres_data`, `uploads_a`, `uploads_b` et `uploads_c`
ne sont pas supprimés par ce redéploiement. **N'utilise jamais**
`docker compose -f compose.prod.yml down -v` en production : `-v` supprimerait
les bases et les médias.

## Vérifications après démarrage

```bash
docker compose -f compose.prod.yml ps
docker compose -f compose.prod.yml logs --tail=100 strapi_a strapi_b strapi_c
docker stats --no-stream
```

À vérifier : PostgreSQL est `healthy`, les trois Strapi sont `Up`, les logs
indiquent `Strapi started successfully`, et chaque Strapi mentionne sa propre
base (`portfolio_a`, `portfolio_b` ou `portfolio_c`).

## Isolation et persistance

- Chaque Strapi est connecté à un seul réseau Docker interne avec PostgreSQL.
- Les utilisateurs PostgreSQL ne reçoivent des privilèges que sur leur base.
- Chaque Strapi monte son propre volume `uploads_*`.
- Le script SQL d'initialisation ne s'exécute qu'à la première création du
  volume PostgreSQL. Pour modifier les droits d'une base existante, applique
  la commande SQL explicitement ; ne recrée pas le volume en production.
