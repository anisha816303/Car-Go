FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY vite.config.* ./
COPY src ./src
COPY public ./public

RUN npm ci
RUN npm run build