# syntax=docker/dockerfile:1.7
FROM node:24.19.0-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24.19.0-alpine AS production-dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

FROM node:24.19.0-alpine AS runtime
ENV NODE_ENV=production PORT=8080
WORKDIR /app
RUN addgroup -S angular && adduser -S angular -G angular
COPY --from=production-dependencies --chown=angular:angular /app/node_modules ./node_modules
COPY --from=build --chown=angular:angular /app/dist/Portfolio ./dist/Portfolio
COPY --chown=angular:angular package.json ./
USER angular
EXPOSE 8080
CMD ["node", "dist/Portfolio/server/server.mjs"]
