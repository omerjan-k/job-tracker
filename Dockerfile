# ---------- Stage 1: Build ----------
FROM node:20-bullseye AS builder

# Install Meteor's dependencies (git, curl, python for native builds)
RUN apt-get update && apt-get install -y git curl python3 build-essential

# Install Meteor
RUN curl https://install.meteor.com/ | sh

WORKDIR /app

# Copy only package files first (better layer caching)
COPY package*.json ./
COPY rspack.config.js ./
COPY .meteor/versions ./.meteor/versions
COPY .meteor/release ./.meteor/release
COPY .meteor/packages ./.meteor/packages

# Install npm dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app into a bundle (outputs to /app/bundle)
RUN METEOR_ALLOW_SUPERUSER=true meteor build --directory /app/output --server-only --architecture os.linux.x86_64

# ---------- Stage 2: Run ----------
FROM node:20-bullseye-slim

WORKDIR /app

# Install build dependencies for bcrypt native module
RUN apt-get update && apt-get install -y python3 build-essential

# Copy the built server bundle from Stage 1
COPY --from=builder /app/output/bundle /app/bundle

# Install the server's npm dependencies (Meteor generates its own package.json)
WORKDIR /app/bundle/programs/server
RUN npm install --production

WORKDIR /app/bundle

# Fly.io expects the app to listen on the PORT env var it sets
ENV PORT=8080
EXPOSE 8080

# Meteor's built bundle uses this entrypoint
CMD ["node", "main.js"]