FROM node:18-alpine AS base
WORKDIR /app

COPY package.json ./

COPY . .

COPY .env /

ENV GENERATE_SOURCEMAP false
RUN yarn install
RUN yarn build

FROM node:18-alpine as runner
WORKDIR /app
COPY --from=base /app/package*.json .
COPY --from=base /app/next.config.mjs ./
COPY --from=base /app/public ./public
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static


CMD ["node", "server.js"]
EXPOSE 3000

