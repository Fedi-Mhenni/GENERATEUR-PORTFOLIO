# Backend — CMS Headless (Strapi)

Cette partie héberge le CMS Headless (Strapi 5) utilisé pour la gestion des
contenus du portfolio (expériences, projets, compétences), conteneurisé avec
Docker et PostgreSQL.

## Stack

- **Strapi 5** (Community, TypeScript)
- **PostgreSQL 17** (Alpine)
- **Docker Compose** (2 services : `strapi_app` + `strapi_postgres`)

## Structure

backend/
├── app/ # Code source Strapi — voir app/README.md
├── docker-compose.yml # Orchestration des 2 services
├── .env # Secrets et config (jamais commité)
├── .env.example # Modèle sans valeurs sensibles
├── .gitignore
└── .dockerignore

## Démarrage

### Prérequis

- Docker et Docker Compose installés

### Installation

```bash
cp .env.example .env
```

Éditez `.env` et remplissez vos propres valeurs (secrets Strapi, identifiants
PostgreSQL). Générez des secrets aléatoires avec :

```bash
openssl rand -base64 32
```

### Lancement

```bash
docker compose up --build
```

Le premier build peut prendre plusieurs minutes (installation des dépendances +
build de l'admin panel).

Une fois démarré, l'interface d'administration est accessible sur :
http://localhost:1337/admin

Créez votre premier compte administrateur au premier lancement.

### Arrêt

```bash
docker compose down
```

⚠️ Ne jamais utiliser `docker compose down -v` sauf volonté explicite de
supprimer les données (le `-v` supprime aussi les volumes persistants).

## 🗄️ Persistance des données

Deux volumes Docker garantissent la persistance :

| Volume           | Contenu                             |
| ---------------- | ----------------------------------- |
| `postgres_data`  | Base de données PostgreSQL          |
| `strapi_uploads` | Médias uploadés (images, documents) |

Ces données survivent aux redémarrages et rebuilds, mais restent **locales à
chaque machine** — chaque membre de l'équipe a sa propre base de données et
ses propres contenus de test.

## 🩺 Healthcheck

Le service PostgreSQL intègre un healthcheck (`pg_isready`). Strapi attend
que PostgreSQL soit réellement prêt à accepter des connexions avant de
démarrer (`depends_on: condition: service_healthy`), ce qui évite les échecs
de connexion au démarrage — particulièrement utile sur un Raspberry Pi où les
I/O sont plus lents.

## ⚠️ Mode actuel : développement

Le conteneur tourne actuellement en mode `develop` (`NODE_ENV=development`),
nécessaire pour pouvoir modéliser les types de contenu via le Content-Type
Builder (désactivé en mode production).

**Avant tout déploiement réel**, repasser en mode production dans le
`Dockerfile` :

- `NODE_ENV=production`
- Utiliser le build multi-stage optimisé (`npm run build` + `npm run start`)

## 🔒 Sécurité

- Types de fichiers exécutables bloqués à l'upload (voir `app/config/plugins.ts`)
- Sessions en `httpOnly`, gestion JWT en mode `refresh`
- Aucun secret commité (`.env` dans `.gitignore`)
