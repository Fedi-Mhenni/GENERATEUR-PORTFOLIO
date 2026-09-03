# Production : trois APIs Strapi, Nginx et HTTPS

Cette configuration est destinée au VPS OVHcloud. Elle lance trois instances
Strapi indépendantes depuis une même image Docker, un serveur PostgreSQL avec
trois bases, et Nginx comme unique point d'entrée public. La configuration de
développement local reste séparée.

## Architecture et adresses publiques

| Instance | Base et volume | Domaine API | Frontend autorisé par CORS |
| --- | --- | --- | --- |
| `strapi_a` | `portfolio_a`, `uploads_a` | `api-portfolio-aijing.aijing.li` | `https://portfolio-aijing.vercel.app` |
| `strapi_b` | `portfolio_b`, `uploads_b` | `api-portfolio-fedi.aijing.li` | `https://portfolio-fedi-two.vercel.app` |
| `strapi_c` | `portfolio_c`, `uploads_c` | `api-portfolio-azer.aijing.li` | `https://portfolio-azer.vercel.app` |

Le back office de chaque instance est à `api-portfolio-nom.aijing.li/admin`.

Les trois enregistrements DNS de type `A` doivent pointer vers l'adresse IPv4
publique du VPS. Nginx reçoit la requête sur `80` ou `443`, puis l'envoie au
bon conteneur Strapi selon le nom de domaine. Les ports `1337` et `5432` ne
sont jamais publiés sur Internet.

## Prérequis

- Docker Engine et le plugin Docker Compose sont installés sur le VPS.
- Le dépôt est présent sur le VPS, ou les fichiers de cette configuration y
  sont déployés par CI/CD.
- Les ports SSH, `80` et `443` sont ouverts dans le pare-feu du VPS.
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

Dans chaque fichier `strapi-*.env`, conserve les valeurs `PUBLIC_URL` et
`CORS_ORIGIN` indiquées dans son modèle. Elles sont différentes pour chaque
instance : `PUBLIC_URL` indique à Strapi son URL HTTPS publique et
`CORS_ORIGIN` n'autorise que le portfolio associé dans un navigateur.

Les répertoires `certbot/conf/` et `certbot/www/` sont créés sur le VPS et ne
doivent jamais être commités : ils contiennent les certificats et les fichiers
temporaires de validation Let's Encrypt.

```bash
mkdir -p production/certbot/conf production/certbot/www
```

## Construire l'image et démarrer les services

La configuration `nginx/conf.d/apis.conf` versionnée est la configuration
finale HTTPS ; elle requiert donc que le certificat existe déjà. Lors de la
toute première installation, conserve-la temporairement dans `/tmp` et active
le modèle HTTP prévu pour Certbot, avant de démarrer les services :

```bash
cp production/nginx/conf.d/apis.conf /tmp/apis.conf.https
cp production/nginx/conf.d/apis.http.conf.example production/nginx/conf.d/apis.conf
```

Ensuite, construis l'image de test puis démarre les services :

```bash
docker build -f app/Dockerfile.prod -t portfolio-strapi:local app
docker compose -f compose.prod.yml up -d
docker compose -f compose.prod.yml ps
```

Nginx publie seulement `80` et `443`. Les services Strapi et PostgreSQL
n'ont volontairement pas de `ports:` publiés. Vérifie que Nginx atteint chaque
instance avant de demander les certificats :

```bash
docker compose -f compose.prod.yml exec nginx wget -S -O /dev/null http://strapi_a:1337/
docker compose -f compose.prod.yml exec nginx wget -S -O /dev/null http://strapi_b:1337/
docker compose -f compose.prod.yml exec nginx wget -S -O /dev/null http://strapi_c:1337/
```

Une réponse `302` vers `/admin`, suivie d'une réponse `200`, confirme que le
réseau Docker et le conteneur Strapi fonctionnent.

## Premier certificat Let's Encrypt

Avant la première demande de certificat, Nginx doit servir sur HTTP le chemin
`/.well-known/acme-challenge/` depuis `/var/www/certbot`. Vérifie ce point avec
un fichier test, puis depuis un autre ordinateur :

```bash
mkdir -p production/certbot/www/.well-known/acme-challenge
printf 'certbot-test\n' > production/certbot/www/.well-known/acme-challenge/test
curl -i http://api-portfolio-fedi.aijing.li/.well-known/acme-challenge/test
```

