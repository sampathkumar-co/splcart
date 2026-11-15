# Standalone AI Headquarters ONLY. No SPLCART image, source or database.
FROM node:22-bookworm-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates ffmpeg fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npx prisma generate

FROM base AS build
ENV DATABASE_URL="postgresql://unused:unused@127.0.0.1:5432/hq?schema=public"
RUN npm run build

FROM node:22-bookworm-slim AS hq-web
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app /app
RUN mkdir -p /app/data/hq-media && chown -R node:node /app/data
USER node
EXPOSE 3000
CMD ["sh","-c","npx prisma migrate deploy && npm run start"]

# Dedicated code-render worker. This process NEVER publishes external content.
FROM hq-web AS hq-creative
ENV HQ_MEDIA_DIR=/app/data/hq-media
CMD ["npm","run","creative:worker"]

# The worker does NOT receive a DATABASE_URL, and no port is published publicly.
# Browser sandbox requires a hardened non-root Docker/seccomp profile on the host.
FROM mcr.microsoft.com/playwright:v1.56.1-noble AS hq-browser
ENV NODE_ENV=production
WORKDIR /app
COPY --from=base --chown=pwuser:pwuser /app /app
USER pwuser
EXPOSE 3900
CMD ["npm","run","browser:worker"]
