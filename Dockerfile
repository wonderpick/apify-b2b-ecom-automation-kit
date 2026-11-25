FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY src ./src
RUN chown -R node:node /app
USER node

ENTRYPOINT ["node", "src/mcp-server.mjs"]
