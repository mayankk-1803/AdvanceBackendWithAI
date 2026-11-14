FROM node

WORKDIR /app

# Layers
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY index.js index.js

CMD ["npm", "start"]
