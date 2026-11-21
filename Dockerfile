FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev --ignore-scripts

COPY src ./src

ENTRYPOINT ["node", "src/mcp-server.mjs"]
