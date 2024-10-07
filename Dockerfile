
FROM node:20-alpine as base
COPY . /app

WORKDIR /app

RUN yarn --network-timeout 600000
RUN yarn lint
RUN yarn build

FROM node:alpine as runner
WORKDIR /app
COPY --from=base --chown=10101 /app/public ./public
COPY --from=base --chown=10101 /app/.next/standalone ./
COPY --from=base --chown=10101 /app/.next/static ./.next/static
COPY --from=base --chown=10101 /app/.env ./.env
EXPOSE 3000

#Start app server upon docker run
CMD ["node", "server.js"]
