# Base stage: Install dependencies and build the Next.js project
FROM node:18-alpine AS base

WORKDIR /app

# Copy over the package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy over all the source files and build the project
COPY . .

# Environment variables (ensure this is in the right location or update accordingly)
COPY .env /app/.env

# Disable sourcemaps
ENV GENERATE_SOURCEMAP=false

# Build the Next.js app
RUN yarn build

# Runner stage: This stage will use the standalone Next.js build
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only the necessary files for running the app
COPY --from=base /app/package.json /app/yarn.lock ./
COPY --from=base /app/next.config.mjs ./
COPY --from=base /app/public ./public

# Copy the standalone build
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static

# Expose the Next.js app on port 3000
EXPOSE 3000

# Run the Next.js app (it uses the built-in Next.js server)
CMD ["node", "server.js"]
