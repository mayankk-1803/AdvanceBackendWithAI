FROM node

WORKDIR /app

# Layers
COPY index.js index.js
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

CMD ["npm", "start"]
