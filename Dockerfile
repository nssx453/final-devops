FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests first so Docker can cache dependency installation.
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source after dependencies.
COPY src ./src

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER node

CMD ["npm", "start"]