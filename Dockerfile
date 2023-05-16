FROM node:18-alpine AS base

# Create root directory
WORKDIR /src

COPY package.json yarn.lock ./
# Install dependencies with Yarn
RUN yarn install --frozen-lockfile && yarn cache clean
RUN yarn

# Copy app files
COPY . .