La réponse doit être `HTTP/1.1 200` et contenir `certbot-test`. Ne lance pas
Certbot tant que ce test ne fonctionne pas. Lorsque c'est le cas, exécute dans
`backend/` :

```bash
docker run --rm \
  -v "$(pwd)/production/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/production/certbot/www:/var/www/certbot" \
  certbot/certbot certonly \
  --webroot \
  --cert-name portfolio-apis \
  -w /var/www/certbot \
  -d api-portfolio-aijing.aijing.li \
  -d api-portfolio-fedi.aijing.li \
  -d api-portfolio-azer.aijing.li \
  --email "TON_EMAIL@example.com" \
  --agree-tos \
  --no-eff-email
```

Le certificat unique `portfolio-apis` couvre les trois domaines. Après une
réponse de succès, restaure la configuration HTTPS, puis recrée Nginx :

```bash
cp /tmp/apis.conf.https production/nginx/conf.d/apis.conf
docker compose -f compose.prod.yml up -d --force-recreate nginx
docker compose -f compose.prod.yml exec nginx nginx -t
```

Les interfaces d'administration Strapi sont ensuite accessibles via
`https://api-portfolio-<nom>.aijing.li/admin`. Elles passent elles aussi par
Nginx ; le port `1337` demeure privé.

## Déploiement et redéploiement sur le VPS

La CI/CD définira à terme `STRAPI_IMAGE` avec une image GHCR immuable, par
exemple `ghcr.io/organisation/generateur-portfolio:<sha>`. En attendant, la
commande de construction locale du VPS produit `portfolio-strapi:local`.

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

Après une modification du code Strapi ou des variables `PUBLIC_URL` /
`CORS_ORIGIN`, reconstruis puis recrée seulement les trois conteneurs Strapi :

```bash
docker build -f app/Dockerfile.prod -t portfolio-strapi:local app
docker compose -f compose.prod.yml up -d --force-recreate \
  strapi_a strapi_b strapi_c
```

N'utilise pas `docker compose down` pour cette opération : Nginx et PostgreSQL
peuvent rester en fonctionnement.

## Réinitialiser le mot de passe administrateur

Pour réinitialiser le mot de passe de l'administration du portfolio,
connecter au VPS puis exécute la commande Strapi dans le conteneur correspondant:

```bash
ssh deploy@vps-8946ad23
cd /opt/generateur-portfolio/backend

docker compose -f compose.prod.yml exec strapi_correspondant \
  npm run strapi -- admin:reset-user-password \
  --email 'your-admin-email@example.com' \
  --password 'A-new-long-unique-password'
```

Remplace l'adresse e-mail par celle du compte administrateur concerné et choisis
un mot de passe long et unique. Cette commande ne redémarre pas les services et
ne modifie ni les contenus, ni les médias. L'administration Aijing est
accessible à `https://api-portfolio-aijing.aijing.li/admin`.

## Vérifications après démarrage

```bash
docker compose -f compose.prod.yml ps
docker compose -f compose.prod.yml logs --tail=100 strapi_a strapi_b strapi_c
docker stats --no-stream
```

À vérifier : PostgreSQL est `healthy`, les trois Strapi sont `Up`, les logs
indiquent `Strapi started successfully`, et chaque Strapi mentionne sa propre
base (`portfolio_a`, `portfolio_b` ou `portfolio_c`).

Après l'activation HTTPS, vérifie aussi les trois APIs :

```bash
curl -I https://api-portfolio-aijing.aijing.li/api
curl -I https://api-portfolio-fedi.aijing.li/api
curl -I https://api-portfolio-azer.aijing.li/api
```

Un statut `401`, `403` ou `404` prouve que Nginx atteint Strapi ; un `502`
signifie que Nginx ne joint pas le conteneur concerné.

## Isolation et persistance

- Chaque Strapi est connecté à un seul réseau Docker interne avec PostgreSQL.
- Les utilisateurs PostgreSQL ne reçoivent des privilèges que sur leur base.
- Chaque Strapi monte son propre volume `uploads_*`.
- Le script SQL d'initialisation ne s'exécute qu'à la première création du
  volume PostgreSQL. Pour modifier les droits d'une base existante, applique
  la commande SQL explicitement ; ne recrée pas le volume en production.
