# Use an official Node.js image as the base
FROM node:23-alpine AS builder

# Set the working directory in the container
WORKDIR /app
# install bun
RUN apk add --no-cache curl bash \
    && curl -fsSL https://bun.sh/install | bash \
    && ln -s /root/.bun/bin/bun /usr/local/bin/bun
# Copy package.json and package-lock.json first to leverage Docker cache
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY package.json bun.lock ./

# Install dependencies
RUN bun install


COPY . .


RUN bun run build

# --- Production Stage ---
FROM node:23-alpine AS production

WORKDIR /app
RUN apk add --no-cache curl bash \
    && curl -fsSL https://bun.sh/install | bash \
    && ln -s /root/.bun/bin/bun /usr/local/bin/bun
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy only necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY prisma/schema.prisma ./prisma/schema.prisma
EXPOSE 3000


CMD bun db:push && bun start