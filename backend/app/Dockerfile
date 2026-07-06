# ===== STAGE 1 : BUILD =====
FROM node:22-alpine AS builder

RUN apk add --no-cache build-base python3

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===== STAGE 2 : PRODUCTION =====
FROM node:22-alpine AS production

RUN apk add --no-cache build-base python3

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# ⚠️ TEMPORAIRE : mode develop pour pouvoir modéliser le contenu
# (Content-Type Builder désactivé en mode production)
# À REMETTRE avant le déploiement final :
#   - ENV NODE_ENV=production
#   - RUN npm run build (déjà fait dans builder, à copier plutôt que rebuild ici)
#   - CMD ["npm", "run", "start"]
ENV NODE_ENV=development

EXPOSE 1337

CMD ["npm", "run", "develop"]