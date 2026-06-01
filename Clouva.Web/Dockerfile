FROM node:24-alpine

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5173

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
